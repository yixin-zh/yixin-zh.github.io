"""Project gallery: one card per project, with screenshots, demos and links."""

from pathlib import Path

from content import PROJECTS
from tracer import image, link, text, video


def main():
    text("## Projects")
    text("Things I built end to end. Each one has a repo you can read and a number you can check.")

    for project in PROJECTS:
        show_project(project)

    text("### What I would build next")
    text("- A reproducible 8-GPU pretraining recipe that fits in a weekend budget")
    text("- An open roofline profiler that ships as a single `pip install`")


def show_project(project):
    text(f"### {project['name']} · {project['year']}")
    text(project["tagline"])

    if project["image"]:
        image(project["image"], width=760)

    for highlight in project["highlights"]:
        text(f"- {highlight}")

    text("Stack: " + ", ".join(f"`{item}`" for item in project["stack"]))

    for label, url in project["links"].items():
        link(title=f"{project['name']} — {label}", url=url, source=f"{project['name']} ({project['year']})")

    demo = project["video"]
    if demo and Path(demo).exists():
        text("**Demo**")
        video(demo, width=720)
