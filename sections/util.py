"""Small helpers shared by the section scripts.

Call sites use `# @stepover` so these plumbing lines stay out of the trace.
"""

from datetime import date

MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]


def parse_month(value: str) -> tuple[int, int]:
    """\"2024-02\" -> (2024, 2)."""
    year, month = value.split("-")[:2]
    return int(year), int(month)


def format_month(value: str | None) -> str:
    if not value:
        return "Present"
    year, month = parse_month(value)
    return f"{MONTHS[month - 1]} {year}"


def format_span(start: str, end: str | None) -> str:
    return f"{format_month(start)} – {format_month(end)}"


def months_between(start: str, end: str | None) -> int:
    start_year, start_month = parse_month(start)
    if end is None:
        today = date.today()
        end_year, end_month = today.year, today.month
    else:
        end_year, end_month = parse_month(end)
    return max(0, (end_year - start_year) * 12 + (end_month - start_month))


def duration_label(months: int) -> str:
    years, rest = divmod(months, 12)
    if years and rest:
        return f"{years} yr {rest} mo"
    if years:
        return f"{years} yr"
    return f"{rest} mo"


def today_ym() -> str:
    today = date.today()
    return f"{today.year:04d}-{today.month:02d}"
