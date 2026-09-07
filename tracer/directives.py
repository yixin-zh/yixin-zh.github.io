"""Parsing of the `@`-directives written in trailing comments of traced lines."""

from __future__ import annotations

from dataclasses import dataclass

DIRECTIVE_INSPECT = "@inspect"  # Show (and keep updating) the value of a variable
DIRECTIVE_CLEAR = "@clear"  # Stop showing the value of a variable
DIRECTIVE_STEPOVER = "@stepover"  # Don't trace into the calls made by this line
DIRECTIVE_HIDE = "@hide"  # Don't show this line at all

ACCEPTED_DIRECTIVES = [
    DIRECTIVE_INSPECT,
    DIRECTIVE_CLEAR,
    DIRECTIVE_STEPOVER,
    DIRECTIVE_HIDE,
]


@dataclass(frozen=True)
class Directive:
    name: str
    args: tuple[str, ...]


def parse_directives(line: str) -> list[Directive]:
    """Parse `"... # @inspect x @hide"` -> [Directive("@inspect", ("x",)), Directive("@hide", ())]."""
    if "#" not in line:
        return []

    comment = line.split("#", 1)[1]
    directives: list[Directive] = []
    current: Directive | None = None

    for token in comment.split():
        if token.startswith("@"):
            if current is not None:
                directives.append(current)
            if token not in ACCEPTED_DIRECTIVES:
                current = None
                continue
            current = Directive(name=token, args=())
        elif current is not None:
            current = Directive(name=current.name, args=current.args + (token,))

    if current is not None:
        directives.append(current)
    return directives


def get_inspect_expressions(directives: list[Directive]) -> list[str]:
    return [arg for d in directives if d.name == DIRECTIVE_INSPECT for arg in d.args]


def get_clear_expressions(directives: list[Directive]) -> list[str]:
    return [arg for d in directives if d.name == DIRECTIVE_CLEAR for arg in d.args]


def has_stepover(directives: list[Directive]) -> bool:
    return any(d.name == DIRECTIVE_STEPOVER for d in directives)


def has_hide(directives: list[Directive]) -> bool:
    return any(d.name == DIRECTIVE_HIDE for d in directives)
