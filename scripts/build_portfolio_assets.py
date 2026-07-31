#!/usr/bin/env python3
"""Build web-ready portfolio visuals from a private source archive."""

from __future__ import annotations

import argparse
import io
import shutil
import subprocess
import tempfile
import zipfile
from pathlib import Path

import pypdfium2 as pdfium
from PIL import Image, ImageEnhance, ImageOps


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
    image = ImageEnhance.Sharpness(image.convert("RGB")).enhance(1.05)
    image.save(OUTPUT / filename, "WEBP", quality=quality, method=6)


def crop_fraction(
    image: Image.Image,
    left: float,
    top: float,
    right: float,
    bottom: float,
) -> Image.Image:
    """Crop using fractions so the source render width can change safely."""
    width, height = image.size
    return image.crop(
        (
            round(width * left),
            round(height * top),
            round(width * right),
            round(height * bottom),
        )
    )


def build_pdf_visuals(source_dir: Path) -> None:
    slides = source_dir / "previous-slides.pdf"
    acceptance = source_dir / "word_extraction" / "项目验收书.pdf"
    zuguang = source_dir / "word_extraction" / "祖光杯PPT_改.pdf"

    dqn_simulation = render_page(slides, 7, 1600)
    save_webp(
        crop_fraction(dqn_simulation, 0.29, 0.11, 0.75, 0.97),
        "dqn-simulation.webp",
        quality=88,
    )

    dqn_results = render_page(slides, 8, 1600)
    save_webp(
        crop_fraction(dqn_results, 0.035, 0.27, 0.51, 0.56),
        "dqn-scorecard.webp",
        quality=88,
    )
    save_webp(
        crop_fraction(dqn_results, 0.515, 0.075, 0.995, 0.70),
        "dqn-learning-curves.webp",
        quality=88,
    )

    moya_scenarios = render_page(slides, 10, 1600)
    save_webp(
        # Keep the complete left scenario panel without the central arrow.
        crop_fraction(moya_scenarios, 0.015, 0.13, 0.438, 0.94),
        "moya-scenario-autarky.webp",
        quality=88,
    )
    save_webp(
        crop_fraction(moya_scenarios, 0.52, 0.13, 0.995, 0.94),
        "moya-scenario-cooperation.webp",
        quality=88,
    )

    moya_schema = render_page(slides, 11, 1600)
    save_webp(
        crop_fraction(moya_schema, 0.08, 0.09, 0.53, 0.995),
        "moya-case-model.webp",
        quality=88,
    )
    save_webp(
        crop_fraction(moya_schema, 0.62, 0.21, 0.885, 0.85),
        "moya-file-tree.webp",
        quality=88,
    )

    ocr_pipeline = render_page(slides, 2, 1600)
    save_webp(
        crop_fraction(ocr_pipeline, 0.09, 0.15, 0.89, 0.87),
        "ocr-system-flow.webp",
        quality=88,
    )

    # Page 3 contains project-specific before/after Chinese text examples.
    # Isolate two strong rows instead of publishing the surrounding slide or
    # presenting a benchmark reference as if it were a project output.
    ocr_examples = render_page(slides, 3, 1600)
    example_pairs = [
        (0.215, 0.259, 0.459, 0.348, 0.506, 0.259, 0.751, 0.348),
        (0.215, 0.556, 0.459, 0.651, 0.506, 0.556, 0.751, 0.651),
    ]
    for index, (
        before_left,
        before_top,
        before_right,
        before_bottom,
        after_left,
        after_top,
        after_right,
        after_bottom,
    ) in enumerate(example_pairs, start=1):
        save_webp(
            crop_fraction(
                ocr_examples,
                before_left,
                before_top,
                before_right,
                before_bottom,
            ),
            f"ocr-text-before-{index:02d}.webp",
            quality=90,
        )
        save_webp(
            crop_fraction(
                ocr_examples,
                after_left,
                after_top,
                after_right,
                after_bottom,
            ),
            f"ocr-text-after-{index:02d}.webp",
            quality=90,
        )

    ocr_restoration = render_page(zuguang, 10, 1600)
    restoration_comparison = crop_fraction(
        ocr_restoration,
        0.435,
        0.235,
        0.815,
        0.49,
    )
    save_webp(
        restoration_comparison,
        "ocr-restoration-comparison.webp",
        quality=88,
    )

    # The source slide reproduces a VRT benchmark grid. Keep only the low-quality
    # input, the VRT reconstruction, and ground truth so the visual difference
    # remains legible at portfolio scale. This is method context, not a project
    # output, and is labelled accordingly in the page.
    restoration_cells = [
        crop_fraction(restoration_comparison, 0.005, 0.015, 0.245, 0.50),
        crop_fraction(restoration_comparison, 0.505, 0.54, 0.735, 0.995),
        crop_fraction(restoration_comparison, 0.755, 0.54, 0.965, 0.995),
    ]
    cell_width = max(cell.width for cell in restoration_cells)
    cell_height = max(cell.height for cell in restoration_cells)
    gap = 12
    triptych = Image.new(
        "RGB",
        (cell_width * len(restoration_cells) + gap * 2, cell_height),
        "#fcfbf7",
    )
    for index, cell in enumerate(restoration_cells):
        fitted = ImageOps.pad(
            cell,
            (cell_width, cell_height),
            color="#fcfbf7",
            method=Image.Resampling.LANCZOS,
        )
        triptych.paste(fitted, (index * (cell_width + gap), 0))
    triptych = triptych.resize(
        (triptych.width * 2, triptych.height * 2),
        Image.Resampling.LANCZOS,
    )
    save_webp(triptych, "ocr-vrt-triptych.webp", quality=90)

    results_page = render_page(acceptance, 38, 1500)
    save_webp(
        crop_fraction(results_page, 0.12, 0.055, 0.94, 0.315),
        "ocr-attention-maps.webp",
        quality=88,
    )


