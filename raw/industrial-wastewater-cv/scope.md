The goal is to give a retrospective view of my job done in a previous project. It's a CV project applied in industrial scenario. Formalize things better to make them better described using AI/CV terms and methodology. The goal is a brag doc with bullet points to be used in resume. To provide more context in the docs, also propose how to overcome the remaining gaps toward a full operational model for decision making/ industrial automation.

What's actually done was 2 PoCs, currently described as below: 
"
- Developed 2 AI vision PoCs using on-site data in Ansteel wastewater treatment plants: 

 - Predicting optimal dosage of coagulants using a vision-only approach.       
    - Collected data from (the only) 2 major plants (Xidagou and Beidagou) in Anshan, Ansteel headquarter. Used fixed underwater camera placement, field of view, and focal length, at different depth level of the coagulation pool, to capture the floating flocs.
    - Applied morphological processing to the video, to give binary mask to the flocs' 2D projection. 
        - The only thing I dealt with was 2D images with flocs as foreground and water as background. However real flocs are porous, irregular, compressible aggregates, so whether projected 2D image features should be treated as correlated indicators of settling behavior?
        - Any need to think of the floc size difference caused by distance to the camera and apply any calibration?
        - Please check the relevance of my previous researches to this project. see the 3 images inside ./sources.
            - Note that coagulation result is only the best when adaquate coagulant is added. More or less both hinders the effectiveness, but the floc feature are different.
            - It is verified that the morphology features respond sensibly to dose. Is such correlation important here to be covered when preparing data ?
            - With them, check whether the dataset can be further calibrated.
    - Extracted floc count, area ratio, equivalent diameter, fractal dimension, and circularity as main features through data science.
        - They are calculated through math on the masks, not the CNN. Check whether they can be used in parallel to CNN, or given priority.
    - ??Framed as a (sequence prediction, regression or classification?) problem. Developed xgboost/ lightgbm/ fastrcnn models.
        - The coagulant dose prediction was not put into production, just a PoC. What was verified was output "+-20% / +-10% / 0" results.
        - Data are labelled by human experts. The only label is "+-20% / +-10% / 0"
        - Consider the potential this coarse grained result can be improved to the regression result, by adding the coagulant dose as x and training an e2e regression model; or by connecting 2 models, which is this classification result -> a regression model that is trained  to predict the exact usage given more sensor data like turbidity, temperature and pH.
            - For the latter, the goal should be "the model recommends a dose according to a fitted surrogate objective," not "the model discovered the plant optimum from observational logs alone.". See ## 5. Task A: coagulation modeling of `industrial-wastewater-cv/round1/AI in Wastewater Treatment Research.md`.
    - < How to tackle the major obstacle that coagulation effectiveness is only visible after 2-4 hrs of chemical process?>
        - Does this mean data, if both coagulant dose and the video is collected, is auto correlated.  
            - or does the video data itself should think of such autocorrelation?
        - Does this mean an autoregressive way of loading and ingesting the data is preferred? However constrained by the time difference, are there need to setup different some delta t? See /sources for their proposal.
        - Propose some idea to think of this question in a RL manner. The end goal is to only monitor the upstream video and underwater/downstream video to form a feedback loop and control the flow of coagulant. Check whether the correlation between coagulant and floc specs still a concern here. Also list the other chanllenges in such process.
            - Do not claim safe real-time RL control in the live plant.
    - It's only a PoC that did not went into production, so it's only developed and tested. Only the multi-classification metrics/loss function are used. The accuracy is ~92 percent. However there are no future MLOps, telemetry and monitoring process actioned.
    - Consider telling apart the traditional ML vs CNN workflow with 2 separate bullet points.
    - Some ablation studies are proposed. Justify them.
        1. Sensors only (no vision, only sensors. Not actually carried out.) versus vision only versus fusion.
        2. Lag features versus windowing/ no lag-aware features.
        3. Fixed delay versus delay selected on validation data.
        4. Hand-crafted morphology versus learned visual embeddings.
        5. Short window only versus short + medium + daily windows.

 - Identifying floating oil films from upstream wastewater, a river inside the plant, informing the need for surfactant and skimming interventions before starting processing, avoiding challenges to aeration (next process).
    - Too much floating oil impacts the aeration effect. The solution is to "swipe" the surface using a device to get away with them. Which is in the same pool as aeration, but work independently.
    - Also rgb camera only. No thermal/ir used. Treat it as an alert/early warning system.
    - Check whether frame this as a classifaction/ single-object detection with yolo/ segmentation problem, and list some proven CV tech stack for this.
    - Possible ablation:
        RGB only versus RGB+thermal for oil detection.
    - Do not claim reliable oil-thickness estimation from ordinary cameras.
"