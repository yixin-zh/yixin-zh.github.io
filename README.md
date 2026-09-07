# my-online-resume

An online portfolio that is **executed, not written**: the pages are a recording
of a Python script running line by line.  Content is authored in `sections/*.py`,
compiled by the in-repo tracer into a trace JSON, and played back in the browser
— the same interaction model as
[Stanford CS336's executable lectures](https://cs336.stanford.edu/lectures/?trace=lecture_02).

Live at `https://<your-user>.github.io/my-online-resume/`.

```
content.py ──► sections/*.py ──► tracer (stdlib) ──► var/traces/*.json ──┐
images/, media/ ─────────────────────────────────────────────────────────┼─► docs/ ──► GitHub Pages
site/ (Vite + React + Tailwind viewer) ──────────────────────────────────┘
```

## Quick start

```bash
python3 build.py          # compile the traces into var/
scripts/dev.sh            # same, then start the dev server on :5173
```

Then open <http://localhost:5173/my-online-resume/>.

Production build (writes `docs/`):

```bash
python3 build.py
npm --prefix site run build
```

## Making it yours

1. **Edit `content.py`** — name, title, links, education, jobs, projects,
   publications, skills.  It is plain Python data and the only file most people
   need to touch.
2. **Drop media into `images/` and `media/`** and reference them from a section
   script (`image("images/thing.png", width=760)`, `video("media/demo.mp4")`).
   Missing files fail the build loudly instead of 404-ing on the site.
3. **Adjust the narrative in `sections/`** if you want a different structure.
   One module per section; add a module by appending to `SECTIONS` in
   `build.py` (the navigation bar is generated from that list).

## Authoring API

```python
from tracer import text, image, video, link, plot, note

def main():
    text("## Hello")                       # markdown (headings, lists, links, code)
    image("images/avatar.svg", width=240)  # local file or URL
    video("media/demo.mp4", width=720)     # local file or URL
    link(title="GitHub", url="https://github.com/me")
    plot({"title": "Citations", "unit": "", "items": [{"label": "2025", "value": 154}]})
    note("only shown when notes are toggled with N")

    years = 2026 - 2019                    # @inspect years   <- shown in the side panel
    text("…")                              # @clear years     <- stop showing it
    helper()                               # @stepover        <- don't trace into it
    import os                              # @hide            <- hide this line
```

Directives are read from the trailing comment of the line being traced.

## Keyboard

| key | action |
| --- | --- |
| `→` / `↓` | next step |
| `←` / `↑` | previous step |
| `shift + →` | step over (skip deeper calls) |
| `space` | play / pause |
| `E` | toggle the variables panel |
| `N` | toggle notes |
| `Home` / `End` | first / last step |

Every step is linkable: `?trace=projects&step=42`.  Without `?step=` the whole
section is shown at once (so the portfolio is readable without pressing
anything); press play to walk it from the first line.

## Deploying

1. Push to `main`.
2. Repository **Settings → Pages → Source: GitHub Actions**.
3. The workflow in `.github/workflows/deploy.yml` runs the tracer tests,
   compiles the traces, builds the site and publishes `docs/`.

The base path is the repository name (`/my-online-resume/`).  It is baked into
the build via `BASE_PATH`; the workflow sets it from the repo name, so renaming
the repository needs no code change — but when running `npm run build` by hand
from a differently named checkout, pass `BASE_PATH=/<repo>/`.

## Tests

```bash
python3 -m unittest discover -s tests
```

`tests/test_tracer.py` checks the tracer's behaviour and compares the produced
JSON against a real CS336 trace (`tests/fixtures/golden_cs336.json`, a trimmed
copy of `reference/cs336/var/traces/lecture_02.json`) so the viewer contract
stays compatible.

`reference/` is read-only third-party material and is not committed.
