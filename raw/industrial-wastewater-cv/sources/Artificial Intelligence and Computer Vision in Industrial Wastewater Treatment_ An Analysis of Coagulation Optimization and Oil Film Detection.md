# **Artificial Intelligence and Computer Vision in Industrial Wastewater Treatment: An Analysis of Coagulation Optimization and Oil Film Detection**

## **The Industrial Wastewater Context at Ansteel**

The integration of artificial intelligence (AI) and computer vision into industrial wastewater treatment paradigms represents a critical evolution in environmental and chemical engineering, particularly within high-volume, complex manufacturing environments such as the steel industry. Facilities operating at the scale of the Ansteel Group in Anshan, China, process hundreds of thousands of tons of complex industrial effluent daily. These facilities are tasked with achieving zero liquid discharge during non-rainy seasons and exceptionally high recycling rates, converting over 95% of industrial and domestic wastewater into grades suitable for reuse in production.

The effluent from metallurgical processes contains ultrafine particles (less than ![][image1]) that settle slowly, form weak flocs, and lead to progressive accumulation of suspended solids. To manage these complex matrices, treatment facilities rely heavily on chemical coagulation and flocculation, alongside the mechanical separation of contaminants such as floating oil films derived from upstream riverine systems.

Historically, determining the optimal dosage of coagulants has relied on highly empirical, labor-intensive methodologies. These conventional methods suffer from substantial temporal delays—often requiring between two and four hours to yield actionable visual results regarding floc settling and supernatant turbidity. Consequently, static empirical models fail to capture the non-linear, dynamic fluctuations in real-time wastewater characteristics, leading to sub-optimal chemical dosing and excessive operational costs.

This analysis provides an exhaustive technical evaluation of two specific AI-driven solutions deployed at Ansteel: the optimization of coagulant dosing through computer vision, autoregressive data pipelines, and gradient boosting regression; and the automated detection of floating oil films to preemptively trigger skimming interventions.

## **Formalizing the Coagulant Dosage Optimization Problem**

The prediction of optimal coagulant dosage in wastewater treatment is fundamentally a non-linear, multi-variable regression problem. While water quality parameters such as raw water turbidity, pH, ozone dosage, and electrical conductivity fluctuate dynamically, they serve strictly as input metrics and historical features rather than output targets. The *sole* prediction target of the formulated model is the precise, continuous usage of coagulant required (measured in ![][image2]).

### **Proposed Method to Tackle Time Dependency: Autoregressive Data Pipelines**

The most significant hurdle in this regression problem is the severe temporal credit assignment issue. The chemical processes of charge neutralization and sweep flocculation require a substantial hydraulic retention time—typically 2 to 4 hours—to visibly manifest as fully formed, settleable flocs.

To tackle this time dependency, the problem is formalized using an **autoregressive data pipeline**. In this structure:

* **Time-Lagged State Mapping:** The pipeline constructs historical time-series sequences of data (e.g., ![][image3]). Instead of mapping current water quality to current dosage, the system utilizes specific historical lookback windows (spanning ![][image4], ![][image5], and up to ![][image6] delays) of sensor and video data to predict the optimal dose at ![][image7].  
* **Frame-to-Dose Causality:** Each frame of the underwater video inherently displays the morphological result of a *prior* coagulation dose administered hours earlier. By shifting the target variable along the time axis by the exact retention delay, the autoregressive model successfully maps the delayed visual feedback to the historical chemical action, creating a continuous, self-correcting feedback loop.

## **Vision Pipeline: CNN Feature Extraction and Morphological Preprocessing**

The primary data source for assessing flocculation efficacy consists of underwater video feeds (utilizing a fixed focal length) captured from different depths within the sedimentation basins, combined with the historical amount of dosage applied.

Rather than deploying complex, computationally heavy attention-based vision models, the actual deployed architecture relies on a streamlined Convolutional Neural Network (CNN) without attention mechanisms, functioning primarily as a spatial feature extractor. This is paired with a highly rigorous, traditional morphological preprocessing pipeline to translate raw underwater video data into actionable numerical metrics.

