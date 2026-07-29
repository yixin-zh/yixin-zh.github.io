# Industrial Wastewater AI/CV Brag Doc

Prepared from `scope.md`, the two notes under `round1/`, the original materials under `sources/`, and external literature checks.

## Project 1: Coagulation dosing

One-line start: built a plant-image classification PoC that turned visible floc patterns into structured features and predicted expert dose-adjustment classes.

- Built a labeled plant-image dataset from underwater coagulation video collected at the Xidagou and Beidagou wastewater plants using fixed camera placement and stable field of view.
- Developed a feature pipeline that converted floc images into tabular inputs, including hand-crafted morphology features such as floc count, area ratio, equivalent diameter, fractal dimension, and circularity.
- Added CNN-extracted image embeddings as an optional second feature branch, so the project could be handled as a standard tabular classification problem rather than only as end-to-end vision modeling.
- Used the prior PAC studies as feature justification and calibration evidence, but did not treat their local `40 mg/L` result as a plant-wide optimum.
- Trained traditional classifiers on the resulting feature table, with `XGBoost`, `LightGBM`, and similar models as the main workflow for multiclass dose-adjustment prediction.
- Reached about 92% offline multiclass accuracy in PoC testing against expert-labeled five-class targets (`-20%`, `-10%`, `0`, `+10%`, `+20%`).
- Scoped the next phase as adding time-lag handling, sensor fusion, and eventual delayed quality prediction, rather than jumping directly to closed-loop plant control.
- Positioned exact dose regression and recommendation as follow-on work after better timestamp alignment and richer process labels are available.

### What "delay-aware decision support" means here

It does **not** mean "classification" by itself.

It means the model and the evaluation respect the fact that coagulation results show up later, not immediately.

- A dose change happens at time `t`.
- The visible floc state and downstream quality response may show up tens of minutes to hours later.
- So the model should use only information available up to time `t`, and its labels or targets should be aligned to the later process outcome.

For the current PoC, the implemented target is indeed a **classification** target: expert advice to decrease, keep, or increase dose in five discrete steps.

So the clean wording is:

- current PoC = `delay-aware classification for dose adjustment`
- future upgrade = `delay-aware quality prediction` or `dose recommendation`

### ML workflow order for Project 1

1. Fix camera position and collect synchronized plant video and process logs.
2. Preprocess frames and segment flocs from background.
3. Compute hand-crafted morphology features from masks.
4. In parallel, extract CNN embeddings from a truncated pretrained network, such as the average-pooling or penultimate layer.
5. Aggregate frame-level features into one row per sample or per fixed time bin.
6. Standardize, reduce, or select features using steps such as PCA, mutual information, RFE, or tree-based importance on the training split only.
7. Train tabular classifiers such as `XGBoost`, `LightGBM`, `SVM`, or logistic regression on `morphology only`, `CNN only`, and `fusion` feature sets.
8. Evaluate on held-out time periods, not random frame splits.

### How to use CNN features without making this an end-to-end CV project

Yes, you can keep this as a normal data science workflow.

The practical setup is:

1. Use a pretrained CNN or a lightly fine-tuned CNN as a feature extractor.
2. Remove the final softmax layer.
3. Take the embedding vector from the average-pooling or penultimate layer.
4. For video, pool those embeddings over several frames using mean, median, max, or simple percentiles.
5. Concatenate the pooled CNN features with hand-crafted morphology features and any scalar plant variables.
6. Run normal tabular modeling on the fused feature table.

That is very close to what medical imaging papers often call `deep radiomics` or `deep feature + radiomics fusion`.

Why this is useful here:

- it keeps the model description simple
- it works better than full end-to-end training when data are limited
- it gives a clean ablation structure
- it makes fusion with process variables straightforward

The main engineering caution is dimensionality: CNN embeddings can be wide, so they usually need pooling plus selection or reduction before going into `SVM` or `XGBoost`.

