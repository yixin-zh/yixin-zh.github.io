"""A tiny line-by-line tracer for building executable portfolios.

The output JSON is byte-for-byte compatible with the viewer contract used by
Stanford CS336's executable lectures (see `reference/cs336`), so any player that
understands that format can render the traces produced here.

Content scripts use the rendering API::

    from tracer import text, image, video, link, plot, note

    def main():
        text("## Hello")            # markdown
        years = 2026 - 2019         # @inspect years
        image("images/avatar.svg", width=320)

Directives (written in a trailing comment) control the trace:

    ``# @inspect x y``   show (and keep updating) the values of x and y
    ``# @clear x``       stop showing x
    ``# @stepover``      do not trace into calls made by this line
    ``# @hide``          never show this line in the viewer
"""

from .renderings import (
    Rendering,
    clear_renderings,
    image,
    link,
    note,
    plot,
    text,
    video,
)

__all__ = [
    "Rendering",
    "text",
    "image",
    "video",
    "link",
    "note",
    "plot",
    "clear_renderings",
]