def build_wastewater_visuals(source_dir: Path) -> None:
    wastewater = source_dir / "industrial-wastewater-cv"
    gui = Image.open(wastewater / "Picture1.png").convert("RGB")

    save_webp(
        crop_fraction(gui, 0.006, 0.405, 0.94, 0.93),
        "floc-gui-comparison.webp",
        quality=90,
    )

    decision = crop_fraction(gui, 0.005, 0.915, 0.995, 0.998)
    decision = decision.resize(
        (decision.width * 3, decision.height * 3),
        Image.Resampling.LANCZOS,
    )
    decision = ImageOps.expand(decision, border=(8, 10), fill="#fcfbf7")
    save_webp(decision, "floc-decision-strip.webp", quality=92)

    design = (
        wastewater
        / "交接单-张艺馨"
        / "嵌入式边缘端工业智能"
        / "智能矾花分析系统"
        / "智能矾花分析系统设计文档.pdf"
    )
    comparison = render_page(design, 14, 1600)
    save_webp(
        # Keep only the table title, method headers, and the three reported
        # quality metrics. Later rows make broader qualitative claims that the
        # archived experiment does not independently substantiate.
        crop_fraction(comparison, 0.125, 0.205, 0.55, 0.335),
        "floc-reported-comparison.webp",
        quality=90,
    )

    archive = design.parent / "Flocs_PoC_1.zip"
    mask_names = [
        "Flocs_PoC_1/dataset/images/1_000036.png",
        "Flocs_PoC_1/dataset/images/1_000037.png",
        "Flocs_PoC_1/dataset/images/1_000038.png",
    ]
    with zipfile.ZipFile(archive) as bundle:
        for index, name in enumerate(mask_names, start=1):
            with bundle.open(name) as source:
                mask = Image.open(io.BytesIO(source.read())).convert("L")
            save_webp(mask, f"floc-mask-{index:02d}.webp", quality=88)


def build_robot_frames(source_dir: Path) -> None:
    source = source_dir / "cabinet-operation.mp4"
    timestamps = [
        (169.5, "robot-door-open.webp", (0, 0.19, 1, 0.97)),
        (170.5, "robot-air-breaker.webp", (0.03, 0.19, 1, 0.96)),
        (204.5, "robot-door-close.webp", (0, 0.19, 1, 0.98)),
    ]
    with tempfile.TemporaryDirectory(prefix="portfolio-robot-frames-") as temp_dir:
        temp = Path(temp_dir)
        for index, (timestamp, filename, crop) in enumerate(timestamps, start=1):
            clip = temp / f"clip-{index:02d}.m4v"
            subprocess.run(
                [
                    "/usr/bin/avconvert",
                    "--source",
                    str(source),
                    "--preset",
                    "Preset960x540",
                    "--output",
                    str(clip),
                    "--start",
                    str(timestamp),
                    "--duration",
                    "0.6",
                    "--replace",
                    "--disableMetadataFilter",
                ],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            subprocess.run(
                [
                    "/usr/bin/qlmanage",
                    "-t",
                    "-s",
                    "1600",
                    "-o",
                    str(temp),
                    str(clip),
                ],
                check=True,
                stdout=subprocess.DEVNULL,
                stderr=subprocess.DEVNULL,
            )
            frame = Image.open(temp / f"{clip.name}.png").convert("RGB")
            frame = crop_fraction(frame, *crop)
            save_webp(frame, filename, quality=86)


def build_cabinet_poster(source_dir: Path) -> None:
    source = source_dir / "cabinet-operation.mp4"
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


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="Rebuild portfolio derivatives from a private local archive."
    )
    parser.add_argument(
        "source_dir",
        type=Path,
        help="Directory containing previous-slides.pdf, cabinet-operation.mp4, and word_extraction/.",
    )
    return parser.parse_args()


def main() -> None:
    source_dir = parse_args().source_dir.expanduser().resolve()
    required = [
        source_dir / "previous-slides.pdf",
        source_dir / "word_extraction" / "项目验收书.pdf",
        source_dir / "word_extraction" / "祖光杯PPT_改.pdf",
        source_dir / "industrial-wastewater-cv" / "Picture1.png",
        source_dir
        / "industrial-wastewater-cv"
        / "交接单-张艺馨"
        / "嵌入式边缘端工业智能"
        / "智能矾花分析系统"
        / "智能矾花分析系统设计文档.pdf",
        source_dir
        / "industrial-wastewater-cv"
        / "交接单-张艺馨"
        / "嵌入式边缘端工业智能"
        / "智能矾花分析系统"
        / "Flocs_PoC_1.zip",
    ]
    missing = [path for path in required if not path.is_file()]
    if missing:
        missing_list = "\n".join(f"- {path}" for path in missing)
        raise SystemExit(f"Missing required source artifacts:\n{missing_list}")

    OUTPUT.mkdir(parents=True, exist_ok=True)
    build_pdf_visuals(source_dir)
    build_wastewater_visuals(source_dir)
    if shutil.which("qlmanage") and (source_dir / "cabinet-operation.mp4").is_file():
        build_cabinet_poster(source_dir)
    if (
        Path("/usr/bin/avconvert").is_file()
        and shutil.which("qlmanage")
        and (source_dir / "cabinet-operation.mp4").is_file()
    ):
        build_robot_frames(source_dir)


if __name__ == "__main__":
    main()