### **The Morphological Preprocessing Sequence**

The extraction pipeline follows a strict, sequential computer vision approach to isolate flocs from the turbulent aqueous background:

1. **Grayscale Conversion (灰度转换):** Raw video frames are converted to 8-bit grayscale to reduce computational overhead while preserving structural fidelity.  
2. **Median Filtering (中值滤波):** A non-linear digital filtering technique is applied to remove acoustic and fluid-dynamic noise (such as micro-bubbles) without blurring the sharp edges of the forming flocs.  
3. **Adaptive Thresholding (自适应阈值):** Dynamic thresholding algorithms segment the image, creating a binary mask that separates the regions of interest (flocs) from the water matrix based on localized lighting conditions.  
4. **Morphological Operations (形态学操作):** Erosion and dilation techniques are applied to the binary mask to remove isolated noise pixels, close internal holes, and ensure contiguous boundaries for each identified floc.  
5. **Feature Extraction (特征提取):** Once segmented, specific quantitative descriptors are mathematically extracted from the shapes.

### **Extraction and Correlation of the 11 Major Features**

The preprocessing pipeline systematically extracts 11 major first-order and second-order morphological features that encapsulate the physics of the aggregating particles. These include metrics such as:

* Influent Turbidity  
* Effluent Turbidity (Sand Filter & Sedimentation Tank)  
* Flocs Area  
* Flocs Circumference  
* Equivalent Diameter  
* Fractal Dimension  
* Circularity

To reduce model complexity and minimize computational costs, a data science approach utilizing Pearson Correlation Analysis is applied. By evaluating the linear relationships between these 11 features and the actual coagulant dosage, the matrix identifies the most heavily weighted inputs. Analysis reveals that features such as *Floc Number*, *Area Ratio*, *Equivalent Diameter*, and *Fractal Dimension* exhibit highly significant correlations with the target dosage (often exceeding a Pearson coefficient of 0.85 at optimal ![][image8] PAC dosages). Ultimately, this quantitative filtering reduces the input vector to 8 key features, which are then passed to the regression algorithms.

## **Dosage Prediction Regression: XGBoost and LightGBM**

With the optimized, low-dimensional vector of morphological features and time-lagged sensor data prepared, the system employs tree-based ensemble algorithms to execute the final regression task. Both eXtreme Gradient Boosting (XGBoost) and Light Gradient Boosting Machine (LightGBM) were developed, tested, and compared for this specific application.1

* **XGBoost:** Utilizes a level-wise tree growth strategy and incorporates advanced L1 and L2 regularization to prevent overfitting to the highly correlated noise present in wastewater data. It provides exceptionally high accuracy for tabular regression tasks.1  
* **LightGBM:** Engineered for massive datasets, it employs a leaf-wise growth strategy and exclusive feature bundling. LightGBM frequently achieves predictive accuracy nearly identical to XGBoost but with significantly faster training and inference times, making it highly advantageous for continuous, autoregressive retraining pipelines.1

In this architecture, parameters like pH, influent/effluent turbidity, and conductivity are treated strictly as contextual metrics to support the regression trees. The singular output remains the precise coagulant dosage required to maintain process equilibrium.

### **Optional Integration of Reinforcement Learning**

While the XGBoost/LightGBM regression models reliably forecast dosages, the system can optionally integrate Reinforcement Learning (RL) to transition from passive prediction to active, closed-loop control. If deployed, an RL agent utilizes the autoregressive data as its state space and controls the physical pump modulation as its action space. The algorithm relies on a *delayed reward* mechanism, where the success of a pump adjustment is evaluated 2 to 4 hours later based on the effluent clarity and floc morphology, continuously updating the control policy to maximize long-term treatment efficiency.3

## **Automated Identification of Floating Oil Films**

The second major AI vision solution deployed within the Ansteel facility addresses the critical upstream issue of oil contamination. Industrial effluents and the localized riverine systems that run directly through the plant infrastructure frequently contain substantial quantities of free, floating oil. If allowed to progress untreated, these floating oil films present catastrophic risks to downstream secondary treatment systems, primarily by disrupting the biological aeration processes.

