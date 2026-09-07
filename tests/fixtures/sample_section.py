"""Fixture traced by tests/test_tracer.py (kept under tests/, which is not traced)."""

from tracer import image, link, note, text


def helper(items):
    for item in items:
        text(f"- {item}")


def main():
    text("# Sample section")
    years = 2026 - 2019  # @inspect years
    helper(["alpha", "beta"])  # @stepover
    text("plumbing that should never be shown")  # @hide
    link(title="Example", url="https://example.com")
    note("a hidden note")
    image("https://example.com/figure.png", width=480)
    counts = {"projects": 4, "papers": 2}  # @inspect counts
    text("done")  # @clear years
