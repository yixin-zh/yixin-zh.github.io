#!/usr/bin/env python3
"""Build web-ready portfolio visuals from the repository's source artifacts."""

from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageEnhance


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "assets" / "portfolio"


def render_page(pdf_path: Path, page_number: int, width: int) -> Image.Image:
    """Render a one-indexed PDF page to an RGB PIL image."""
    document = pdfium.PdfDocument(pdf_path)
    page = document[page_number - 1]
    page_width, _ = page.get_size()
    scale = width / page_width
    return page.render(scale=scale).to_pil().convert("RGB")


def save_webp(image: Image.Image, filename: str, quality: int = 84) -> None:
    image = ImageEnhance.Sharpness(image).enhance(1.05)
    image.save(OUTPUT / filename, "WEBP", quality=quality, method=6)


def build_pdf_visuals() -> None:
    slides = ROOT / "raw" / "previous-slides.pdf"
    acceptance = ROOT / "raw" / "word_extraction" / "项目验收书.pdf"

    save_webp(render_page(slides, 8, 1440), "dqn-results.webp")
    save_webp(render_page(slides, 10, 1440), "moya-collaboration.webp")
    save_webp(render_page(slides, 11, 1440), "moya-schema.webp")
    save_webp(render_page(slides, 2, 1440), "video-text-pipeline.webp")

    results_page = render_page(acceptance, 38, 1500)
    width, height = results_page.size
    results_crop = results_page.crop(
        (
            int(width * 0.10),
            int(height * 0.34),
            int(width * 0.94),
            int(height * 0.86),
        )
    )
    save_webp(results_crop, "video-text-results.webp", quality=86)


def build_cabinet_poster() -> None:
    source = ROOT / "raw" / "cabinet-operation.mp4"
    with tempfile.TemporaryDirectory(prefix="portfolio-poster-") as temp_dir:
        subprocess.run(
            [
                "/usr/bin/qlmanage",
                "-t",
                "-s",
                "1600",
                "-o",
                temp_dir,
                str(source),
            ],
            check=True,
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        generated = Path(temp_dir) / f"{source.name}.png"
        image = Image.open(generated).convert("RGB")
        image.save(
            OUTPUT / "cabinet-poster.jpg",
            "JPEG",
            quality=82,
            optimize=True,
            progressive=True,
        )


def main() -> None:
    OUTPUT.mkdir(parents=True, exist_ok=True)
    build_pdf_visuals()
    if shutil.which("qlmanage"):
        build_cabinet_poster()


if __name__ == "__main__":
    main()