### **Preempting Aeration Challenges**

Secondary biological wastewater treatment relies absolutely on maintaining strict dissolved oxygen concentrations in aeration basins. When an upstream oil slick enters the aeration basin, the hydrophobic hydrocarbons rapidly accumulate at gas-liquid interfaces, creating a highly resistant physical boundary layer around rising air bubbles. This accumulation severely depresses the oxygen mass transfer coefficient, physically starving the aerobic bacteria of oxygen and causing systemic process failure.

### **Computer Vision and Automated Remediation**

To prevent aeration failure, an automated early-warning system utilizing computer vision detects the presence of oil films from the upstream river before the water reaches the biological reactors. Algorithms process continuous camera feeds, predicting the spatial extent of the film and calculating surface area contamination.

Upon positive identification, the system informs the need for immediate, targeted interventions:

1. **Mechanical Skimming:** The system prompts the deployment of active surface skimmers or DAF units to mechanically corral and remove concentrated free oil from the water surface.  
2. **Surfactant Injection:** For thin films and microscopic sheens that evade skimmers, the system calculates the need for chemical surfactants. Surfactant dosing rapidly reduces interfacial tension, fracturing the contiguous oil film into a stable, highly dispersed micro-emulsion that can be safely processed by downstream bacteria without clogging aeration diffusers.

#### **Works cited**

