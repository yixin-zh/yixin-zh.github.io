# Industrial Wastewater CV Project: Resume Points + Experiment Setup

## Ready-to-use resume points

Use `4-6` of the bullets below depending on space.

- Developed two computer-vision proof-of-concepts for industrial wastewater operations at Ansteel, using on-site video data from the Xidagou and Beidagou plants for coagulation dose adjustment and upstream oil-film monitoring.
- Built image datasets from underwater coagulation video and engineered custom floc morphology features myself, including floc count, area ratio, equivalent diameter, fractal dimension, and circularity.
- Built a feature extraction pipeline that combined hand-crafted morphology features with CNN-extracted deep image features, then fed standard classifiers such as `XGBoost` and `LightGBM`.
- Trained multiclass dose-adjustment models against expert labels (`-20%`, `-10%`, `0`, `+10%`, `+20%`) and achieved about `92%` offline accuracy on strictly held-out time blocks.
- Planned follow-up work to move from image-based dose-adjustment classification to exact-dose regression by combining extracted floc features with plant variables such as turbidity, pH, temperature, and flow, while accounting for the `2-4h` latency before dose adjustments take effect and for dose-change history, and exploring offline / delayed RL for learning policies from pre-collected delay-free trajectories that remain robust when executed under delayed plant conditions.
- Built an RGB-only oil-film monitoring PoC for upstream plant waterways, framing it as an early-warning system rather than unreliable oil-thickness estimation.
- Scoped the oil-film system toward segmentation plus event detection with conservative alert logic to support inspection and skimming before downstream aeration was affected.

## Tighter resume version

- Built two CV-based wastewater monitoring PoCs, covering coagulation dose adjustment and upstream oil-film alerts from on-site plant video.
- Built an underwater floc-image dataset and engineered custom morphology features, then combined them with CNN deep features through a feature extraction pipeline using `XGBoost`-style models.
- Trained expert-aligned five-class dose-adjustment models and reached about `92%` offline accuracy on held-out temporal blocks.
- Framed the coagulation problem as image-based dose-adjustment classification, with later work aimed at exact-dose regression using image features plus plant variables under `2-4h` process latency.
- Built an RGB oil-film early-warning PoC to support operator inspection and skimming in upstream plant channels.

## Experiment setup: deep features + feature selection + XGBoost

This section is the cleanest way to describe the coagulation project as a data science pipeline first, while keeping room for later work on `2-4h` process latency and lagged dose/process history.

### 1. Objective

Predict expert dose-adjustment class from plant images of floc formation.

Current target:

- `-20%`
- `-10%`
- `0`
- `+10%`
- `+20%`

Recommended wording:

- `multiclass classification of dose-adjustment recommendations from image-derived features`
- `dose-adjustment classification from extracted floc features`

### What time dependence means here

- `2-4h process latency` means a coagulant change is not fully reflected in visible floc behavior or downstream quality immediately; the effect may show up hours later.
- `lagged dose/process history` here means using recent frames, dose settings, and plant variables as model inputs because nearby observations are not independent and the process changes gradually.
- `autoregressive` modeling here means using those lagged inputs to make a prediction, for example using image features and plant variables from the last few minutes or hours to predict the current dose-adjustment class or a later quality outcome.
- In plain terms: one frame alone is usually weaker than `current frame + recent history`.

### 2. Sample definition

Choose one prediction sample as either:

- one representative frame, or
- one short video window aggregated into a single row

For this project, the better engineering choice is:

- short fixed window per sample, because single frames are noisy

Each sample should contain:

- timestamp
- plant / basin id
- image or short clip
- expert label
- optional scalar process values if available

### 3. Image preprocessing

Recommended steps:

1. Fix region of interest around visible floc field.
2. Convert to stable grayscale or normalized color space if needed.
3. Denoise and suppress bubbles or lighting noise.
4. Segment flocs from background, using adaptive Gaussian thresholding when underwater illumination is uneven.
5. Remove obvious artifacts and tiny false positives.

This gives two outputs:

- binary mask for hand-crafted feature engineering
- cleaned image input for CNN feature extraction

### 4. Hand-crafted features developed by you

