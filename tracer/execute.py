"""Record a line-by-line trace of a content module.

    python -m tracer.execute -m sections.home sections.projects -o var/traces

The generated JSON has exactly the shape the CS336-style viewer expects::

    {"files": {path: source}, "hidden_line_numbers": {path: [line]},
     "steps": [{"stack": [...], "env": {...}, "renderings": [...]}]}
"""

from __future__ import annotations

import argparse
import importlib
import inspect
import json
import os
import sys
from dataclasses import asdict, dataclass, field
from pathlib import Path
from types import FrameType

from .directives import (
    get_clear_expressions,
    get_inspect_expressions,
    has_hide,
    has_stepover,
    parse_directives,
)
from .renderings import clear_renderings, pop_renderings
from .values import make_value

ROOT = Path(__file__).resolve().parent.parent

# Directories that never contribute steps to a trace.
SKIP_DIRS = {
    ".git",
    ".github",
    ".venv",
    "__pycache__",
    "docs",
    "node_modules",
    "reference",
    "scripts",
    "site",
    "tests",
    "tracer",
    "var",
    "venv",
}


@dataclass
class StackElement:
    path: str
    line_number: int
    function_name: str
    code: str


@dataclass
class Step:
    stack: list[StackElement]
    env: dict[str, dict | None]
    renderings: list[dict]


@dataclass
class Trace:
    files: dict[str, str]
    hidden_line_numbers: dict[str, list[int]]
    steps: list[Step]


class _FrameState:
    """Per-frame bookkeeping: where we are and what the next event should close."""

    def __init__(self, frame: FrameType, path: str, function_name: str):
        self.frame = frame
        self.path = path
        self.function_name = function_name
        self.line_number = frame.f_lineno
        self.code = ""
        self.stepover = False
        self.pending_step: Step | None = None
        self.pending_exprs: list[str] = []


class Tracer:
    def __init__(self, root: Path = ROOT):
        self.root = Path(root).resolve()
        self.files: dict[str, str] = {}
        self.steps: list[Step] = []
        self.states: dict[FrameType, _FrameState] = {}
        self.ignored: set[FrameType] = set()  # frames (and everything below) left untraced
        self.stack: list[_FrameState] = []
        self._line_cache: dict[str, list[str]] = {}

    # ------------------------------------------------------------------ utils

    def relativize(self, path: str | Path) -> str:
        try:
            return str(Path(path).resolve().relative_to(self.root))
        except ValueError:
            return str(Path(path))

    def is_visible(self, path: str) -> bool:
        if not path or path.startswith("<"):
            return False
        try:
            resolved = Path(path).resolve()
            relative = resolved.relative_to(self.root)
        except (ValueError, OSError):
            return False
        if not relative.parts:
            return False
        return relative.parts[0] not in SKIP_DIRS

    def register_file(self, relative_path: str) -> None:
        if relative_path in self.files:
            return
        try:
            self.files[relative_path] = (self.root / relative_path).read_text(encoding="utf-8")
        except OSError:
            self.files[relative_path] = ""

    def source_lines(self, path: str) -> list[str]:
        if path not in self._line_cache:
            try:
                self._line_cache[path] = Path(path).read_text(encoding="utf-8").split("\n")
            except OSError:
                self._line_cache[path] = []
        return self._line_cache[path]

    def source_line(self, path: str, line_number: int) -> str:
        lines = self.source_lines(path)
        if 1 <= line_number <= len(lines):
            return lines[line_number - 1]
        return ""

    def stack_elements(self) -> list[StackElement]:
        return [
            StackElement(
                path=state.path,
                line_number=state.line_number,
                function_name=state.function_name,
                code=state.code,
            )
            for state in self.stack
        ]

    # ----------------------------------------------------------------- tracing

    def __call__(self, frame: FrameType, event: str, arg: Any) -> Any:
        """Global trace function: decides which frames get a local tracer."""
        path = frame.f_code.co_filename
        if not self.is_visible(path):
            return None

        if event == "call":
            parent_frame = frame.f_back
            parent = self.states.get(parent_frame)
            skipped = (parent is not None and parent.stepover) or (
                parent_frame is not None and parent_frame in self.ignored
            )
            if skipped:
                # Neither this call nor anything it calls contributes steps.
                self.ignored.add(frame)
                return None
            relative = self.relativize(path)
            self.register_file(relative)
            state = _FrameState(frame, relative, frame.f_code.co_name)
            self.states[frame] = state
            self.stack.append(state)
            return self.local_trace

        return self.local_trace(frame, event, arg)

    def local_trace(self, frame: FrameType, event: str, arg: Any) -> Any:
        state = self.states.get(frame)
        if state is None:
            return None

        if event == "line":
            # The previous line of this frame has finished executing: close it.
            self.close_step(state)
            line = self.source_line(frame.f_code.co_filename, frame.f_lineno)
            state.line_number = frame.f_lineno
            state.code = line

            directives = parse_directives(line)
            step = Step(stack=self.stack_elements(), env={}, renderings=[])
            self.steps.append(step)
            state.pending_step = step
            state.pending_exprs = get_inspect_expressions(directives)
            for expr in get_clear_expressions(directives):
                step.env[expr] = None
            state.stepover = has_stepover(directives)
            if has_hide(directives):
                pass  # handled when the trace is assembled
            return self.local_trace

        if event == "return":
            self.close_step(state)
            self.stack = [item for item in self.stack if item is not state]
            self.states.pop(frame, None)
            return self.local_trace

        return self.local_trace

    def close_step(self, state: _FrameState) -> None:
        step = state.pending_step
        if step is None:
            return
        for expr in state.pending_exprs:
            step.env[expr] = self.evaluate(state.frame, expr)
        step.renderings = pop_renderings()
        state.pending_step = None
        state.pending_exprs = []

    def evaluate(self, frame: FrameType, expr: str) -> dict | None:
        try:
            value = eval(expr, frame.f_globals, frame.f_locals)  # noqa: S307 - content is authored by the repo owner
        except Exception:
            return None
        if value is None:
            return None
        return make_value(value)

    def finalize(self) -> None:
        for state in list(self.stack):
            self.close_step(state)
        clear_renderings()


