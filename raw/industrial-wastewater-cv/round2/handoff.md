Handoff Document: Industrial Wastewater CV Project
1. Project Overview & Finalized Resume Points
Two computer-vision proofs-of-concept (PoCs) were developed for industrial wastewater operations: a delay-aware coagulation dose recommender and an upstream oil-film alerting system. The approach mirrors medical "deep radiomics," combining extracted structural data with deep learning embeddings to feed lightweight tabular classifiers.

Approved Resume Points:

Architected two computer-vision monitoring PoCs for live wastewater operations, delivering a delay-aware coagulation dose recommender and an upstream oil-film alerting system using on-site video feeds.

Engineered a hybrid feature extraction pipeline utilizing adaptive Gaussian thresholding to dynamically compensate for uneven underwater illumination, generating precise binary masks. Extracted structured morphological features (e.g., floc count, equivalent diameter) from these preprocessed frames and fused them with CNN-derived embeddings.

Optimized model complexity and computational cost by applying Principal Component Analysis (PCA) and Pearson correlation filtering to reduce input dimensionality, isolating features strongly mapped to key water quality indicators (Turbidity, COD, TP) before feeding lightweight XGBoost/LightGBM classifiers.

Achieved ~92% offline validation accuracy across a 5-class expert target, mitigating video autocorrelation by evaluating feature subsets exclusively on strictly held-out temporal blocks to prevent data leakage and guarantee generalizability.

Designed a robust surface oil-film alerting system using visual segmentation paired with temporal alarm hysteresis, prioritizing actionable operator intervention over unreliable RGB-based thickness estimation.

2. Core Engineering Methodologies & Insights
Feature Extraction & Preprocessing
Instead of relying strictly on end-to-end deep learning, the pipeline extracts physical morphology metrics (floc count, equivalent diameter, area ratio, fractal dimension). To handle varying underwater lighting gradients, adaptive Gaussian thresholding (local grayness comparison) is utilized rather than fragile global thresholding. Dimensionality is constrained via PCA and Pearson correlation checks against downstream indicators.

Stateless vs. Autoregressive Modeling
Current State (Stateless): The PoC utilizes an XGBoost multiclass classifier that evaluates a fixed window of extracted features per row to output a discrete, expert-aligned dose adjustment class (-20% to +20%).

Future State (Autoregressive Regression): Moving to exact dose regression requires an autoregressive architecture. The model must process sequential history (recent frames + scalar SCADA data like flow rate and pH) to predict delayed water quality outcomes.

Preventing Data Leakage (Autocorrelation & Latency)
Contiguous Time Splits: Because video frames are highly autocorrelated, random train_test_split causes massive data leakage. Evaluation must occur strictly on held-out, contiguous time blocks.

Overcoming Look-Ahead Bias: The chemical process has a 2-4 hour latency. For autoregressive modeling, temporal purging (dropping a gap of data between train and validation sets) is mandatory so future downstream effects do not bleed into the training labels.

3. Resolved Follow-Up Item
Pending request addressed:

Final merged resume bullet:

- Planned follow-up work to move from image-based dose-adjustment classification to exact-dose regression by combining extracted floc features with plant variables such as turbidity, pH, temperature, and flow, while accounting for the `2-4h` latency before dose adjustments take effect and for dose-change history, and exploring offline / delayed RL for learning policies from pre-collected delay-free trajectories that remain robust when executed under delayed plant conditions.

RL methodology answer:

- The literature supports a simulator-first or offline / delayed RL workflow rather than live-plant RL training.
- Mohammadi et al. (2024) show the first requirement is a usable simulator or digital twin built from SCADA or sequence models.
- Aponte-Rengifo et al. (2023) show RL should be benchmarked against conventional wastewater control and can be used as a higher-level controller rather than replacing all low-level control.
- Hernández-del-Olmo et al. (2018) show the cold-start problem should be handled with an instruction or shadow period based on operator behavior before freer interaction.
- Zhan et al. (2025/2026) provide the cleanest framing for the delayed setting: learn a policy offline from delay-free trajectories, but make it robust to delayed deployment using history or belief-state modeling.
- A direct live-plant RL claim would still be too strong at the current stage.

Supporting references:

- Mohammadi et al., 2024, *Deep Learning Based Simulators for the Phosphorus Removal Process Control in Wastewater Treatment via Deep Reinforcement Learning Algorithms*, Engineering Applications of Artificial Intelligence.
- Aponte-Rengifo et al., 2023, *Intelligent Control of Wastewater Treatment Plants Based on Model-Free Deep Reinforcement Learning*, Processes.
- Hernández-del-Olmo et al., 2018, *Tackling the start-up of a reinforcement learning agent for the control of wastewater treatment plants*, Knowledge-Based Systems.
- Zhan et al., 2025/2026, *Belief-Based Offline Reinforcement Learning for Delay-Robust Policy Optimization*, arXiv / ICLR 2026.