## Project 2: Oil-film monitoring

One-line start: built an RGB-camera PoC to detect floating oil film early enough for operators to inspect and skim the surface before it disrupted downstream treatment.

- Framed the problem as visual detection of surface oil film in upstream plant waterways, not oil-thickness estimation.
- Kept the sensing setup pragmatic: RGB camera only, with thermal imaging left as a future robustness upgrade for night, glare, and weather variation.
- Positioned the output as an alerting tool for operator review and skimming action rather than as a direct actuator-control system.
- Treated the likely production path as segmentation plus event detection with coverage thresholding and alarm hysteresis.

### ML workflow order for Project 2

1. Define the water-surface region of interest.
2. Label oil-film presence or masks on representative frames.
3. Train a simple visual baseline first, such as thresholding plus morphology.
4. Compare with a learned segmentation model such as `U-Net` or `YOLO-seg`.
5. Convert frame scores into event alerts using persistence rules to reduce false alarms.
6. Validate across daylight, low light, glare, and disturbed water conditions.

## Strongest claim boundaries

Use these phrasings:

- `vision-assisted coagulation dosing PoC`
- `expert-aligned dose-adjustment classification`
- `delay-aware decision support`
- `oil-film early warning / monitoring`
- `offline validation on plant data`

Avoid these phrasings:

- `optimal dose prediction` unless exact dose ground truth and a defined optimization objective are available
- `regression model` for the current PoC, because the current labels are discrete adjustment classes rather than continuous dose values
- `reinforcement-learning controller` for the live plant
- `oil-thickness estimation` from RGB-only imagery
- `automatic surfactant dosing` as a default remediation action
- `production deployment` or `closed-loop automation`, because the current work was PoC-only

Keep this technical caveat explicit:

- Treat 2D floc-image features as correlated indicators of process state and settling behavior, not as direct physical measurements of true 3D floc structure or settling velocity.

## ML view vs CV view on coagulation

Both are valid, but they solve different parts of the problem.

### If you approach it from an ML perspective

The main question is:

`Given plant state up to now, what dose adjustment label or downstream outcome should we predict?`

That usually leads to:

- timestamp alignment
- lag handling
- tabular feature engineering
- `XGBoost` / `LightGBM` / other tabular models
- stronger focus on validation protocol and process delay

This is the better default framing for the current PoC because the labels are coarse, the dataset is likely not huge, and the hand-crafted features are interpretable.

### If you approach it from a modern CV perspective

The main question is:

`What useful visual state can we learn directly from the images that hand-crafted features may miss?`

That usually leads to:

- CNN or video encoder as feature extractor
- learned embeddings instead of only hand-crafted morphology
- possible segmentation or patch-level representation learning
- stronger focus on appearance variation, camera robustness, and annotation quality

This is useful, but it does not remove the need for proper time alignment and lag-aware targets. In this project, CV is best treated as a feature source inside the wider ML problem.

### Can CNN features help beyond the hand-picked ones?

Yes, possibly.

A CNN can learn higher-order visual cues that are hard to write down manually, for example:

- local texture of loose versus dense floc regions
- overlap patterns among flocs
- edge sharpness and opacity changes
- spatial heterogeneity across the frame
- subtle lighting-normalized appearance cues that correlate with process state

But there are practical limits:

- if the dataset is small, CNNs can overfit faster than `XGBoost` on hand-crafted features
- if camera conditions are stable and the labels are coarse, morphology features may already capture most of the useful signal
- CNN features are harder to explain to process engineers

So the pragmatic recommendation is:

- keep hand-crafted morphology as the main branch
- add a CNN branch as an ablation or parallel feature extractor
- test `morphology only` vs `CNN only` vs `fusion`

That gives you a clean answer instead of assuming the CNN must be better.

## Publications supporting the `CNN features -> traditional classifier` workflow

These are useful analogies for describing your coagulation PoC as a data science pipeline instead of only a deep-learning pipeline.