def compute_hidden_line_numbers(files: dict[str, str]) -> dict[str, list[int]]:
    result: dict[str, list[int]] = {}
    for path, contents in files.items():
        hidden = []
        for index, line in enumerate(contents.split("\n")):
            if has_hide(parse_directives(line)):
                hidden.append(index + 1)
        result[path] = hidden
    return result


def execute(module_name: str, root: Path = ROOT) -> Trace:
    """Import `module_name`, run its `main()` and return the recorded trace."""
    tracer = Tracer(root)
    clear_renderings()

    module = importlib.import_module(module_name)
    entry = tracer.relativize(inspect.getfile(module))
    tracer.register_file(entry)

    sys.settrace(tracer)
    try:
        module.main()
    finally:
        sys.settrace(None)
        tracer.finalize()

    return Trace(
        files=tracer.files,
        hidden_line_numbers=compute_hidden_line_numbers(tracer.files),
        steps=tracer.steps,
    )


def write_trace(module_name: str, output_path: str = "var/traces", root: Path = ROOT) -> Path:
    trace = execute(module_name=module_name, root=root)
    os.makedirs(output_path, exist_ok=True)
    target = Path(output_path) / f"{module_name.rsplit('.', 1)[-1]}.json"
    with open(target, "w", encoding="utf-8") as f:
        json.dump(asdict(trace), f, indent=2)
    print(f"  {module_name}: {len(trace.steps)} steps -> {target}")
    return target


def main() -> None:
    parser = argparse.ArgumentParser(description="Compile content scripts into traces.")
    parser.add_argument(
        "-m",
        "--module",
        nargs="+",
        required=True,
        help="Modules to execute (e.g. sections.home)",
    )
    parser.add_argument(
        "-o",
        "--output_path",
        default="var/traces",
        help="Directory to write trace JSON into (default: var/traces)",
    )
    args = parser.parse_args()

    for module_name in args.module:
        write_trace(module_name=module_name.replace(".py", ""), output_path=args.output_path)


if __name__ == "__main__":
    main()
