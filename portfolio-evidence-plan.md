# Yixin portfolio: evidence and publication plan

Updated: 2026-07-31

## Outcome

`index.html` is a nine-page, keyboard-first portfolio deck. Each technical case
answers four questions:

1. What problem was addressed?
2. What work is supported by the available artifacts?
3. What does the artifact actually show?
4. What still needs logs, independent evaluation, or publication clearance?

The private `/raw` archive is not part of the Pages repository. Only selected
derivatives under `assets/portfolio/` are public.

## Page structure

1. **Profile** — robot-learning goal, motto, contact links, and a frameless
   career/education/project/volunteering chronology. Each project has its own
   dated row; the dates make the HIT and NUS-ISS overlap legible without a
   separate explanatory panel.
2. **Robot loop** — runtime and cabinet-operation scope beside three privacy-
   cropped video frames and a click-to-load hosted demo.
3. **Plant CV** — an academic-poster layout separates the archived five-feature
   binary PoC, its GUI and reported metrics, and a reference-only research
   extension. The extension covers morphology-to-morphology redundancy,
   morphology-to-dose association, and a causal lag/window protocol.
4. **Climate data** — the Global Mitigation Potential Atlas is introduced as
   public platform context. Internship contribution, case-model/JSON artifacts,
   and complete modeled scenario outputs remain visually distinct.
5. **DQN planner** — the complete simulator and learning-curve figures are shown
   with `object-fit: contain`, beside the discrete-action method and a legible
   bar/table interpretation of the reported 15-run comparison.
6. **Video OCR** — the original TOP5/TOP4 quality gate, four support frames,
   reference frame, feature extraction, alignment/fusion, and SVTR-inspired
   recognition path are redrawn in the portfolio style. The poster also retains
   experiment definition, reported scores, and two perceivable text examples.
7. **Public code** — public repositories and merged pull requests, plus a small
   ANP-handle note.
8. **Credentials** — NVIDIA, Oracle, Microsoft, and AWS records grouped by
   provider.
9. **Questions** — questions being pursued, enduring interests, decentralized
   multi-agent infrastructure, and early AI/formalized-mathematics foundations.

## Evidence boundaries

### Robot work

- The hosted video supports a physical cabinet interaction.
- It does not independently establish the internal perception/control pipeline,
  autonomy, success rate, or production reliability.
- Workplace footage must remain privacy-cropped; employer publication permission
  should be confirmed.

### Industrial wastewater vision

- The archived GUI supports a binary threshold/XGBoost prototype.
- Table 3-1 reports 88.5% XGBoost accuracy and 67.4% threshold accuracy.
- Archived code implements grayscale, median filtering, adaptive thresholding,
  morphological opening/closing/erosion, connected-component extraction, and
  five geometric inputs: count, major-axis diameter, equivalent diameter,
  circularity, and area fraction.
- Archived code expands 2,270 labeled images into 258,887 floc records, then
  applies a random stratified split at the floc level. The reported 88.5% is
  therefore not an independent video-, day-, or plant-level estimate.
- The public portfolio uses 89% only as the résumé's rounded value.
- The archived model is binary; the résumé's five dose steps remain unresolved.
- No production dosing control, oil-thickness estimate, or generalization claim
  is made.
- Pearson coefficients, HRT-window candidates, TCN/Transformer models, and SHAP
  are reference-study results, not implemented PoC results. They are labeled
  accordingly.
- A future temporal study should estimate plant lag from HRT plus training-only
  cross-correlation, aggregate frames before modeling, use causal input/target
  windows, split by time/video/day/plant, and purge at least the full
  input-window + lag + target horizon between folds.

### SIMTech climate analytics

- The artifacts support a case-study-to-structured-data workflow and modeled
  scenario comparisons.
- `Pass@1 >85%` remains résumé-reported because the dataset, rubric, and failure
  cases are unavailable.
- Public platform context does not imply personal ownership of the launched
  product.
- Confirm publication clearance for unpublished project diagrams and scenario
  outputs.

### DQN capstone

- The supplied scorecard reports 98.1% success and mean path length 29.113 for
  the proposed method versus 92.6% and 30.852 for traditional DQN, averaged over
  15 reported runs.
- The preserved algorithm slide uses `argmax` over DQN action candidates, which
  supports a discrete action space. The exact movement or steering catalogue is
  not preserved, so the portfolio does not infer it from the visually smooth
  plotted path.
- The simulator and learning-curve images are never rendered with `cover`; the
  full axes, legend, path, obstacles, and plotting controls stay visible.
- Raw logs, seeds, confidence intervals, exact simulator configuration, and
  real-robot evaluation are unavailable.

### Video OCR

- The final project record supports a Transformer-inspired recognizer and feature
  coupling contribution within a team system.
- The preserved quality gate compares a tracked crop with matched history. A
  TOP5 crop becomes the new reference; TOP4 membership updates four saved
  support crops; otherwise the previous recognition is retained.
- Four support crops and the current reference feed feature extraction,
  alignment/fusion, and an SVTR-inspired recognizer with CTC prediction.
- First prize and national-level continuation are retained as recorded outcomes.
- The acceptance-report table lists 69.2% on Chinese Benchmark and 68.5% on
  ICDAR 2019-LSVT, versus 69.0% and 68.2% for SVTR-S. Raw predictions and an
  independent rerun are unavailable.
- The blurred/restored Chinese text pairs are qualitative outputs reproduced in
  the project-results slide. Their source images, per-sample predictions, and an
  independent rerun are unavailable.
- The broader résumé architecture/deblurring scope, Android deployment, and
  earlier `+0.23% F1` wording are not treated as established results.

### Public code and credentials

- Link to public repositories and merged pull requests directly.
- Avoid live popularity counts.
- Group credentials by issuer and show issue/expiry dates only where supplied.

## Publication gates

- Keep source PDFs, source folders, resumes, credentials, and the local cabinet
  video out of Git.
- Publish only purpose-cropped derivatives with documented provenance.
- Confirm permission for employer footage, wastewater process imagery, and
  unpublished SIMTech/MOYA scenario crops.
- Keep review labels visible until the underlying logs or evaluation methodology
  are available.
