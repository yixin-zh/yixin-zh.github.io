# Yixin portfolio recreation: content and evidence plan

Date: 2026-07-29

## Outcome

Rebuild `index.html` as an eight-slide, keyboard-first technical portfolio. The deck should answer five questions quickly:

1. What problem was being solved?
2. What did Yixin personally implement or contribute?
3. Which technologies were used, and how did they connect?
4. What evidence is available?
5. What remains a claim, proposal, or open review item?

## Starting-point decision

Keep the eight-slide shell introduced by `efbc2f1`; do not revert both portfolio commits.

- The current version already has eight slides, keyboard navigation, reduced-motion support, responsive rules, and print behavior.
- Reverting both commits returns a seven-slide version with two speculative narrative pages and weaker project coverage.
- The recreation will retain the useful interaction idea, but replace the current content and most presentation code.
- The strongest material missing from the current deck is the latest InsightOS work, industrial wastewater CV work, and A*STAR/MOYA work.

## Evidence labels

Every quantitative or consequential claim will carry one of these statuses:

| Label | Meaning |
| --- | --- |
| `Artifact` | Directly visible in a provided report, slide, video, or public repository. |
| `Public source` | Supported by an official product page, paper, or merged public pull request. |
| `Reported` | Present in the resume or retrospective note, but the underlying logs/code are not in this repository. |
| `Review` | Conflicting, incomplete, or methodologically too strong for the available evidence. |
| `Proposed` | Follow-on methodology; not implemented in the described project. |

The website will avoid the word “verified” for private project results. “Artifact” means traceable, not independently reproduced.

## Eight-slide structure

### 1. About: engineering scope, not a personality pitch

Purpose:

- State the current role and the trajectory from control engineering to systems, applied ML, and robotics.
- Tie each technology to a project instead of displaying an unqualified keyword wall.
- Leave portrait space empty because no sourced headshot exists.

Grounded content:

- Current: R&D Engineer at InsightOS.
- Previous: industrial wastewater CV PoCs; A*STAR/SIMTech decarbonisation analytics.
- Education: NUS-ISS systems analysis and HIT intelligent test/control engineering.
- Project-linked stack: C++/Linux/ROS2; Python/CV/XGBoost; JSON/optimization workflows; PyTorch/transformers; DQN/Gym; RAG/evaluation.

### 2. Current robotics work: cabinet operation and the media runtime

Problem:

- Close the loop between camera observations, target pose estimation, robot frames, and manipulation.
- Make heterogeneous camera/depth streams reusable without recompiling application code for each hardware arrangement.

Reported implementation:

- Cabinet path: YOLO11 segmentation -> RGB-D projection -> planar 3D point filtering -> SVD pose estimate -> ROS TF -> closed-loop IK/visual servoing.
- Runtime path: media daemon, `memfd` IPC, `insightos://` routing, ROS2 bridge, C++ SDK, CLI/REST and agent skills.

Evidence:

- Private `cabinet-operation.mp4` and the matching hosted video.
- Private `resume.pdf` and `source/cv.md`.
- Public company context: <https://www.insightos.cn/>.

Boundaries:

- The video demonstrates behavior, but does not by itself prove the internal algorithm or production reliability.
- `>95% of apps within 15 minutes` and the WAIC 2026 deployment context are resume-reported and need an evaluation log or public demo reference.
- No proprietary architecture image will be invented.

### 3. Industrial wastewater computer vision PoCs

Problem:

- Convert underwater floc appearance into expert-aligned dose-adjustment classes.
- Detect upstream floating oil film early enough for operator inspection.

Implemented story that is supported by the retrospective scope and resume:

- Fixed-camera video at Xidagou and Beidagou.
- Binary masks and morphology features: count, area ratio, equivalent diameter, fractal dimension, circularity.
- XGBoost/LightGBM-style five-class output: `-20%`, `-10%`, `0`, `+10%`, `+20%`.
- Separate RGB oil-film monitoring PoC.

Evidence and references:

- Private wastewater project scope.
- Private wastewater retrospective, used only as an interpretation.
- C-FIA paper for the narrower claim that image-derived floc indices can track coagulation dynamics: <https://doi.org/10.1039/D2EW00389A>.

Review flags:

- Accuracy conflicts: the current resume says `89%`; retrospective notes say about `92%`. Display as `89-92% reported; reconcile from the original evaluation`.
- PCA, Pearson filtering, fusion ablations, and strictly held-out temporal blocks appear partly in retrospective methodology notes; do not present every step as implemented without notebooks/logs.
- `2-4h` process latency, exact-dose regression, digital twins, and delayed/offline RL are follow-on work, not current results.
- Do not claim production deployment, optimal dosing, oil-thickness estimation, or closed-loop control.
- Treat 2D morphology as correlated indicators, not physical measurement of 3D floc structure.

### 4. A*STAR / MOYA: research models to structured analytics

Problem:

- Translate math-heavy regional energy case studies into optimization-ready data and repeatable scenario workflows.

Implemented / reported contribution:

- Structured ASEAN generation, storage, and trade cases as JSON inputs.
- Compared converted cases with prior solver behavior.
- Prototyped schema-constrained LLM conversion.

Evidence:

- User-authored project visuals in the private slide archive, pages 9-12.
- Private Moya analytics discovery notes.
- Official public context: <https://mitigationatlas.org/> and <https://mitigationatlas.org/about>.

