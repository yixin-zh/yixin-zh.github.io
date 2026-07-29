# AI/CV for Industrial Wastewater Treatment: Publication-Style Experiment Plan

## 1. Objective

Design a reproducible study for a full-scale industrial wastewater plant that answers two questions:

1. Does adding computer-vision features improve delayed coagulant-dose prediction or recommendation compared with sensor-only models?
2. Can an upstream oil-film detector provide early warning with acceptable false-alarm rates under day, night, and disturbance conditions?

This plan is written to be technically publishable in a CS-for-engineering setting. It explicitly avoids three common failure modes:

- calling historical operator behavior "optimal" without counterfactual evidence,
- leaking future information through window construction,
- claiming film thickness or dose optimality from data that do not identify those quantities.

## 2. Research questions and hypotheses

### RQ1: Multimodal fusion

Does combining plant sensors with image-derived features outperform sensor-only baselines for delayed quality prediction and dose recommendation?

**Hypothesis H1:** multimodal models outperform sensor-only models on downstream quality prediction because floc morphology carries state information not fully captured by scalar sensors.

### RQ2: Delay-aware modeling

Does explicit lag modeling outperform snapshot models?

**Hypothesis H2:** lag-aware models outperform same-time models because coagulation and settling introduce process delays on the order of tens of minutes to hours.

### RQ3: Oil-film monitoring

Can segmentation-based CV produce useful early warnings with low operational noise?

**Hypothesis H3:** RGB+thermal segmentation outperforms RGB-only baselines at night and under glare, while event-level hysteresis reduces false alarms.

## 3. Data sources and feed

Use a single plant master clock with 5-minute bins. This is usually a good compromise between historian noise, actuator update rates, and tractable sequence length.

| Stream | Raw source | Native rate | Published feature rate | Notes |
| :-- | :-- | :-- | :-- | :-- |
| Process sensors | pH, influent turbidity, effluent turbidity, conductivity, temperature, flow, level, optional ORP | 1 s to 1 min | 5 min | Median within bin, plus missingness flag |
| Actuator logs | PAC or coagulant flow, pump state, valve state, mixer state | event or 1 min | 5 min | Last observation carried forward within a bounded gap |
| Lab data | TSS, COD, oil and grease, jar-test records if available | 30 min to shift | aligned by sample timestamp if available, otherwise by result-availability time | Never backfill into earlier timestamps |
| Vision: coagulation basin | fixed camera or underwater camera | 1 to 5 fps | 5 min | Per-bin summary of morphology or learned embeddings |
| Vision: upstream surface | RGB and optional thermal camera | 1 to 5 fps | 5 min | Per-bin oil coverage and event score |
| Context | shift, weekday, rain, maintenance, known upset flags | event | 5 min | Encoded categorically |

### Data-feed rules

- Resample each stream independently to the 5-minute grid.
- Fit imputers and scalers on training data only.
- Generate windows **after** temporal splitting, never before.
- Carry-forward is allowed only for slow sensors and only up to a fixed maximum gap.
- Longer gaps become missing values plus a binary missingness feature.

## 4. Time alignment and delay estimation

The prior draft used fixed windows such as 2.5 h, 4 h, and 24 h as if they were known constants. That is not publication-safe unless the plant has already measured them. Here the delay is estimated and then validated.

Let \(t\) index 5-minute bins and let \(\tau\) be the effective delay in bins.

### Candidate delays

Search

\[
\tau \in \{12, 24, 36, 48\},
\]

which correspond to 1 h, 2 h, 3 h, and 4 h.

Estimate \(\tau\) by combining:

1. Plant process knowledge from tank volumes and nominal flow.
2. Cross-correlation between dose changes and downstream quality response.
3. Event-response analysis on large natural disturbances.

The selected delay is the one that is physically plausible and performs best on validation data.

### Lagged feature design

Use sparse lags and rolling summaries instead of feeding every raw point to a model.

At the 5-minute grid, use lags

