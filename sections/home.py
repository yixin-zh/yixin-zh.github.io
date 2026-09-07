"""Landing section: who I am, what I build, and where to go next."""

from datetime import date

from content import EXPERIENCE, LINKS, PROFILE, PROJECTS, PUBLICATIONS
from tracer import image, link, plot, text


def main():
    text(f"# {PROFILE['name']}")
    text(f"### {PROFILE['title']}")
    text(f"{PROFILE['location']} · [{PROFILE['email']}](mailto:{PROFILE['email']})")

    image("images/avatar.svg", width=240)

    text(PROFILE["summary"])

    text("## What I work on")
    for item in PROFILE["focus"]:
        text(f"- {item}")

    text("## By the numbers")
    career_start = date(2019, 6, 1)  # @inspect career_start
    years_active = round((date.today() - career_start).days / 365.25, 1)  # @inspect years_active
    shipped_projects = len(PROJECTS)  # @inspect shipped_projects
    papers = len(PUBLICATIONS)  # @inspect papers
    roles = len(EXPERIENCE)  # @inspect roles

    plot(
        {
            "title": "How I spend my engineering time",
            "unit": "%",
            "items": [
                {"label": "Training systems", "value": 40},
                {"label": "Inference & serving", "value": 30},
                {"label": "Profiling", "value": 18},
                {"label": "Eval & data", "value": 12},
            ],
        }
    )

    text("## Find me here")
    for label, url in LINKS.items():
        link(title=label, url=url)

    text("## Read next")
    text("- [Experience](?trace=experience) — where I have worked and what I shipped")
    text("- [Projects](?trace=projects) — the things I would show you first")
    text("- [Publications](?trace=publications) — papers, preprints and talks")
    text("Tip: press `→` to advance line by line, or open the last step to see everything at once.")
