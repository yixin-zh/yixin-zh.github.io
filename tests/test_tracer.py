"""Schema + behaviour tests for the in-repo tracer.

Run with either:

    python -m unittest discover -s tests -v
    pytest tests
"""

from __future__ import annotations

import json
import sys
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT))

from tracer.directives import parse_directives  # noqa: E402
from tracer.execute import execute  # noqa: E402

FIXTURES = Path(__file__).resolve().parent / "fixtures"
# A real CS336 trace (markdown/image/link renderings + inspected variables).
# The full trace lives in reference/ (not committed); the committed fixture is a
# trimmed copy of it so the comparison also runs in CI.
GOLDEN = ROOT / "reference" / "cs336" / "var" / "traces" / "lecture_02.json"
GOLDEN_FIXTURE = Path(__file__).resolve().parent / "fixtures" / "golden_cs336.json"


def load_golden() -> dict:
    path = GOLDEN if GOLDEN.exists() else GOLDEN_FIXTURE
    return json.loads(path.read_text())


def run_sample(name: str = "sample_section"):
    sys.path.insert(0, str(FIXTURES))
    try:
        return execute(module_name=name, root=FIXTURES)
    finally:
        sys.path.pop(0)


class DirectiveParsingTest(unittest.TestCase):
    def test_parses_inspect_and_hide(self):
        directives = parse_directives("x = 1  # @inspect x y @hide")
        self.assertEqual([d.name for d in directives], ["@inspect", "@hide"])
        self.assertEqual(directives[0].args, ("x", "y"))

    def test_ignores_unknown_directives(self):
        self.assertEqual(parse_directives("x = 1  # @typo foo"), [])
        self.assertEqual(parse_directives("x = 1"), [])


class TraceShapeTest(unittest.TestCase):
    def test_top_level_keys_match_golden_trace(self):
        golden = load_golden()
        trace = run_sample()
        produced = json.loads(json.dumps(_to_dict(trace)))
        self.assertEqual(set(produced.keys()), set(golden.keys()))
        self.assertEqual(set(produced["steps"][0].keys()), set(golden["steps"][0].keys()))

    def test_rendering_keys_match_golden_trace(self):
        golden = load_golden()
        golden_keys = {key for step in golden["steps"] for r in step["renderings"] for key in r}
        trace = run_sample()
        produced_keys = {
            key for step in trace.steps for r in step.renderings for key in r
        }
        self.assertEqual(produced_keys, golden_keys)

    def test_env_entry_keys_match_golden_trace(self):
        golden = load_golden()
        golden_keys = {
            key
            for step in golden["steps"]
            for value in step["env"].values()
            if isinstance(value, dict)
            for key in value
        }
        trace = run_sample()
        produced_keys = {
            key
            for step in trace.steps
            for value in step.env.values()
            if isinstance(value, dict)
            for key in value
        }
        self.assertEqual(produced_keys, golden_keys)


class TracerBehaviourTest(unittest.TestCase):
    def test_captures_inspected_values(self):
        trace = run_sample()
        envs = [value for step in trace.steps for value in step.env.values()]
        years = [value for value in envs if value and value.get("contents") == 7]
        self.assertTrue(years, "expected years == 7 to be captured")
        self.assertEqual(years[0]["type"], "int")

    def test_clear_marks_variable_as_none(self):
        trace = run_sample()
        cleared = [step for step in trace.steps if "years" in step.env and step.env["years"] is None]
        self.assertTrue(cleared, "expected @clear years to emit env value None")

    def test_stepover_does_not_descend(self):
        trace = run_sample()
        functions = {element.function_name for step in trace.steps for element in step.stack}
        self.assertNotIn("helper", functions)

    def test_hide_is_recorded(self):
        trace = run_sample()
        hidden = [line for lines in trace.hidden_line_numbers.values() for line in lines]
        self.assertTrue(hidden, "expected at least one hidden line")

    def test_renderings_are_attached_to_the_line_that_made_them(self):
        trace = run_sample()
        types = [r["type"] for step in trace.steps for r in step.renderings]
        self.assertIn("markdown", types)
        self.assertIn("link", types)
        self.assertIn("note", types)
        self.assertIn("image", types)
        link_rendering = next(
            r for step in trace.steps for r in step.renderings if r["type"] == "link"
        )
        self.assertEqual(link_rendering["external_link"]["url"], "https://example.com")

    def test_every_step_has_a_non_empty_stack(self):
        trace = run_sample()
        for step in trace.steps:
            self.assertTrue(step.stack)
            self.assertTrue(step.stack[-1].code.strip())


def _to_dict(trace):
    from dataclasses import asdict

    return asdict(trace)


if __name__ == "__main__":
    unittest.main(verbosity=2)
