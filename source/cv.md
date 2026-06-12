#show link: underline
// Uncomment the following lines to adjust the size of text
// The recommend resume text size is from `10pt` to `12pt`
#set text(
  font: ("libertinus serif","Noto Serif CJK SC"),
  size: 11.5pt,
 )

// Feel free to change the margin below to best fit your own CV
#set page(
  margin: (x: 1.8cm, y: 1.8cm),
)


// For more customizable options, please refer to official reference: https://typst.app/docs/reference/

#set par(justify: true)

#let chiline() = {v(-3pt); line(length: 100%); v(-8pt)}

= Yixin Zhang 张艺馨

Tel/WeChat: 137 9682 3395 | #link("mailto:hi.yixinz@gmail.com")[hi.yixinz\@gmail.com] \
GitHub: \@#link("https://github.com/yixin-zh")[yixin-zh] | 
LinkedIn: \@#link("https://www.linkedin.com/in/yixin-zh")[yixin-zh] 
\ Avid learner, tech-savvy and book lover. Co-think and co-improve tastes with LLMs.\ English proficiency: IELTS 7.5 [expired Apr 2026; retaking on 6 Jun], CET6 646 (top 2%) 
== Job Experience
#chiline()
* R&D Engineer * \@ #link("https://www.insightos.cn/")[上海具识智能有限公司] #h(1fr) Sep 2025 -- Now\ Startup founded by #link("https://scholar.google.com/citations?user=HN8UiaUAAAAJ")[Prof. Zhijun Li] 李治军, and backed by #link("https://en.nice.org.cn/")[ National Innovation Center par Excellence]  \

- Architected media I/O runtime for a Humanoid Robots OS (InsightOS), currently supporting egocentric data collection use cases from multi-view camera/depth camera sources.
  - Resolved 3 bottlenecks: unpredictable device discovery, hardware topology changes across runs, and time sync between views. Eliminated the need for C++ code recompilation between scenarios. Allowed for media stream reuse and one-click initialization.
  - Full-stack project on Linux, featuring a background daemon, efficient memfd-based IPC, a ROS2 bridge, and a C++ SDK for intent-based, cross-media routing. It decouples physical device access (PipeWire, V4L2, and vendor SDKs) from application logic, which consumes `insightos://` URIs instead.
  - Engineered CLI and REST interfaces, with agent skills, to support AI-driven app development, telemetry, and automated learning from error. Enabled >95% of multi-device capturing/processing apps to be built and verified within 15 minutes.
- Developed an end effector control runtime to support dexterous hand manipulation via DDS topic publishing and subscription, currently undergoing experimental deployment on a proprietary robot for live exhibition demos.

*Industrial Digitalization Engineer* \@ #link("http://www.chinasht.com.cn/")[北京中科圣泰环境科技有限公司]  #h(1fr) Jul 2025 -- Sep 2025\ 
Established by Ansteel and Institute of Process Engineering, Chinese Academy of Sciences\

- Designed a computer vision proof-of-concept for industrial wastewater coagulation dose adjustment, framing the task as a 5-class classification problem (-20% to +20%) using expert-labeled on-site video data from wastewater plants in Ansteel Headquarters.
- Built a feature extraction pipeline combining binary masking (adaptive Gaussian thresholding), PCA-selected morphological features (e.g., equivalent diameter, fractal dimension, area ratio), and CNN-derived deep features to overcome uneven underwater illumination, blurs and background noise.
- Trained and evaluated XGBoost and LightGBM classifiers, achieving ~89% offline accuracy with XGBoost using time-series splits to prevent data leakage caused by video frame autocorrelation.
- Planned follow-up work incorporating SCADA data (turbidity, pH) for regression modeling, accounting for 2-4h system latency before dose adjustments take effect, and proposing offline/delayed reinforcement learning for learning policies from pre-collected delay-free data.
 
*(Internship) Scientist* \@ #link("https://www.a-star.edu.sg/simtech")[ SIMTech], A*STAR Singapore #h(1fr) Sep 2024 -- Jan 2025\ Dynamic Decarbonisation Analytics, advised by #link("https://scholar.google.com/citations?user=OxFSkOcAAAAJ")[Dr. Aniq Ahsan] and #link("https://orcid.org/0000-0003-4891-5229")[Dr. Aloisius Rabata Purnama]