These should be stated explicitly as features you engineered for the project, not generic off-the-shelf features copied from a package.

Core feature set:

- floc count
- floc area ratio
- equivalent diameter
- circularity
- fractal dimension

Optional expansions:

- median floc area
- perimeter statistics
- solidity
- aspect ratio
- intensity or texture summaries

Recommended wording:

- `engineered custom floc morphology features from segmented plant video to convert floc appearance into structured model inputs`
- `built feature extraction logic that turned plant video into model-ready features`

### 5. CNN deep-feature branch

Use a pretrained CNN as a feature extractor, not necessarily as the final classifier.

Practical setup:

1. Start from a pretrained network such as `ResNet-18`, `ResNet-50`, or `EfficientNet`.
2. Remove the final classification head.
3. Take the embedding from the average-pooling or penultimate layer.
4. If using video, extract embeddings frame by frame.
5. Pool frame embeddings across the short window using mean, max, median, or percentile statistics.

Output:

- one fixed-length deep feature vector per sample

Why this setup works:

- simpler than end-to-end training
- easier to combine with hand-crafted features
- better suited to smaller industrial datasets
- easier to describe as a tabular ML project

### 6. Feature table construction

Construct three feature tables:

1. `hand-crafted only`
2. `deep features only`
3. `fusion = hand-crafted + deep features`

If scalar plant variables are available, add a fourth:

4. `fusion + sensors`

This gives a clean ablation structure and makes the project easy to explain.
It also makes the output easy to use, because each sample can produce:

- a predicted dose-adjustment class
- a confidence score
- supporting feature values for debugging or operator review

### 7. Feature reduction and selection

Because CNN embeddings can be wide, use reduction or selection before final modeling.

Recommended steps:

1. Remove constant or near-constant features.
2. Remove duplicated features.
3. Apply correlation filtering for obvious redundancy.
4. Reduce deep features with `PCA` if dimension is high.
5. Run supervised selection on the training split only using:
   - mutual information
   - recursive feature elimination
   - tree-based importance
   - Pearson correlation checks against downstream indicators such as turbidity, `COD`, and `TP` when those labels are available
6. Keep the final feature count small enough for stable training and interpretation.

Practical rule:

- reduce deep features first, then fuse with morphology features, then run final supervised selection

### 8. Classifier

Primary model:

- `XGBoost` multiclass classifier

Why `XGBoost` is a good main model here:

- handles mixed feature types well
- strong on medium-sized tabular datasets
- robust to nonlinear interactions
- easier to train than end-to-end video models
- easy to compare against baselines

Good baselines:

- `LightGBM`
- `SVM`
- logistic regression
- random forest

Recommended model output:

- `recommended action = decrease / keep / increase dose`
- confidence score
- optional supporting signals such as floc count trend or equivalent diameter trend

### 9. Evaluation protocol

Use time-based validation, not random frame splitting.

Recommended setup:

1. Split by contiguous time blocks.
2. Keep nearby frames from the same event in the same split.
3. Fit preprocessing, `PCA`, and feature selection on training data only.
4. Tune hyperparameters on validation periods.
5. Report final metrics on held-out future periods.

Reason:

- nearby video frames are highly similar, so random frame splitting would overstate performance

Recommended metrics:

- accuracy
- macro `F1`
- per-class precision / recall
- confusion matrix

If label imbalance is strong, macro `F1` matters more than raw accuracy.

### 10. Recommended ablations

Run these comparisons:

1. `hand-crafted only` vs `deep only` vs `fusion`
2. `XGBoost` vs `LightGBM` vs `SVM`
3. single-frame features vs short-window pooled features
4. no feature selection vs feature selection

If process variables exist:

5. `fusion` vs `fusion + sensors`

### 11. How to describe the current project honestly

Use this framing:

- current PoC = image-based multiclass classification of dose-adjustment recommendations
- current main workflow = feature extraction + feature selection + `XGBoost`
- future extension = model `2-4h` process latency and lagged dose/process history, combine image features with plant variables, and predict delayed quality outcomes

Avoid this framing for the current stage:

- exact dose regression
- optimal control
- reinforcement learning for live plant operation
- autonomous closed-loop dosing