1. Zhang and Zhang, 2023, *Deep learning-based multi-model approach on electron microscopy image of renal biopsy classification*.
   Link: <https://doi.org/10.1186/s12882-023-03182-6>
   Relevance: uses pre-trained `ResNet` convolutional layers for feature extraction and then applies `SVM` as the classifier; a direct example of CNN features feeding a traditional model.

2. Lu et al., 2024, *Deep learning radiomics based on multimodal imaging for distinguishing benign and malignant breast tumours*.
   Link: <https://doi.org/10.3389/fmed.2024.1402967>
   Relevance: extracts deep features from the average-pooling layer of pretrained `ResNet-50`, reduces them with `PCA`, and then compares `SVM`, `XGBoost`, `LightGBM`, and other tabular classifiers.

3. Xia et al., 2020, *Comparison and Fusion of Deep Learning and Radiomics Features of Ground-Glass Nodules to Predict the Invasiveness Risk of Stage-I Lung Adenocarcinomas in CT Scan*.
   Link: <https://doi.org/10.3389/fonc.2020.00418>
   Relevance: clean example of keeping deep features and radiomics as separate branches, then fusing them to improve classification on limited data.

4. Saadh et al., 2025, *Advanced feature fusion of radiomics and deep learning for accurate detection of wrist fractures on X-ray images*.
   Link: <https://doi.org/10.1186/s12891-025-08733-6>
   Relevance: extracts deep features from an autoencoder bottleneck, applies feature selection methods such as `PCA`, `RFE`, and mutual information, and then trains classifiers including `XGBoost`.

5. Kim et al., 2022, *Transfer learning for medical image classification: a literature review*.
   Link: <https://doi.org/10.1186/s12880-022-00793-7>
   Relevance: review paper showing why pretrained CNNs are often used as feature extractors in data-limited image problems before simpler downstream classifiers are explored.

## What the prior floc research really supports

The three local source slides are useful, but they support feature relevance and calibration, not a universal plant optimum.

- The correlation heatmap supports using morphology as model input, not as a substitute for process-ground-truth outcomes.
- The controlled PAC sweep indicates a local optimum near `40 mg/L` under that experiment, not a plant-wide constant optimum.
- The PAC-correlation table shows strong linear associations between PAC dose and floc count (`r = 0.883`), area ratio (`r = 0.745`), equivalent diameter (`r = 0.921`), and fractal dimension (`r = 0.864`).
- The second slide set also supports treating floc morphology as related to downstream water-quality indicators such as settled-water turbidity, zeta potential, `COD`, and `TP`.

What to do with that in the project story:

- Yes, mention the morphology-dose correlation in the data-prep story, because it justifies the feature set and explains why vision adds signal beyond scalar sensors.
- Use Pearson correlation only as first-pass screening, and compute it inside training folds only so feature selection does not leak test-period information.
- Treat hand-crafted morphology as the primary branch for this PoC, because the labels are coarse and the feature set is interpretable; keep CNN embeddings as a parallel ablation rather than the only input path.
- Present the local PAC sweep as a controlled calibration reference separate from the plant-scale forecasting task.

## Can the dataset be further calibrated?

Yes. The best next calibration steps are:

- Add plant-specific lag alignment between upstream video, chemical dosing, and downstream quality observations, instead of assuming a fixed universal delay.
- Keep camera position, lighting, and field of view fixed per basin, because floc-image measurements are sensitive to illumination geometry and viewing conditions.
- If floc depth relative to the camera changes materially, add a scale marker or per-zone calibration so equivalent diameter remains a stable relative feature.
- Aggregate video features over fixed time bins and compare no-lag, fixed-lag, and validation-selected lag settings.
- Run a small controlled PAC sweep at safe operating doses to re-anchor the morphology features against final turbidity or settling outcomes.
- Add scalar process context such as turbidity, pH, temperature, and flow so the system can move from vision-only classification toward fused quality prediction and recommendation.