- Worked on the analytics backend behind #link("https://mitigationatlas.org/")[Global Mitigation Potential Atlas], a climate change mitigation platform developed with public-sector partners from Singapore, the Netherlands, and UN institutions.
- Translated ASEAN energy-system case studies (generation, storage, trade costs) into convex-optimization-ready JSON format for interactive analysis. Covered autarky vs. collaboration and varied carbon tax scenarios based on prior OSeMOSYS and TIMES studies.
- Validated optimization engine and data pipelines behavior by ensuring converted case studies produced results consistent with prior versions solver runs.
- Prototyped a GenAI workflow to automate case study json conversion, cutting manual math-heavy work. Reached Pass\@1 > 85% with ChatGPT o1 by formalizing json schema and using it as a prompt constraint.
- Aided in conceptualizing #link("https://www.moya-analytics.com/news/cop30-cascade")[MOYA Cascade], now a launched company/supply-chain level product, featuring emissions-data collection, mitigation planning and ESG reporting without exposing sensitive supplier data.

== Technical Skills
#chiline()
Programming Languages: C++, Python, C\#, Matlab \

Agentic AI & LLM Workflows:
- Coding Agents: Heavy user of GitHub Copilot/SDK and Codex cli; Actively develop agent skills to automate my daily jobs, e.g. tailored #link("https://github.com/obra/superpowers")[superpowers] for better subagent workflow. 
- Using #link("https://www.npmjs.com/package/ex-brain")[ex-brain] as vector-DB-driven personal knowledge base (external brain). Improved its data collection to support rss, website, WeChat articles and media source. Also equip it with LLM-driven conflict markup and reverse sync to ensure knowledge consistency (user is always in the loop for such scenarios).
- Agentic Design Patterns: Have knowledge about Agent Harness and single/multi-agent architectures including ReAct, Ralph Loop, Agent teams/subagent.
- Agent Communication: Have knowledge about A2A/MPP/x402 protocol. Active user of decentralized Agent Network Protocol (ANP) with a #link("zyx.awiki.ai")[zyx.awiki.ai] handle for E2EE agent messaging.
- Exploring: Multi-agent collaboration, decentralized agent networks, layered memory and their retrieval.
Open source contributor to #link("https://github.com/camel-ai/camel")[CAMEL] #link("https://github.com/camel-ai/camel/pull/3758")[(pr\#3758)], #link("https://github.com/labring/FastGPT")[FastGPT] #link("https://github.com/labring/FastGPT/pull/6348")[(pr\#6348)], both working on vector database OceanBase, and
#link("https://github.com/datawhalechina/llm-cookbook")[LLM-Cookbook] (see below).\

Certificates: 
- NVIDIA Certified Professional: Gen AI LLMs (2026)
- Oracle Cloud Infrastructure 2025 Certified DevOps Professional
- Oracle Cloud Infrastructure 2025 Certified Data Science Professional
- Oracle Cloud Infrastructure 2025 Certified Generative AI Professional
- Microsoft Certified: Power BI Data Analyst Associate (2025)
- Microsoft Certified: Azure Data Scientist Associate (2025)
- AWS Certified Machine Learning Engineer – Associate (2024)

== Education Background
#chiline()

*Institute of Systems Science, National University of Singapore* #h(1fr) In person: Jun 2024 -- Mar 2025\
Graduate Diploma in Systems Analysis | GPA: 4.61/ 5.0 #h(1fr) Online: Jun 2023 -- Jun 2024  \
- Coursework: Business requirement analysis, SDLC, Coding with C\# and Java for web and mobile apps.\ 
- Shared with the incoming cohort of 40+ students on modern programming, teamwork and keeping pace.\ 
*School of Electronics and Information Engineering, Harbin Institute of Technology* \
B.Eng. in #link("https://tce.hit.edu.cn/")[Intelligent Test & 
Control Engineering]  （哈工大电信学院智能测控工程） #h(1fr) Sep 2020 -- Jun 2024\ Average Grade: 86.95/ 100 (GPA: 3.38/ 4.0)\ 
- University-wide awards: \
  Recipient of People's Scholarship for 5 semesters,\
  Outstanding Member （优秀团员）(top 3%),\
  Outstanding Individual in Social Practices (top 5%),\
  Star Reader Award (top 10 per year)

== Project Experience
#chiline()

*Deep Reinforcement Learning-Based Path Planning * _Capstone project, HIT_ #h(1fr) Sep 2023 -- Jun 2024 \
- Enhanced a Deep Q-Network (DQN) by introducing delays to observation updates for model-free dynamic path planning, featuring real-time obstacle avoidance. 
- Engineered a goal-directed reward mechanism with heuristics. Evaluated the agent across grid maps with sparse/dense/zigzag-distributed obstacles on Gym (simulated environment).
- Achieved \~12% faster convergence and a 5.9% higher success rate compared to baseline DQN models like Rainbow and D3QN. 
- Also benchmarked the RL policy against traditional dynamic (DWA) and real-time sampling-based (RT-RRT\*) planners, achieving computational cost and path efficiency.