### 12. Suggested methodology bullets for internal docs or interviews

- Built a two-branch feature extraction pipeline for coagulation images: custom floc morphology features engineered from segmentation masks, plus CNN deep features extracted from pretrained vision models.
- Reduced and selected features using training-fold-only preprocessing before fitting multiclass classifiers, with `XGBoost` as the main model and `LightGBM` / `SVM` as baselines.
- Evaluated `hand-crafted only`, `deep only`, and fused feature sets on held-out time periods to determine whether learned visual features added value beyond manually engineered floc descriptors.
- Treated modeling of `2-4h` process latency, combining image features with plant variables, and delayed quality prediction as the next stage after establishing a strong image-based classification baseline.

### 13. If RL is ever developed, what is the proven methodology?

Yes, there is a defensible methodology in the literature, but it should be framed as offline / delayed RL or simulator-first RL, not live-plant trial and error.

Working problem statement:

- `How can we learn a policy offline from pre-collected delay-free trajectories, then execute it reliably when the real plant has delayed observations and delayed process response?`

Recommended steps:

1. Build a simulator or digital twin from mechanistic process models, data-driven sequence models, or both.
2. Represent delayed dynamics explicitly by giving the controller recent history, recurrent state, or a belief-state predictor rather than a single snapshot.
3. Define a constrained objective that balances effluent quality, chemical cost, and smooth actuator movement.
4. Train and compare against strong baselines such as rule-based control, PID, or MPC.
5. Validate offline and in shadow mode before any live use.
6. Keep any first deployment as advisory or tightly bounded supervisory control, not free online exploration.

What that means for this project:

- a direct live-plant RL claim would be too strong
- a simulator-first or offline / delayed RL extension is reasonable only after delayed process response can be reproduced well enough
- the nearer-term step is still exact-dose regression or delayed quality prediction from image features plus plant variables

### 14. Papers to use as design references for future RL proposals

Use these papers as templates rather than treating RL as a generic add-on.

