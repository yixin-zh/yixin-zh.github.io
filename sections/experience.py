"""Education, work history, and skills — with the durations computed, not typed."""

from content import EDUCATION, EXPERIENCE, SKILLS, SKILL_LEVELS
from sections.util import duration_label, format_span, months_between, today_ym
from tracer import plot, text


def main():
    text("## Experience")
    text("Education first, then the jobs that paid for the GPUs.")

    text("### Education")
    for entry in EDUCATION:
        show_education(entry)

    text("### Work")
    for entry in EXPERIENCE:
        show_job(entry)

    text("### How long, in total")
    first_job = EXPERIENCE[-1]["start"]  # @inspect first_job
    total_months = months_between(first_job, today_ym())  # @stepover @inspect total_months
    total_years = round(total_months / 12, 1)  # @inspect total_years
    text(f"Roughly **{duration_label(total_months)}** of hands-on industry and research work.")  # @stepover

    text("### Skills")
    for group, items in SKILLS.items():
        text(f"**{group}**: " + ", ".join(f"`{item}`" for item in items))

    plot(
        {
            "title": "Self-assessed depth",
            "unit": "/100",
            "items": [{"label": label, "value": value} for label, value in SKILL_LEVELS.items()],
        }
    )


def show_education(entry):
    text(f"**{entry['school']}** — {entry['degree']}")
    span = format_span(entry["start"], entry["end"])  # @stepover @inspect span
    text(f"`{span}` · {entry['location']}")
    for detail in entry["details"]:
        text(f"  - {detail}")


def show_job(entry):
    text(f"### {entry['role']} · {entry['company']}")
    span = format_span(entry["start"], entry["end"])  # @stepover @inspect span
    months = months_between(entry["start"], entry["end"])  # @stepover @inspect months
    text(f"`{span}` ({duration_label(months)}) · {entry['location']}")  # @stepover
    for highlight in entry["highlights"]:
        text(f"- {highlight}")
    text("Stack: " + ", ".join(f"`{item}`" for item in entry["stack"]))