Boundaries:

- `Pass@1 >85%` is reported without the evaluation set or rubric; label it for review.
- Public GMPA traction and later Cascade work provide product context, not proof of personal ownership.
- Do not claim ownership of the public frontend, direct government deployment, or that Yixin built Cascade.

### 5. Delay-aware DQN path planning

Problem:

- Test grid-world dynamic path planning when observations are delayed instead of perfectly synchronous.

Implemented story:

- DQN with delayed observation updates and goal-directed reward shaping.
- Sparse, dense, and zigzag obstacle layouts.
- Repeated simulation and comparison with simpler learning baselines.

Evidence:

- Private project slides, pages 4-8.
- The results slide reports `98.1%` success and mean path length `29.113` for the proposed method, versus `92.6%` and `30.852` for traditional DQN, averaged over 15 repeated experiments.
- DQN reference: <https://doi.org/10.1038/nature14236>.

Review flags:

- Use the values printed in the artifact instead of the resume’s `+5.9%` summary.
- The `~12% faster convergence`, Rainbow, D3QN, DWA, and RT-RRT* comparison claims lack corresponding logs/tables in the provided artifacts.
- Code, seed policy, exact delay model, confidence intervals, and external generalization evidence are absent.

### 6. Video text recognition

Problem:

- Recover and recognize text when motion blur makes single-frame OCR unreliable.

Team system:

- Detection -> cross-frame tracking -> multi-frame restoration -> recognition.

Best-supported personal contribution:

- The final acceptance report assigns Yixin the Transformer-inspired OCR implementation and feature coupling with the upstream deblurring network.

Evidence:

- Private video-text acceptance report, especially pages 1, 23, 38, and 43.
- Project level and membership are recorded on pages 1-2.
- Page 38 reports `69.2` on Chinese Benchmark and `68.5` on ICDAR2019-LSVT, compared with `69.0` and `68.2` for SVTR-S.
- VRT reference: <https://arxiv.org/abs/2201.12288>.
- SVTR reference: <https://www.ijcai.org/proceedings/2022/124>.

Review flags:

- Do not repeat the current site’s `+0.23% F1 vs SVTR-Tiny`; the acceptance table does not support that wording.
- A preliminary report assigns Yixin Android UI/system work, while the final acceptance report assigns OCR/feature-coupling work. Prefer the final report and flag the discrepancy.
- Android deployment is described as a target or future work, not demonstrated completion.
- The report’s “about 0.5% improvement” is a combined narrative; show the two exact table deltas instead.

### 7. LLM evaluation and open-source work

Concrete items:

- SparkDesk KBQA assessment: public report repository; RAG-based agricultural KBQA plus adversarial evaluation.
- CAMEL PR #3758: merged OceanBase ANN query options, tests, and examples.
- FastGPT PR #6348: merged OceanBase HNSW quantization support.
- LLM-Cookbook: describe the localization/reproducibility work as a personal contribution; avoid relying on a live star count.

Public evidence:

- <https://github.com/YixinZ-NUS/SparkDesk-LLM-KBQA-Assessment>
- <https://github.com/camel-ai/camel/pull/3758>
- <https://github.com/labring/FastGPT/pull/6348>
- <https://github.com/datawhalechina/llm-cookbook>

Review flags:

- `100+ questions` and `10+ attacks` are resume-reported until the report is counted directly.
- “Core contributor” is not currently visible in the LLM-Cookbook README; prefer the concrete tasks performed.

### 8. Evidence ledger and contact

Close with:

- what can be inspected now: cabinet demo, acceptance report, project slides, public reports, merged PRs;
- what still needs source review: private performance logs, wastewater accuracy reconciliation, DQN training artifacts, GenAI evaluation rubric;
- what is deliberately not claimed: production wastewater control, live-plant RL, RGB oil thickness, public-sector adoption attributable to the intern, or completed mobile OCR deployment;
- email, GitHub, LinkedIn, and a print/download path.

## Visual asset decisions

| Visual | Use | Provenance |
| --- | --- | --- |
| Cabinet poster/frame | Yes | Derived from the user-provided cabinet video. |
| Cabinet video | Yes, click-to-load | User-provided local file and hosted OSS object. |
| DQN result slide | Yes | Rendered from user-authored private project slides, page 8. |
| GMPA diagrams/charts | Yes | Rendered from user-authored private project slides, pages 9-12. |
| Video-text pipeline/results | Yes | Rendered from the project acceptance report and user-authored slides. |
| Wastewater correlation PNGs | No for now | They show a third-party university presentation and lack a clean original citation/license in the repository. |
| Headshot | No | Missing source image; leave the space intentionally empty. |
| Generic stock/AI imagery | No | It would add narrative gloss without evidence. |

## Interaction and delivery decisions

- Eight slides with left/right keyboard navigation, visible controls, touch swipe, Home/End, and deep-linkable hashes.
- Do not intercept arrow keys while the user operates a link, button, or video control.
- Each slide scrolls internally on short or narrow viewports.
- Cabinet video loads only after intent; native controls and a direct fallback link remain available.
- Include reduced-motion handling, visible focus rings, semantic headings, and a print layout.
- Keep GitHub Pages as the hosting target.

## Repository exposure note

The private source archive is excluded from the Pages branch and ignored by Git. The generated derivatives above are the only source-derived media intended for public delivery.
