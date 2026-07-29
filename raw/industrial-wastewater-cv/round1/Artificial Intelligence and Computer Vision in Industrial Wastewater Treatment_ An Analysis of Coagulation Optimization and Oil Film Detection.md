# Industrial Wastewater Treatment with AI and Computer Vision: A Defensible Technical Analysis

## Scope

This note focuses on two realistic AI/CV use cases for a large industrial wastewater plant such as a steelworks:

1. Coagulant-dose recommendation under delayed process feedback.
2. Surface oil-film detection for early warning and physical removal.

The goal is not to claim a fully autonomous plant. The goal is to state what can be modeled cleanly, what can only be estimated approximately, and which claims are strong enough for technical review.

## 1. Coagulant dosing is a delayed decision problem

Let

- \(s_t \in \mathbb{R}^p\): sensor vector at time \(t\) such as influent turbidity, pH, conductivity, temperature, flow, and current actuator state.
- \(I_t\): image or video frame at time \(t\).
- \(v_t = \phi(I_t)\): image-derived feature vector.
- \(d_t\): coagulant dose actually applied at time \(t\).
- \(y_{t+\tau}\): downstream quality observed after a process delay \(\tau\), such as effluent turbidity or TSS.

The key issue is delay. In full-scale coagulation and settling systems, the visible or measured consequence of a dose change is not immediate. The effective lag \(\tau\) depends on hydraulics, mixing, recirculation, and measurement location, so it should be estimated from plant data rather than fixed by prose alone.

### What is identifiable from historical data

If a model is trained as

\[
\hat d_t = f(\mathcal{H}_t),
\]

where \(\mathcal{H}_t\) contains only information available up to time \(t\), then the model learns to imitate historical operator actions. That is useful, but it is **not** the same as learning the truly optimal dose.

To talk about an optimal recommendation, the objective must be defined explicitly, for example

\[
d_t^* = \arg\min_{d \in \mathcal{D}}
\mathbb{E}\left[
\alpha \, (y_{t+\tau}(d) - y^\star)_+^2
+ \beta \, d
+ \gamma \, (d - d_{t-1})^2
\mid \mathcal{H}_t
\right],
\]

where

- \(y^\star\) is the quality target,
- \((x)_+ = \max(x, 0)\),
- \(\beta\) penalizes chemical consumption,
- \(\gamma\) penalizes aggressive pump movement.

That formulation is mathematically defensible because it distinguishes:

- policy imitation: predict what operators historically did,
- process forecasting: predict future quality under a given dose,
- optimization: choose the dose that minimizes a stated objective.

Without intervention data, jar tests, or a validated surrogate process model, a paper should avoid claiming that historical supervisory data alone reveals the true optimum.

## 2. How computer vision fits the coagulation problem

Computer vision is useful because floc appearance carries process information that scalar sensors miss. The reliable way to use vision is as a feature source, not as magic proof of causality.

### A practical vision pipeline

For fixed cameras with stable lighting, a defensible pipeline is:

1. Frame selection and region-of-interest masking.
2. Illumination normalization and denoising.
3. Classical segmentation or lightweight learned segmentation.
4. Extraction of shape, count, and texture statistics.
5. Temporal aggregation of those statistics before fusion with sensor data.

Useful hand-crafted features include:

- area \(A\),
- perimeter \(P\),
- equivalent diameter

\[
d_{\mathrm{eq}} = \sqrt{\frac{4A}{\pi}},
\]

- circularity

\[
C = \frac{4 \pi A}{P^2},
\]

- solidity,
- aspect ratio,
- count density,
- texture statistics from gray-level co-occurrence matrices,
- optional box-counting fractal dimension

\[
D \approx \frac{\log N(\epsilon)}{\log(1/\epsilon)}.
\]

These are mathematically valid image descriptors. They are useful proxies for floc state, but they are still proxies.

### What the prior floc studies imply for data science

The slides you provided are consistent with a standard and defensible feature-engineering workflow:

- start from a broader candidate set, for example 11 water-quality and morphology variables,
- use Pearson correlation only as a first-pass linear screening tool,
- retain a smaller subset of key variables for downstream models.

In the shown dose-sweep results, variables such as floc count, area ratio, equivalent diameter, fractal dimension, circularity, and related water-quality variables show substantial correlation with PAC dosage. A separate controlled experiment also reports that, within that experiment's dose range, coagulation quality peaks near 40 mg/L and is associated with fewer flocs, larger equivalent diameter, and easier settling behavior.

That is valuable prior evidence, but it should be interpreted carefully:

- those correlations justify treating morphology as informative state variables,
- they do **not** mean Pearson correlation is sufficient for final model selection,
- they do **not** imply that 40 mg/L is a plant-wide constant optimum,
- they do **not** remove the need to validate under different feed chemistry and hydraulic regimes.