1. Feature-engineered machine learning for daily-scale prediction of effluent total phosphorus and coagulant dosing optimization in full-scale DAF systems \- IWA Publishing, accessed April 12, 2026, [https://iwaponline.com/wst/article/doi/10.2166/wst.2026.256/111429/Feature-engineered-machine-learning-for-daily](https://iwaponline.com/wst/article/doi/10.2166/wst.2026.256/111429/Feature-engineered-machine-learning-for-daily)  
2. (PDF) Modeling Coagulant Dosage in Water Treatment Plant Using Explainable Deep Learning Model–Based SHapley Additive exPlanations (SHAP) \- ResearchGate, accessed April 12, 2026, [https://www.researchgate.net/publication/396168391\_Modeling\_Coagulant\_Dosage\_in\_Water\_Treatment\_Plant\_Using\_Explainable\_Deep\_Learning\_Model-Based\_SHapley\_Additive\_exPlanations\_SHAP](https://www.researchgate.net/publication/396168391_Modeling_Coagulant_Dosage_in_Water_Treatment_Plant_Using_Explainable_Deep_Learning_Model-Based_SHapley_Additive_exPlanations_SHAP)  
3. Adaptive optimization of natural coagulants using hybrid machine learning approach for sustainable water treatment \- PMC, accessed April 12, 2026, [https://pmc.ncbi.nlm.nih.gov/articles/PMC12062499/](https://pmc.ncbi.nlm.nih.gov/articles/PMC12062499/)

[image1]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAYCAYAAAC8/X7cAAACqElEQVR4Xu2WWaiNURiGX1NKZMgxk7lOIpkiLkxRiCui1MElSmROuRM3SDJlylBkKPOYC7nkhgtzHXOSzJkK7+tb6/j22vs/UrLb2k89tdf7773/9f1rrW9voEyZMimdaVUaOrrSuXQVHZ9cKxqVdDW9Rr/RU7mXaxhBH9B5dCS9RA/mvKNIDKKzaH/6GYULqEcf04Uua0HfofYV++dkFTCRfqf9kvwKvZhkRSWrgPWwArok+XHYZ+oneVPaK8lEk2Q8mPZ2426ws9XGZe3pBNrBZZlkFbAfVkDbJD8U8tZJfjVc86ygN914CV1Lv9AZdBPdQBfD5jEGtrV179m0mi7Hb8gq4BwKT1SHWLkaQaRVyBa5TNyiB8JrrZBWTzyjn+jQMBZ6AO/pfJeto0/duCAq4HQakrOwSfmlFbGAni6bEjI1h0i7kM0J44F0Ku0Y8pUhjzyiF5JM91JeKyrgTBqSfbAbaT96DodcHSmymb5F7rmYDntfH5f5XB0wonOmTO06Upe+oHtcVpCsAtYgf6uI8/QDreMybRWtmGc7fQWbSJq/hrXpyEzYvfq6bFTIJrmsICogvbkYDvuCsUmuyR51Yx1yvU8/jJ779GR4vcvld+kJNxa76UvkFruNvqENYb876Tx+0gDWES4jvy3qCd2AtdOI9v1HOtpl02AF7A1jrYwOnzL9/dAW2hiuxXPhD6qopkeS7Drs0Gsemp8KqWEc7Ek8ge1d+ZzegXWLSCfYl++kC+g92IQ9W2Ed5SHdAXu66kZbYN95DL/6uZ6iOk2PMBbN6FfYAfcsg/3V0d+XYcm1P0IrM4RORv5vgrgN62J68t1pI3dNT9yvrF63dONI8zQIVNDGafg3UYvVltAPUUkS+/+A9EKpsBS2hdJWWVL4fl7mv+cHLDCXr7jJ9PEAAAAASUVORK5CYII=>

[image2]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAYCAYAAAC4CK7hAAACs0lEQVR4Xu2WWaiNURiGX0NCyBgRnTJHhpK4caQo4p4LGULGC1OmckERScgFIUmEC2Qmcm6QIW5NcZIpZQpXMrxv31rnfL7z2+fSPjpPPe2937X+vdf0f/8GGmnkb7SLQUNkDN0Uw4bIAToshmQNfZZ84l43+E7lQit6M4aOJvQT/Ua7h7ayYhpdHUPHAPqLXogN5cZ52iuGjnmwiayMDUU0p+Npj/S5GR1OJ9A2uRMZRCeh/gqjgU2k7WNDoBu9GsPAEdhERsSGIo7RvbCzqAmdpmvpHvoBNrCtdAddBTuvY3VhoAvsCFTRxfQGvUKXuj4e5bNjGHhJP8MWtySVsCrQHzbz57RzatNuKHtPR6VMPKBH3WfRmj6mh2nTlM2AXT8rdwroJi+1u31h15+LDUXMoQPpdNhFmlimd8rWuUy8hQ3Ysx3Wt8JlC1PWx2WZwfR4DANzYdeviA2JrjEQ+2FHK6+m0Erqi4a6bEjK4pF4Te+F7AR9FbLMFjo5hgHtun5rZGwgLem1GIqnqLuFh2D3iJ/cRvodtcdP5J3b5TLV/3eoewSFvu8+rMiU4g39guJ+i1BQtlWtNJDlIa+mp0Km++BSer+bdoRt8Q+6IHeCPan1nSqfkXF0ZwwDOu66Pv+Wpyd9kV7/QA8lXaSSm6lI2RKXadDKlsF2QUcnU0W3pfdamIewvrphIwdRfzlVRdP1ftVVuXQcq+l1l9ewGfbDOg6ZKbBt1YA9Kq8XYWXV/2XQItylt+g+egdWOiP6S3I7hg7d2FptHV9N5CNs4Mq+0p+prbAStoWVz0iHGCS0pUXnNpPvj1jZxFTYM6rs0I2rgemJn6mErWZRVTqD0n9J/hmjYYNWNRP96CO6vqZHLZ3o5RiWCy1g99hJehZWjYp2QsynM2PYENFE/J/QRv5bfgNVRoucao/QbAAAAABJRU5ErkJggg==>

[image3]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAJ8AAAAYCAYAAADkri+AAAAElklEQVR4Xu2aacgVZRTH/+2JVlRUmlamRYuVqeVSQZcoChMpIgzb3qBNzQ8RZpuIoqBRBPUhoqgXimjRDwWl2PamJUVFX/rSZlpWZiSYqS1Q/f+cGd+5585y33HuMjU/+OPrOTNzz3PnnGeeOc8FKioqKioqKioq/i9MoT5qQuupd6ixdlouhlDvo/HaXh9Q71I32Gml52k0jtHrQ2od9XBwTjfRsvifpD6lLqeOo4ZSa6h/qCuoowL7jYHtJDstF9dSW6jbqFGwz1oEu+6D1NHUMOpC6ifqZjut1IygfqeWUafCxncpbMxrYd+Bxn0WrOCes9O6hpbFvz/1OXWEs/9I7YD5o2ym9nO2gfAKLLGivAAbyGRnX0Gd72xl5E5qobPdDhvzPc4+h7rf2TpNy+K/hFrubMpuXXiVs+9LfexsA+EQWGV4khL9LepwZysjGocv7rDgJjn7AupKZ+s0LYu/hxrtbGFWz3d2JU/TWR3DeDQGlpTowhdFGTkQdkM8Wnr8isaCm00d72ydpO3xvwhLiIne0QJmwT7rbu/4D3MabMyve0dJaGn8Wugrq/dmbdcsL6F9id4taHYoc8G1LP4xyM7qY6hbvTEH+1BbkZzoWmNeBpv2xzlfmXkZ6QX3EGwdfLZ3dAlZ8edGbyu68DzvCHiUWk197x05CBP9Ne8IeACWfDXqaxST8J0mq+CEWhk7qQO8owtoJv7cqL2hhDjXOyLUUEzy3YHkRD8IdgPCFxQlogZd+IDbzBlILzgxk3rDG7uEZuLPhbL6Z2RndQ3Jyae3o5O9MYGVSJ++Z1BHBn/PpTb2u/Zwujc41CDPaoqr0NLGqyarmuxpZMURonFkrZfU9FexaeZTgeqcNCYgfZZUE/hEb4yg+657oGVOFs3EfxGsU6G+7fWwyUWfkYoC0IWzqq6G5OTrpf6G7WSkcTC1jdqFxtd1jwJXf1HNzig9sHifcPYo31B/USOdPST8Mh/xjoBB1HbqN1irKY4eZMcRorW0jk1rnn9BTaXuoq6mNtW76+iBXe8pZw9RUekF8g/YLkQc98Gusdg7YsiK/xZYMZxA/UldAFsyaTergWNhzo2wGW93oO+orxBfMTXqB28M0M38hXrWOwL6qA2wY5R42rZRz0gxXNN/WB33Uku8kZwHW5h/6R0Rnqc+g+0px3ExbNcmaQ9Zif829R6SZ4asODQLaHw6JhyzCk/fg0963Q/dXHUBlOzSyOgBDn227pVaVkm8Sn0CeyrFMR02mVzlHQEDiT9crul71X6vODP4txBqsECSUIXppheBEjJsdmsaj5u+3/SGDlFEHFrvrYPtfWu//bB6d2lYCturL5wa0pNPX+BN3pgDrR30dq02yzmIn02HU894YwcoKo7H0b+L9C11SuT/ZUA/KtAjV8sk/ShFxO2Q5GIR7LmvdVAvNa3Oa5XaRw129oFyKOwz9AgK1Rc9IEA9p735iVdRFBWHHo/ho6sX9ljTuqkM6Kmk2V9LpMdg69CFaGOPVjNU0ttr0ShBr/PGDlBkHLpWlKSXnG4mHIMmorhlUkVFRUVFRUV7+Rc/IxpRK4XdkQAAAABJRU5ErkJggg==>

[image4]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACQAAAAYCAYAAACSuF9OAAACQUlEQVR4Xu2VS4iOURjH/65DRmaBEJHExq0sXEpGUpaUKTbGrSkys3SZZsTKrSjJRCwUNsrKrUZMrkV2EgtZTZEFGizcxv8/z3u+ed4z55tXaXbvr37NnOc53znn/d7nPB9QUlLIGFoXB1NMoLvoCdpCp+bTVamn2+gi2GYL6Q66ys0R62kP7aU3otwA5tJntJk20Zf0K2yRIg7DNvE+QvqBtI/y++NETBdtdONJ9Bf9lv0/GIdgD/CcXqG76Sg/wbEZdqBlccIznP6gf+g0F78H+/BOF0txkG6Ng1U4B3ttI+NEzFl6E/mJiulA210sRTv+/UBv6G06jq6mS/LpwdEr0GsremVt9Bi9Rh/SW3RGboahmtID3oUdag/thNVbIWthH74QJxIcoC/oxGy8kX6m6yozjE2wNXWYEVks7LM4TEoxnr6m1+noKJdiCgb2lXf0Law+Ax2wS6L2EtgCO5BaRRLVkJ7gIvqfoohhcYA8hm0028VewV6R5xL9iPQafeggqofAAljxVUO38gM9FcUfwA40PxtPzsatlRlADf1Ez7tYDjW4fVFMC6gmAirwOW48D+la0236jv5+pDU0b0VlBrAhi62hM+kRl+vrzuoP92H9p4s+oV9g31JAtfGTznKxO3S6G+sqayMVe+A0rPP7hnkUdmjV6Rm4ZjkWdr21SOxv2O9T4CqsK9e62Er6lJ6kx+n77K/vaWoHl91YLKXdsHaxN8r9NyrK5bQB+W8voBryNy6gLyP1m1dSUjJk/AWq23TSqb2H+gAAAABJRU5ErkJggg==>

[image5]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAYCAYAAAAVibZIAAABVUlEQVR4Xu2UvyuFYRTHv+THwEhhYDZISmKwKGWW0rXd9Q43k4RNBmVTYpcyGEiRRSb3LxCKrh+TwW+Tge9xnlfnHp5XrO6nPt33/Z7znp573+e5QJk/UEUbfPgTtXSbtrm8hd7QN/pIK0vL6cxDH2z3Beiga7rrC2n00GfEhzZDa5O+EEO+9gFdQHxoBlrr9YUYc3SMTiA+dIU+QRfQTQdoTUmHoYtuhOu0ocf0hG7SGbpI72ijbRJki+xD364QG9oU8stwLcgqJRtPmhKmadbcx4aOhnzQZK0hy5vs48EtGyA+dIm+0GqTyWKkt8NkyNELWqTnwQdo4xUtfHYCR3TP3As79NRl3yI/vl+pvAjJplz2Smehh2LV1L6wDB3QabLhkPWZbChk/XQEkQMhe/SM3kPP9i09DDVZTRG6UxLqoP3rdA26d39FfdBTAf3jkc8y/553pIhKTFCqBuYAAAAASUVORK5CYII=>

[image6]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAYCAYAAAACqyaBAAAB5UlEQVR4Xu2UTShmURjHHx8j8lW+Bhs7O0sRK8nCzsLHkFJiahaslGJFZoGVkigz2UpYCQu8SsisRgqNZoaVFWGQr+H/eM7rPfdxTzZWvL/61T3/c+597j33nEMU5g2SCON16Ecy/AL7YSvM8nb7UgN7dAj64BW8h22q7xm5cAO2wM9wC/6DFfYgRTY8huO6w8DP4eKFukMTgA1WOx3ewnNz7cckvCN38RF4BqN1h00kvIb/Sb4myCLJmzdZWZB62A0vyF18F87p0I8hOEPet+SMizdaGfMRLsMYchfn9cL3tsMMWA5zPCNe4AfJ1Otp52L55tpV/BNJce6bIFnIe/CrPchFGcnNoyqvhL1W21V8mOT+Tivjwkckv9kJ780dOEUytUFSSKY71spcxbfhisq+kxR3wv98Fn6DUapvDBarzK84rwn91cw+yQ5xwkXtac2DJeb6F8kD/sDf8C9JET4PuF1rxlWbvMi0mQKT1VmZhy6S1WnTQfKf/Uil0KKyGSR5oQ9WNgAvYQKsInV48WnEB8ISyf4OwFV4QvL1fmSSFJ9W+SacV9k6XIARJDWezvs4ki3FD9LyCWYvsCBr8BCeGg9Ipp0X6A1sDg19hI/tnyQvUKr6XhWeET/SYJIOw4R5HzwASxlw9khxOJMAAAAASUVORK5CYII=>

[image7]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAYCAYAAAD6S912AAABLklEQVR4Xu2UvyuFURjHv35NLkkpKcONQSkmyiwZGO5kZaOURZJMFsW/YFA2ZaYoFlkoVkUpSrJRjHxOz+m91+Piva87yac+y/c55+mc857zSv9UiyE8TeEJHmG/TfuaDTzHMezEdtzHNyxgW8wnY9Zt08pTj5fY6vJ7fJbVS7nDOpd9YATXXNYjW8mey2vxzGWfmMIul83IGi66vAmXXZaKbVnDQV/IygM+6YezSkuvbHW7vpCVWVnDBV/Iyo6s4YAvZKEGH/X9+eVwSXYD+nBe9tLKEr5qWN2BL0RCs1VswE3ZbqZxq3RQB17jjWxlr9FbvMJ8MrL4LAPHKj7VlmRERhrxBZt9oVKGcQXH8SJm4ZhGkxEVMiE7u3U8xDlV4XqFbYbbEH4Uv97yH+Adghs5b8MTjSUAAAAASUVORK5CYII=>

[image8]: <data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEUAAAAYCAYAAACsnTAAAAADyUlEQVR4Xu2XWYxNWRSGlyZaCWLqmIIyEx1TRPQLWgwx9ZsEiRiCoImYp8QDoVPSEdMDMUUMMTYxEzSJmfDgxazMIqE1OiJC+39rb3fVurfurQdRUlVf8uc6/97nnNrrrL3WJlJCCcWZSt4o7nSCFnjza/AjtA+q7wdAQ2ic6Iv7uLHvgTVQG2+CmdCdoJvmd66dlI4c6H+ohfN/he5BE6Cu0HFoa54ZhUsWdMabhlLQS+g/qLYbS0sH6I0kB6U09BCaYryq0GtoiPEKk4HQDG8amouu64AfSAe3zUnoT0kOym/Ba2c8cgo66rzCYj9Uz5uGUaJrmOoH0jEfGgRNk+SgLA5eA+ORPdA7qEy45m93qE64Zoa1hXpAFYJHWkK9JXOn4CJ7QZX9gKOmZP44m0TX0N4P5Af/8J3h36mCEh9Yy3hke/BrhOst0ErRvcvg7IZmQSugF6KLXCga5Omi+7sLb3T8JJrmJ0QL+2noCDTRzLHQH+5NB7f/v6IfKiP8un9LovikCsrh4MXFR1ho49zOotW8WfDuQtXDPGYJvedQx+CRK9Bmc03KQzegDdAPwRsiev+wOMnBApsu65qI3s+uWiBmS96XpQrKoeAxTS0xKE2hEaL3DA4egxRpFDy+y/JUdPGWRaJzs403NniNjRf5WTJ3wZGi99tGYcnzsbkI1gVLqqBsDF6sFZEdwWcniqwW3T7xKxMGnfNaG69V8HzaP4YuOW8b9Mh5kRyorzcdzEa+i93VUw46Zg1+AZ49ciVxuOG+4wMeQOfCPL7YB4pwn7Mu8AwQuSXJabpetKbYQM2D3ktii5GYUUuNx2c/k+RtRvi8y5Io9PnxRPT4kGre75K+lX9mmSQHoEvwehqPXIP+MtfMJM6bbDySC+1yHusGtyVZLpptTOMP0Jg4SfSEymeypXp4iFziTQfXwfvjuyx1ofvhNy3sFD7VWbGvinaNCOvIW6ib8XiA4r3sZpHs4I03HgNAb5JodnB7RE6InpUIg8zAcy6LpWedZG6x7Ey832YD18MtlyvaZPKFZ5TbovXglWi6nzXjbKe50FrRxXCbMAiWP0QXYbdTP9HU5eItbLkHRbegPXYzoBdF370KuiDaTj1Z0HlvGlhUmQXcogzKP6J/Pz2e2j+Gsfw6WoHhnvwF6i/JZxZSUbSleqp4I8C0TbXPI7Ge+A5FBoiegYo0LJpcJE+6kc6iXzlVd2HXTHesLxIwAxkAdiXCmnUdmvNlRoJqogfKIk9Z0ZrEbrZXtKukyhAyGhrqzeIOg2L/g1lCCd+YT13S2DuPRz2xAAAAAElFTkSuQmCC>