*iFlytek SparkDesk LLM Eval: Performance & Security in KBQA*  #h(1fr)Oct 2023 -- Nov 2023 
- Crafted a domain-specific agricultural knowledge base to augment the SparkDesk LLM  using RAG.
- Strategized team-based adversarial attack and defense, supervised by Prof. #link("https://scholar.google.com/citations?user=AJKK2ikAAAAJ")[Jie Liu]刘劼. Formulated 100+ closed- and open-ended questions mixed with 10+ prompt injection and jailbreak attacks. Assessed model accuracy and analyzed vulnerabilities revealed. #link("https://github.com/YixinZ-NUS/SparkDesk-LLM-KBQA-Assessment")[_Link to report_] (in Chinese)

*#link("https://github.com/datawhalechina/llm-cookbook")[LLM-Cookbook]* _Core Contributor, 24k+ stars_  #h(1fr) Jun 2023 -- Aug 2023 \
- Proofread the Chinese translation of #link("https://www.deeplearning.ai/short-courses/chatgpt-prompt-engineering-for-developers/")[_ChatGPT Prompt Engineering for Developers_], the pioneer and most influential Chinese tutorial at that time. 
- Unified terminology, formatting, and API use across the series after team discussion to ensure coherence.
- Validated the reproducibility of localized prompts and engineered supplementary experiments and interactive demo for the "Chatbot" chapter.
  
*Video Text Extraction System based on CNN and Attention* #h(1fr) Sep 2021 -- Nov 2022 \ 
_Team member_ #h(1fr) _1st prize winner and selected national-level, Innovation and Entrepreneurship Programme, HIT_ \
- Architected a video text deblurring and recognition pipeline in 4 stages: text detection, frame tracking, multi-frame deblurring, and final text recognition.
- Engineered the deblurring module drawing inspiration from #link("https://github.com/XPixelGroup/BasicSR/")[BasicSR], utilizing adjacent frame temporal information and attention mechanisms to align and restore highly blurred text instances.
- Designed a feature-level fusion approach by eliminating image reconstruction in pipeline to prevent the loss of  stroke details; Proved that directly passing aligned latent feature maps into the text recognition network improved F1 scores by 0.23% over contemporary #link("https://github.com/PaddlePaddle/PaddleOCR/blob/release/2.5/doc/doc_en/algorithm_rec_svtr_en.md")[SVTR-Tiny] algorithm. 
- Optimized the system for lightweight, real-world deployment on old Android devices, for scenarios like capturing fast-moving license plates and street views, plus extracting on-screen subtitles from TikTok shorts using repurposed old Android devices.
- Coordinated meetings and executed project management with Gantt chart, ensuring 90% adherence to planned roadmap.

== Social Practice and Volunteering<c>
#chiline()
- *Beach Cleanup with SG Beach Warriors *  #h(1fr) Jun 2024 -- Jan 2025 \
  Local Non-Profit Organization in Singapore, #link("https://www.youtube.com/watch?v=5RBdIZLfGNs")[spotlighted] by Lianhe Zaobao \ 
  - Collaborated in coastal conservation efforts across 2 major shorelines (North and East beach), jointly cleaned over 5 tons of marine trash at North Coast as a team of #link("https://www.instagram.com/sgbeachwarriors/p/C8jjgp-y6Zx/")[28] and #link("https://www.instagram.com/sgbeachwarriors/p/C-O_CNtSlEx/")[63].
  
- *"Exploring the Pillars of a Great Power"* _Team leader_#h(1fr) Jun 2022 -- Sep 2022 \
  2nd prize winner and selected key incubation team, HIT
  - Conducted field research at Space Museum, World 5G Convention 2022 in a group of 9, and organized individual research at local industrial enterprises and regional museums in team members' hometown.
  - Compiled an report on the regional equipment manufacturing sector based on compiled data and interviews. 
  
- Contributed to official bilibili channel of #link("https://www.youtube.com/@veritasium")[_Veritasium_], which makes STEM concepts accessible to the public. Translation work include #link("https://www.bilibili.com/video/BV1vz4y1H7eb/")[video].

- Volunteered for for major institutional events in HIT, including the university graduation ceremony and milestone decennial alumni reunions.\