## Remaining gap to a full operational model

- Move from expert-label classification to delayed quality prediction first, then optimize dose against an explicit surrogate objective.
- Validate with rolling time splits and purge gaps, not random frame-level splits.
- Treat any reinforcement-learning work as simulator or digital-twin follow-up, not live-plant control.
- Reframe the oil system as segmentation plus event detection with hysteresis and alarm logic.
- Add telemetry, drift monitoring, camera-health checks, and operating-regime tagging before any plant rollout.
- Keep the operator in the loop until the plant has enough evidence on false alarms, missed detections, and chemical-usage tradeoffs.

## High-signal publications to anchor the story

1. Yu, 2014, *On-line evaluating the SS removals for chemical coagulation using digital image analysis and artificial neural networks*.
   Link: <https://doi.org/10.1007/s13762-014-0657-1>
   Why it matters: directly relevant industrial-wastewater study using digital image analysis plus ANN; reported `R^2 = 0.96-0.97` for landfill leachate and `R^2 = 0.93-0.97` for textile wastewater when predicting post-coagulation suspended-solids outcomes.

2. Daraei et al., 2023, *Continuous floc image analyser (C-FIA) for tracking floc particle dynamics during coagulation-flocculation-settling processes*.
   Link: <https://pubs.rsc.org/en/content/articlelanding/2023/ew/d2ew00389a>
   Why it matters: shows that video-derived floc indices can track coagulation dynamics and have an inverse relationship with residual turbidity, `UVA254`, and color; also explicitly notes sensitivity to lighting intensity and angle, which supports fixed-camera calibration discipline.

3. Fang et al., 2023, *Exploring potential dual-stage attention based recurrent neural network machine learning application for dosage prediction in intelligent municipal management*.
   Link: <https://pubs.rsc.org/en/content/articlelanding/2023/ew/d2ew00560c>
   Why it matters: strong published evidence that time-series dosing models outperform snapshot baselines in wastewater coagulation; the paper reports `R^2 = 0.9908` and `MAPE = 1.01%` for the best DA-RNN model.

4. Sun et al., 2024, *Machine learning facilitated the conceptual design of an alum dosing system for phosphorus removal in a wastewater treatment plant*.
   Link: <https://www.sciencedirect.com/science/article/pii/S004565352400047X>
   Why it matters: practical decision-support architecture for a full-scale plant under incomplete monitoring; the study reports an alert model with `0.92` accuracy and a staged dosing design that reduced overdosing from `61.3%` to `12.1%`.

5. Wang et al., 2025, *Knowledge embedding and interpretable machine learning optimize comprehensive benefits for water treatment*.
   Link: <https://www.nature.com/articles/s41545-025-00510-1>
   Why it matters: high-visibility example of interpretable, multi-objective dosing optimization; reported `R^2 = 0.9922`, `16.36%` turbidity reduction, and `9.64%` dosing-cost reduction under real validation.

6. De Kerf et al., 2020, *Oil Spill Detection Using Machine Learning and Infrared Images*.
   Link: <https://www.mdpi.com/2072-4292/12/24/4090>
   Why it matters: good technical anchor for the oil-monitoring side; supports the framing of oil detection as image segmentation / event detection and shows why thermal imaging is a credible future robustness upgrade.

7. Wang et al., 2023, *A Review on Applications of Artificial Intelligence in Wastewater Treatment*.
   Link: <https://www.mdpi.com/2071-1050/15/18/13557>
   Why it matters: useful review for interview framing; emphasizes the real bottlenecks for AI in wastewater treatment as data quality, interpretability, reproducibility, and lack of standardization rather than model novelty alone.

## Recommended one-line summary

Built two industrial wastewater PoCs at plant scale: one used floc-image features and gradient-boosted models to support coagulation dose adjustment, and the other used RGB video to flag upstream oil film for early operator action.
