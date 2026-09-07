"""Publications, preprints and talks."""

from content import PUBLICATIONS, TALKS
from tracer import link, plot, text


def main():
    text("## Publications")
    text("Systems papers first: measurement, kernels, and the occasional benchmark.")

    for paper in PUBLICATIONS:
        show_paper(paper)

    text("### Citations by year")
    citations = {"2022": 18, "2023": 41, "2024": 96, "2025": 154}  # @inspect citations
    total_citations = sum(citations.values())  # @inspect total_citations
    plot(
        {
            "title": "Citations per year",
            "unit": "",
            "items": [{"label": year, "value": count} for year, count in citations.items()],
        }
    )

    text("### Talks")
    for talk in TALKS:
        text(f"- {talk}")


def show_paper(paper):
    text(f"**{paper['title']}**")
    text(f"{paper['authors']} · *{paper['venue']} {paper['year']}*")
    for label, url in paper["links"].items():
        link(title=label, url=url, source=f"{paper['venue']} {paper['year']}")
