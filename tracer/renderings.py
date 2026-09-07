"""Rendering primitives appended to a queue and drained by the tracer.

Every rendering-producing call (``text``, ``image``, ``video``, ``link``,
``plot``, ``note``) appends to a module level queue.  The tracer pops the queue
after each executed line and attaches the result to that line's step, so the
viewer shows the rendering *instead of* the raw source line.
"""

from __future__ import annotations

import inspect
from dataclasses import asdict, dataclass
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parent.parent


@dataclass
class Rendering:
    """One piece of output shown in place of (or next to) a line of code."""

    type: str  # markdown | image | video | link | plot | note
    data: Any | None = None
    style: dict | None = None
    external_link: dict | None = None
    internal_link: dict | None = None


_current_renderings: list[Rendering] = []


def add_rendering(rendering: Rendering) -> None:
    _current_renderings.append(rendering)


def pop_renderings() -> list[dict]:
    """Return everything rendered since the previous pop (as plain dicts)."""
    global _current_renderings
    items, _current_renderings = _current_renderings, []
    return [asdict(item) for item in items]


def clear_renderings() -> None:
    _current_renderings.clear()


def is_url(value: str) -> bool:
    return value.startswith("http://") or value.startswith("https://")


def _resolve_local(path: str) -> str:
    """Fail fast when a local media file is missing (avoids 404s on the site)."""
    candidate = Path(path)
    if not candidate.is_absolute():
        candidate = ROOT / candidate
    if not candidate.exists():
        raise FileNotFoundError(
            f"Media file not found: {path!r} (resolved to {candidate}). "
            f"Add the file or update the path in your content script."
        )
    return path


def text(message: str, style: dict | None = None, verbatim: bool = False) -> None:
    """Render `message` as markdown (or as pre-formatted text when verbatim)."""
    style = dict(style or {})
    if verbatim:
        messages = message.split("\n")
        style = {"fontFamily": "monospace", "whiteSpace": "pre", **style}
    else:
        messages = [message]
    for item in messages:
        add_rendering(Rendering(type="markdown", data=item, style=style))


def image(url: str, style: dict | None = None, width: int | str | None = None) -> None:
    """Show an image.  `url` is a URL or a path relative to the repository root."""
    style = dict(style or {})
    if width is not None:
        style["width"] = width
    path = url if is_url(url) else _resolve_local(url)
    add_rendering(Rendering(type="image", data=path, style=style))


def video(url: str, style: dict | None = None, width: int | str | None = None) -> None:
    """Embed a video (mp4/webm).  `url` is a URL or a repo-relative path."""
    style = dict(style or {})
    if width is not None:
        style["width"] = width
    path = url if is_url(url) else _resolve_local(url)
    add_rendering(Rendering(type="video", data=path, style=style))


def link(arg: Any = None, style: dict | None = None, **kwargs: Any) -> None:
    """Show a link card.

    Usage:
        link(title="...", url="...")   explicit title + url
        link("https://...")            url only (title falls back to the url)
        link(my_function)              jump to the source of a callable
    """
    style = dict(style or {})
    title = kwargs.pop("title", None)
    url = kwargs.pop("url", None)

    if callable(arg) and not isinstance(arg, str):
        try:
            path = str(Path(inspect.getfile(arg)).resolve().relative_to(ROOT))
            line_number = inspect.getsourcelines(arg)[1]
        except (OSError, TypeError, ValueError):
            path, line_number = None, None
        add_rendering(
            Rendering(
                type="link",
                data=getattr(arg, "__name__", str(arg)),
                style=style,
                internal_link={"path": path, "line_number": line_number},
            )
        )
        return

    if isinstance(arg, str) and url is None:
        url = arg

    if not url:
        raise ValueError("link() needs a url, e.g. link(title='GitHub', url='https://...')")

    reference: dict[str, Any] = {"url": url}
    reference.update(kwargs)
    reference["title"] = title or kwargs.get("title") or url
    if kwargs.get("source"):
        reference.setdefault("source", kwargs["source"])
    add_rendering(
        Rendering(type="link", data=reference["title"], style=style, external_link=reference)
    )


def note(message: str) -> None:
    """A speaker-note style annotation (hidden unless notes are toggled on)."""
    add_rendering(Rendering(type="note", data=message))


def plot(spec: dict) -> None:
    """Show a small bar chart: {"title", "unit", "items": [{"label", "value"}]}."""
    if "items" not in spec:
        raise ValueError("plot() needs a spec with an 'items' list")
    add_rendering(Rendering(type="plot", data=spec))
