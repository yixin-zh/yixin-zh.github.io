# Portfolio visual provenance

These public derivatives were made from Yixin's private source archive. The
source PDFs, project folders, and video are intentionally excluded from this
repository. The images below are documentary crops, not stock or AI-generated
illustrations.

| Public asset | Private source | Treatment |
| --- | --- | --- |
| `robot-door-open.webp` | `cabinet-operation.mp4`, 169.5 s | Door-opening frame; top workplace area removed. |
| `robot-air-breaker.webp` | `cabinet-operation.mp4`, 170.5 s | Tight crop of gripper-to-breaker contact; identifiable coworkers excluded. |
| `robot-door-close.webp` | `cabinet-operation.mp4`, 204.5 s | Door-closing frame; top workplace area removed. |
| `cabinet-poster.jpg` | `cabinet-operation.mp4` | Optimized click-to-load video poster. |
| `floc-gui-comparison.webp` | Wastewater prototype `Picture1.png` | Original-frame and binary-mask region only. |
| `floc-decision-strip.webp` | Wastewater prototype `Picture1.png` | Threshold/XGBoost disagreement region only. |
| `floc-reported-comparison.webp` | Floc-analysis design document, table 3-1 | Title, headers, and accuracy/recall/F1 rows only; broader qualitative rows omitted. |
| `floc-mask-01.webp`–`03.webp` | Consecutive frames in the archived PoC bundle | Three adjacent binary masks retained as temporal-dependence evidence. |
| `dqn-simulation.webp` | Private project deck | Cropped simulator frame. |
| `dqn-learning-curves.webp` | Private project deck | Cropped learning-curve artifact. |
| `dqn-scorecard.webp` | Private project deck | Cropped reported comparison table. |
| `moya-case-model.webp` | Private project deck | Cropped energy-system case diagram. |
| `moya-file-tree.webp` | Private project deck | Cropped JSON-directory contract. |
| `moya-scenario-autarky.webp` | Private project deck | Cropped modeled self-sufficient scenario output. |
| `moya-scenario-cooperation.webp` | Private project deck | Cropped idealized-collaboration scenario output. |
| `ocr-system-flow.webp` | Private project deck | Cropped cross-frame system flow. |
| `ocr-restoration-comparison.webp` | Private team presentation, VRT method slide | Cropped VRT reference comparison; not a project output. |
| `ocr-vrt-triptych.webp` | Same VRT reference comparison | Low-quality input, VRT reconstruction, and ground truth isolated and enlarged for legibility. |
| `ocr-attention-maps.webp` | Private acceptance report | Cropped attention-map artifact. |

The source archive remains canonical. Rebuild the derivatives with:

```text
scripts/build_portfolio_assets.py /path/to/private/archive
```

Before publication, confirm employer/project permission for workplace footage,
underwater process imagery, and unpublished scenario-output crops.
