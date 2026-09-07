"""Compile the portfolio.

    python3 build.py

Writes the site payload into `var/`:

    var/traces/<section>.json   one trace per section
    var/traces/index.json       manifest used by the navigation bar
    var/images/  var/media/     static media (copied from images/ and media/)

`var/` is the public dir of the Vite app in `site/`, so everything here ends up
at the root of the built site.
"""

from __future__ import annotations

import json
import shutil
import sys
from dataclasses import asdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from tracer.execute import execute  # noqa: E402

PAYLOAD = ROOT / "var"
TRACES = PAYLOAD / "traces"

SECTIONS = [
    {"id": "home", "label": "Home", "module": "sections.home", "icon": "user"},
    {"id": "experience", "label": "Experience", "module": "sections.experience", "icon": "briefcase"},
    {"id": "projects", "label": "Projects", "module": "sections.projects", "icon": "layers"},
    {"id": "publications", "label": "Publications", "module": "sections.publications", "icon": "book"},
]


def build() -> list[dict]:
    TRACES.mkdir(parents=True, exist_ok=True)

    manifest = []
    for section in SECTIONS:
        trace = execute(module_name=section["module"], root=ROOT)
        target = TRACES / f"{section['id']}.json"
        with open(target, "w", encoding="utf-8") as f:
            json.dump(asdict(trace), f, indent=2)
        manifest.append({**section, "steps": len(trace.steps), "trace": f"traces/{section['id']}.json"})
        print(f"  {section['id']:<14} {len(trace.steps):>4} steps -> {target.relative_to(ROOT)}")

    with open(TRACES / "index.json", "w", encoding="utf-8") as f:
        json.dump({"sections": manifest}, f, indent=2)
    print(f"  manifest       {len(manifest)} sections -> {TRACES / 'index.json'}")

    for folder in ("images", "media"):
        source = ROOT / folder
        if not source.exists():
            continue
        target = PAYLOAD / folder
        if target.exists():
            shutil.rmtree(target)
        shutil.copytree(source, target)
        count = len([p for p in target.rglob("*") if p.is_file()])
        print(f"  {folder:<14} {count:>4} files  -> {target.relative_to(ROOT)}")

    docs = ROOT / "docs"
    if docs.exists():
        (docs / ".nojekyll").touch()

    return manifest


if __name__ == "__main__":
    print("Building traces")
    build()
    print("Done. Run `scripts/dev.sh` to preview.")