\[
\mathcal{L} = \{1, 2, 3, 6, 12, 24, 48, 288\},
\]

which represent 5 min, 10 min, 15 min, 30 min, 1 h, 2 h, 4 h, and 24 h.

For each scalar feature \(x_t\), derive:

- point lags \(x_{t-\ell}\) for \(\ell \in \mathcal{L}\),
- rolling mean, std, min, max over 30 min, 1 h, and 4 h windows,
- first difference \(x_t - x_{t-1}\),
- optional daily same-time lag \(x_{t-288}\).

For each video-derived feature \(v_t\), compute the same lag family but with fewer long-horizon summaries if storage is tight.

This is a standard, defensible setup for tabular time-series models.

### How to use the prior floc studies

The prior figures you shared suggest two useful experimental roles for floc morphology:

1. **Feature-screening role.** A broader candidate set can first be screened with Pearson correlation, as in the 11-feature to 8-feature reduction shown in the slides.
2. **Controlled dose-response role.** A separate PAC sweep can characterize how morphology changes with dose. In the supplied example, a dose near 40 mg/L appears best within that specific experiment and is associated with fewer flocs and larger equivalent diameter.

In the paper, those results should be used as **prior evidence**, not as universal truths. Concretely:

- use them to justify including floc count, area ratio, equivalent diameter, fractal dimension, and circularity as candidate features,
- use them to motivate a controlled calibration dataset in addition to plant historian data,
- do not hard-code 40 mg/L as the optimum for the live plant.

This distinction is important for publication. The controlled PAC sweep supports local causal interpretation under fixed conditions, while the plant-scale time-series model supports predictive performance under varying conditions.

## 5. Task A: coagulation modeling

### 5.1 Notation

Let

- \(s_t\): sensor and actuator vector,
- \(v_t = \phi(I_t)\): image feature vector from the coagulation camera,
- \(d_t\): applied coagulant dose,
- \(y_{t+\tau}\): downstream quality at delay \(\tau\),
- \(z_t\): fused lagged feature vector built from \((s_t, v_t)\).

### 5.2 Two targets, not one

A publishable study should separate two targets.

#### A1. Historical policy prediction

\[
\hat d_t = f(z_t)
\]

This predicts what operators historically did. It is a useful benchmark, but it is not an "optimal dose" target.

#### A2. Delayed quality prediction

\[
\hat y_{t+\tau} = g(z_t, d_t)
\]

This predicts the downstream consequence of a dose decision. It is the safer core target for a first paper.

### 5.3 Recommendation layer

If the paper also wants a recommendation, build it on top of the delayed-quality surrogate:

\[
\hat d_t^* =
\arg\min_{d \in \mathcal{D}}
\left[
\alpha \, (\hat y_{t+\tau}(d) - y^\star)_+^2
+ \beta \, d
+ \gamma \, (d - d_{t-1})^2
\right].
\]

This is publishable because the optimization objective is explicit. The resulting claim is:

"the model recommends a dose according to a fitted surrogate objective,"

not

"the model discovered the plant optimum from observational logs alone."

### 5.4 Vision features for Task A

Use two parallel representations.

#### Hand-crafted morphology branch

For each frame or frame batch, extract:

- particle count,
- total segmented area,
- median area,
- perimeter,
- equivalent diameter \(d_{\mathrm{eq}} = \sqrt{4A/\pi}\),
- circularity \(4 \pi A / P^2\),
- solidity,
- aspect ratio,
- texture statistics,
- optical density proxies.

Aggregate within each 5-minute bin using median, IQR, and 90th percentile.

For feature selection, use a two-stage process:

1. univariate screening on the training fold only, using Pearson or Spearman correlation,
2. multivariate selection inside the fitted model, using regularization, gain-based importance, or SHAP only as a post hoc interpretation tool.

This matches the prior floc studies better than jumping directly from a correlation heatmap to a final model.

#### Learned-embedding branch

Use a pretrained CNN or lightweight vision encoder on image patches and summarize embedding vectors over the 5-minute bin.

This creates two publishable conditions:

- classical morphology,
- learned visual embeddings.

### 5.5 Baselines and candidate models

#### Baselines

- persistence or shift-median baseline,
- ridge or elastic-net regression,
- random forest,
- sensor-only XGBoost,
- sensor-only LightGBM.

#### Multimodal candidates

- XGBoost on sensor + morphology features,
- LightGBM on sensor + morphology features,
- temporal convolution or LSTM on fused sequences,
- late-fusion MLP on sensor lags + vision embeddings.

The first paper should treat XGBoost and LightGBM as serious baselines, not throwaways.

### 5.6 Why RL is not the main experiment

Online reinforcement learning is not the main study because:

- the process has delayed reward,
- live exploration is unsafe,
- offline logs do not support reliable causal credit assignment by default.

If RL is explored at all, it should appear only as a follow-up study inside a validated simulator or digital twin, never as the main plant claim in the initial paper.

### 5.7 Controlled PAC sweep sub-study

Add a small controlled sub-study alongside the plant-scale forecasting task.

Suggested design:

- PAC levels: 10, 20, 30, 40, 50 mg/L or the plant's safe operating range,
- at least 3 replicates per level,
- fixed feed water source within each batch,
- fixed mixing and settling protocol,
- outputs: floc count, area ratio, equivalent diameter, fractal dimension, circularity, and final turbidity.

Purpose:

- verify that the morphology features respond sensibly to dose,
- estimate monotonic or non-monotonic trends,
- provide a causal calibration reference for interpreting the observational model.

This sub-study should be reported separately from the main rolling-origin forecasting results.

## 6. Task B: upstream oil-film detection

### 6.1 Framing

This is a segmentation and event-detection task.

For each 5-minute bin, let \(M_t\) be the oil mask and \(W_t\) the visible water-surface mask. Define coverage

\[
c_t = \frac{|M_t \cap W_t|}{|W_t|}.
\]

Also define an event if \(c_t\) exceeds a threshold for at least \(k\) consecutive bins. A good starting value is \(k = 3\), which corresponds to 15 minutes on a 5-minute grid.

### 6.2 Labels

Annotate:

- water-surface ROI,
- oil mask,
- optional severity class: `none`, `localized sheen`, `extended film`.

Do not claim reliable film thickness from RGB imagery alone. If thickness is studied, it needs a separate calibration experiment and should be reported as a separate task.

### 6.3 Models

Compare:

- adaptive thresholding + morphology baseline,
- RGB U-Net,
- RGB+thermal U-Net or equivalent segmentation model,
- YOLO-seg style model if real-time deployment is a priority.

### 6.4 Operational output

The detector should output:

- pixel mask,
- coverage score \(c_t\),
- event probability,
- alarm state with hysteresis.

The action interface for the plant should be conservative:

- alert operator,
- recommend diversion or skimming,
- log event start and end times.

Automatic surfactant injection is intentionally excluded from the default plan because it is not a standard, generally safe response for oily wastewater streams.

## 7. Train, validation, and test protocol

### 7.1 Split strategy

Use rolling-origin evaluation with contiguous blocks, not random cross-validation.

Preferred protocol:

1. Choose three test periods that cover different operating regimes.
2. For each fold, train on all data before the validation block.
3. Validate on the next contiguous block.
4. Test on the following contiguous block.

Example if enough data exist:

- Fold 1: train months 1-4, validate month 5, test month 6
- Fold 2: train months 1-5, validate month 6, test month 7
- Fold 3: train months 1-6, validate month 7, test month 8

If the dataset is shorter, use weekly or biweekly blocks, but keep the same rolling-origin logic.

### 7.2 Purge gap

Because labels depend on future observations, insert a purge gap between train, validation, and test blocks:

\[
g = \max(\tau, 288),
\]

which is max(process delay, 24 h) on the 5-minute grid.

That prevents overlap through lagged windows and day-lag features.

### 7.3 Leakage controls