So, from a data-science perspective, the right use of those studies is:

- as motivation for candidate feature construction,
- as prior domain knowledge for lag selection and interpretation,
- as a controlled calibration reference separate from observational plant forecasting.

### Important physical caveat

It is tempting to jump from image features to settling velocity through Stokes' law,

\[
v_s = \frac{(\rho_p - \rho_f) g d^2}{18 \mu},
\]

but that equation is exact only for small rigid spheres in laminar settling. Real flocs are porous, irregular, compressible aggregates, so projected 2D image features should be treated as correlated indicators of settling behavior, not as a full physical substitute.

That distinction matters in review.

## 3. Reasonable model classes

For plant data of this kind, the strongest default baseline is usually a lagged tabular model, not an exotic architecture.

### Strong baseline

Construct a lagged design matrix

\[
z_t =
\left[
s_{t-\ell_1}, \ldots, s_{t-\ell_k},
v_{t-\ell_1}, \ldots, v_{t-\ell_k},
\text{rolling stats},
\text{calendar features}
\right].
\]

Then compare:

- ridge or elastic-net regression,
- random forest,
- XGBoost,
- LightGBM.

These models are strong because industrial historian data are mostly tabular, noisy, partially missing, and nonlinearly interacting.

### When sequence models are justified

LSTM, GRU, temporal convolution, or transformer-style models are justified when:

- there is enough data to support them,
- the delay structure is not well captured by a sparse lag set,
- the paper compares them against strong tabular baselines.

Attention is optional. It is not a prerequisite for rigor.

### Explainability

SHAP or related methods are useful for model inspection, but they do not prove causality. They explain the fitted model, not the underlying plant mechanism.

## 4. Oil-film detection is a segmentation and event-detection problem

For upstream oil monitoring, the clean mathematical target is a mask or severity score, not volumetric oil mass inferred from a single camera.

Let \(M_t\) be the predicted oil mask and \(W_t\) the visible water surface region. A simple severity statistic is

\[
c_t = \frac{|M_t \cap W_t|}{|W_t|},
\]

the contaminated surface fraction.

That is defensible. In contrast, thickness or volume estimation from RGB alone is generally not identifiable without calibration, geometry, and usually an additional sensing modality.

### Sensor choice

- RGB is useful in daylight and for sheen texture.
- Thermal infrared can help when there is measurable thermal contrast.
- Multimodal RGB plus thermal is often more robust than either alone.

For the model family, semantic segmentation is the right framing:

- classical thresholding and morphology as a baseline,
- U-Net or YOLO-seg style models as learned baselines.

The publishable claim is early detection and boundary estimation, not exact mass balance from imagery.

## 5. What interventions are technically defensible

Once oil is detected, the defensible first-line actions are:

- alarm and operator notification,
- diversion or isolation of the affected stream,
- skimming,
- gravity separation,
- dissolved air flotation when appropriate.

The previous draft treated automatic surfactant injection as a routine remedy. That is too strong. In oily wastewater treatment, surfactants often increase emulsion stability and can make downstream separation harder. If a plant wants to study chemical dispersion, that should be a separate, tightly controlled treatment study with its own mass-balance and biodegradability validation.

For aeration risk, the correct high-level equation is the oxygen transfer rate

\[
\mathrm{OTR} = K_L a \, (C^\star - C),
\]

where \(K_L a\) is the volumetric mass-transfer coefficient. Oil contamination can alter bubble behavior and interfacial conditions, but the magnitude of the effect is plant-specific and should be measured rather than asserted categorically.

## 6. Bottom line

AI and CV can combine with industrial wastewater treatment in a technically sound way if the problem is framed correctly:

- vision provides additional state information, not proof of causation by itself,
- lagged prediction is valid, but "optimal dosing" requires an explicit objective and counterfactual logic,
- tree ensembles are strong baselines for fused plant data,
- oil monitoring should be framed as segmentation and event detection,
- automatic surfactant dosing should not be presented as a default intervention.

That framing is mathematically cleaner and much closer to what reviewers expect.

## Selected references

- Chen and Guestrin, *XGBoost: A Scalable Tree Boosting System*, KDD 2016.
- Ke et al., *LightGBM: A Highly Efficient Gradient Boosting Decision Tree*, NeurIPS 2017.
- Lundberg and Lee, *A Unified Approach to Interpreting Model Predictions*, NeurIPS 2017.
- *Exploring potential dual-stage attention based recurrent neural network machine learning application for dosage prediction in intelligent municipal management*, Environmental Science: Water Research & Technology, 2023.
- Abuhasel et al., *Oily Wastewater Treatment: Overview of Conventional and Modern Methods, Challenges, and Future Opportunities*, *Water*, 2021.
- De Kerf et al., *Oil Spill Detection Using Machine Learning and Infrared Images*, *Remote Sensing*, 2020.