1. `Build the simulator first`
   Reference: [Mohammadi et al., 2024](https://doi.org/10.1016/j.engappai.2024.107992), *Deep Learning Based Simulators for the Phosphorus Removal Process Control in Wastewater Treatment via Deep Reinforcement Learning Algorithms*.
   Main idea: train sequence models on historical SCADA data, then use them as the RL environment.
   Methodology to reuse:
   - identify the process dynamics from SCADA history
   - validate the learned simulator over rollout horizons, not just one-step error
   - only then use it as the environment for DRL
   Why it matters here:
   - it is the closest match to the proposed coagulation-control extension
   - it shows that simulator quality is the bottleneck; high one-step accuracy alone is not enough because long-horizon errors compound

2. `Benchmark against classical control and reuse policy knowledge`
   Reference: [Aponte-Rengifo et al., 2023](https://doi.org/10.3390/pr11082269), *Intelligent Control of Wastewater Treatment Plants Based on Model-Free Deep Reinforcement Learning*.
   Main idea: use DRL as an upper-layer controller for wastewater treatment and compare it with default process control.
   Methodology to reuse:
   - define state, action, and reward around actual process variables and operating-cost indices
   - keep classical PI control loops underneath, and let RL adjust higher-level setpoints
   - use transfer learning / policy reuse to handle multi-objective trade-offs instead of retraining from scratch every time
   Why it matters here:
   - if coagulation RL is ever attempted, it should likely recommend bounded setpoints or actions rather than directly replace all low-level control

3. `Solve the cold-start problem before deployment`
   Reference: [Hernández-del-Olmo et al., 2018](https://doi.org/10.1016/j.knosys.2017.12.019), *Tackling the start-up of a reinforcement learning agent for the control of wastewater treatment plants*.
   Main idea: an RL agent should first learn from operator behavior before being allowed to act more freely.
   Methodology to reuse:
   - add an instruction or shadow period using operator actions
   - pretrain the policy from this initial guidance
   - only then allow bounded interaction
   Why it matters here:
   - this is a practical answer to "how do we avoid an inexperienced agent making bad early decisions?"

4. `Handle delay at deployment even if training logs are delay-free`
   Reference: [Zhan et al., 2025/2026](https://arxiv.org/abs/2506.00131), *Belief-Based Offline Reinforcement Learning for Delay-Robust Policy Optimization*.
   Main idea: standard offline RL trained on delay-free logs can fail badly once deployed in delayed environments; use a belief-state model to infer the hidden current state from history.
   Methodology to reuse:
   - formulate the problem as offline-to-online transfer under delay
   - replace naive snapshot policies with history-based or belief-based policies
   - use delay-robust offline RL instead of assuming that delay-free logs are enough by themselves
   Why it matters here:
   - this is the cleanest published framing for any future coagulation RL proposal where plant delays are known but live exploration is risky

## Publications supporting this methodology

These papers are useful mainly as analogies for the `deep features -> feature selection -> traditional classifier` setup.

1. [Zhang and Zhang, 2023](https://doi.org/10.1186/s12882-023-03182-6), *Deep learning-based multi-model approach on electron microscopy image of renal biopsy classification*.
   Relevance: pretrained `ResNet` features with `SVM`.

2. [Lu et al., 2024](https://doi.org/10.3389/fmed.2024.1402967), *Deep learning radiomics based on multimodal imaging for distinguishing benign and malignant breast tumours*.
   Relevance: average-pooling deep features + `PCA` + `SVM` / `XGBoost` / `LightGBM`.

3. [Xia et al., 2020](https://doi.org/10.3389/fonc.2020.00418), *Comparison and Fusion of Deep Learning and Radiomics Features of Ground-Glass Nodules to Predict the Invasiveness Risk of Stage-I Lung Adenocarcinomas in CT Scan*.
   Relevance: hand-crafted + deep feature fusion.

4. [Saadh et al., 2025](https://doi.org/10.1186/s12891-025-08733-6), *Advanced feature fusion of radiomics and deep learning for accurate detection of wrist fractures on X-ray images*.
   Relevance: deep features + feature selection + `XGBoost`.

5. [Kim et al., 2022](https://doi.org/10.1186/s12880-022-00793-7), *Transfer learning for medical image classification: a literature review*.
   Relevance: why pretrained CNNs are often used as feature extractors in data-limited imaging problems.

6. [Yu, 2014](https://doi.org/10.1007/s13762-014-0657-1), *On-line evaluating the SS removals for chemical coagulation using digital image analysis and artificial neural networks*.
   Relevance: directly relevant wastewater example linking image-derived features to coagulation outcomes.

7. [Daraei et al., 2023](https://pubs.rsc.org/en/content/articlelanding/2023/ew/d2ew00389a), *Continuous floc image analyser (C-FIA) for tracking floc particle dynamics during coagulation-flocculation-settling processes*.
   Relevance: supports image-based floc-state measurement and calibration discipline.

## Publications supporting a simulator-first RL extension

1. [Mohammadi et al., 2024](https://doi.org/10.1016/j.engappai.2024.107992), *Deep Learning Based Simulators for the Phosphorus Removal Process Control in Wastewater Treatment via Deep Reinforcement Learning Algorithms*.
   Relevance: wastewater-specific simulator-first RL workflow built from SCADA history; useful evidence that RL should start from a learned simulator rather than direct plant exploration.

2. [Aponte-Rengifo et al., 2023](https://doi.org/10.3390/pr11082269), *Intelligent Control of Wastewater Treatment Plants Based on Model-Free Deep Reinforcement Learning*.
   Relevance: shows wastewater RL can be benchmarked against conventional control, but still depends on careful training setup and reuse of prior policy knowledge.

3. [Hernández-del-Olmo et al., 2018](https://doi.org/10.1016/j.knosys.2017.12.019), *Tackling the start-up of a reinforcement learning agent for the control of wastewater treatment plants*.
   Relevance: directly addresses the cold-start problem and supports the view that unrestricted early exploration is risky in wastewater control.

4. [Zhan et al., 2025/2026](https://arxiv.org/abs/2506.00131), *Belief-Based Offline Reinforcement Learning for Delay-Robust Policy Optimization*.
   Relevance: general delay-robust RL methodology showing why delayed observations should be handled with recent history or belief-state modeling rather than naive snapshot policies.