- Build windows only after splitting.
- Do not mix adjacent overlapping windows across splits.
- Fit preprocessing on training data only.
- Keep frames from the same continuous event inside the same split.
- For the oil task, split by date and camera period, not by random frames.

## 8. Metrics

### 8.1 Coagulation: policy prediction

For \(\hat d_t\):

- MAE,
- RMSE,
- \(R^2\),
- MASE if a scale-free metric is needed.

Avoid relying on MAPE when doses can be small.

### 8.2 Coagulation: delayed quality prediction

For \(\hat y_{t+\tau}\):

- MAE,
- RMSE,
- \(R^2\),
- compliance violation rate,
- lead time before a violation,
- chemical usage at matched compliance, if a recommendation layer is used.

### 8.3 Oil detection

- mean IoU,
- Dice or F1,
- precision and recall,
- PR-AUC if class imbalance is strong,
- event precision and recall,
- mean detection delay,
- false alarms per day.

### 8.4 Statistical reporting

Because the data are autocorrelated, report uncertainty via moving-block bootstrap over days or shifts.

Report:

- mean across rolling-origin folds,
- 95% confidence intervals,
- per-regime breakdown such as day versus night, normal versus upset operation.

## 9. Ablation studies

At minimum, run these ablations:

1. Sensors only versus vision only versus fusion.
2. No lag features versus lag-aware features.
3. Fixed delay versus delay selected on validation data.
4. Hand-crafted morphology versus learned visual embeddings.
5. RGB only versus RGB+thermal for oil detection.
6. Short window only versus short + medium + daily windows.

These ablations are standard and will matter more to reviewers than small metric differences between two strong boosters.

## 10. Error analysis

Perform explicit failure analysis on:

- rain or inflow disturbances,
- camera fouling and low visibility,
- nighttime glare or reflections,
- sensor dropouts,
- maintenance windows,
- abrupt feed chemistry changes.

For Task A, inspect whether the model fails because:

- the lag is wrong,
- the visual features are unstable,
- the plant entered a regime not represented in training.

For Task B, inspect false positives from:

- shadows,
- foam,
- floating solids,
- reflective turbulence.

## 11. Reproducibility requirements

To make the paper review-resistant:

- fix camera placement and field of view,
- document preprocessing exactly,
- keep an annotation guide for oil masks and floc ROIs,
- log the plant clock and camera clock alignment procedure,
- report all selected lags and all tested delays,
- publish seeds, software versions, and feature lists,
- report missing-data handling rules explicitly.

## 12. Minimal claim set for the paper

The paper can safely claim:

- multimodal lag-aware models improve prediction over sensor-only baselines,
- image features add useful state information,
- segmentation-based oil alerts are feasible for early warning,
- the recommendation layer reduces the fitted surrogate objective relative to baseline policies.

The paper should not claim, without extra evidence:

- discovery of the true optimal coagulant dose from observational logs alone,
- reliable oil-thickness estimation from ordinary cameras,
- safe real-time RL control in the live plant.

## Selected references

- Tashman, *Out-of-sample tests of forecasting accuracy: an analysis and review*, 2000.
- Hyndman and Athanasopoulos, *Forecasting: Principles and Practice*.
- Chen and Guestrin, *XGBoost: A Scalable Tree Boosting System*, KDD 2016.
- Ke et al., *LightGBM: A Highly Efficient Gradient Boosting Decision Tree*, NeurIPS 2017.
- *Exploring potential dual-stage attention based recurrent neural network machine learning application for dosage prediction in intelligent municipal management*, Environmental Science: Water Research & Technology, 2023.
- *Machine Learning-Based Prediction of Coagulant Dosing in Drinking Water Treatment Plants Using Polynomial Regression with Lasso Regularization*, *Processes*, 2025.
- Abuhasel et al., *Oily Wastewater Treatment: Overview of Conventional and Modern Methods, Challenges, and Future Opportunities*, *Water*, 2021.
- De Kerf et al., *Oil Spill Detection Using Machine Learning and Infrared Images*, *Remote Sensing*, 2020.
