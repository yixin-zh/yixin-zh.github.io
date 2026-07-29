Portfolio Development Handoff & Strategy Spec (v6.0)

Project: Personal Engineering & Academic Portfolio
Target Audience: HR Recruiters (scanning for keywords/breadth) & Academic/PhD Reviewers (deep-diving into methodology/depth).
Core Strategy: The "T-Shaped" Profile.

0. The "Detailedness" Scale (Content Density Key)

To guide future iterations, all content blocks are assigned a detailedness level:

[Detailedness: 1] The Scan (HR): High-level bullet points, highlight badges, tech stack tags, and 1-2 sentence summaries.

[Detailedness: 2] The Brief (Manager): Paragraph descriptions, core challenges solved, system architecture diagram, and quantitative results.

[Detailedness: 3] The Deep Dive (Tech Lead / PhD): Full "research poster" treatment. Methodology, math/formulas, interactive telemetry, video facades, and extensive implementation details.

1. Global Design System

Theme: "Clean Console" / Academic Minimalist.

Typography: Headings: Serif/Sans-Serif (Merriweather/Inter) | Body: Sans-Serif (DM Sans) | Code: Monospace (Fira Code).

Color Palette: Crisp white/off-white backgrounds, deep slate text, single primary accent color (e.g., subdued blue) for interactive elements. Community timeline nodes use a secondary, softer accent color (e.g., muted green or teal).

2. Architecture: The "T-Shaped" Layout

Page 1: The Executive Summary (The horizontal bar of the "T")

Optimized for a 10-second HR scan. [Detailedness: 1]

Hero Section: Name, title, and a 2-sentence mission statement.

The "Trust Bar": Horizontal row of certification logos (NVIDIA, Oracle, Microsoft, AWS).

Agentic AI & LLM Skills Module: A dedicated, high-density keyword block.

Tags: ReAct, Ralph Loop, A2A/MPP/x402, ANP.

Highlight: Open-source contributions (CAMEL, FastGPT, OceanBase).

The Integrated Timeline: Clean, vertical chronological feed mixing professional, academic, and community impact.

Professional/Academic Nodes: InsightOS, Ansteel, SIMTech, NUS-ISS, HIT. Include "Highlight Badges" (e.g., >95% apps built in <15min).

[Community Project] Nodes: Visually distinct markers on the same timeline.

SG Beach Warriors: (Highlight: Co-led team of 63, cleared 5 tons of marine trash).

"Exploring the Pillars of a Great Power": (Highlight: Team leader, 2nd prize field research).

Veritasium Bilibili Translation: (Highlight: Making STEM accessible).

Project Teasers: Small grid of top projects linking to their Deep Dives.

Page 2: The Deep Dives (The vertical bar of the "T")

Dedicated pages or expansive inline-modals optimized for technical review. Priority: Industry > Academic (Exception: DQN).

1. Autonomous Cabinet Operation (InsightOS) - Flagship Demo [Detailedness: 3]

Focus: Kinematics, CV Integration & Real-world application.

Content: The Tencent COS video facade paired with the interactive Kinematic Telemetry Dashboard. Detail the YOLO11 segmentation to ROS TF tree pipeline, and the 6D pose estimation using SVD.

2. InsightOS Media I/O Runtime (Company R&D) [Detailedness: 3]

Focus: System Architecture & Latency.

Content: Explain the memfd IPC and ROS2 bridge. Detail how you decoupled sensors via insightos:// URIs and solved cross-view time sync.

3. DQN Path Planning (Academic Capstone) [Detailedness: 3]

Focus: Algorithmic Rigor (Aligns with career goals).

Content: Define State Space, Action Space, and Reward Function using KaTeX math formatting. Show the chart proving ~12% faster convergence vs. Rainbow/D3QN baselines.

4. Ansteel Wastewater CV PoC (Company Venture) [Detailedness: 2]

Focus: Applied Machine Learning.

Content: Morphological + CNN features into XGBoost/LightGBM. Explain the time-series splits used to prevent frame-autocorrelation leakage.

5. Video Text Extraction System (National-level Project) [Detailedness: 2]

Focus: Edge Deployment & Computer Vision.

Content: Detail the 4-stage pipeline (detection, tracking, deblurring, recognition) and the optimization for lightweight Android deployment.

6. LLM Evaluation & Prototyping (SIMTech & iFlytek) [Detailedness: 1.5]

Focus: Applied GenAI & Security.

Content: Briefly cover the ASEAN energy JSON conversion (Pass@1 > 85%) and the RAG/adversarial testing on SparkDesk (prompt-injection/jailbreaks).

Page 3: Explorations & Open Problems

A dedicated space for forward-looking engineering narrative and intellectual curiosity.

"Questions I'm Chasing" / "The Road Ahead" [Detailedness: 2]

Concept: A clean, text-driven section outlining open-ended engineering problems you are currently researching or want to tackle in a PhD/R&D role.

Examples: Sim-to-Real Gaps, Sensor Synchronization, LLMs in Robotics (Boundary between deterministic kinematics and non-deterministic planning).

3. Video Delivery Strategy (Finalized)

Method: Tencent Cloud Object Storage (COS) + "Facade" Pattern.

Implementation:

Upload cabinet-operation.mp4 to a bucket.

CRITICAL: Set file permissions to 公网读 (Public Read).

Display a static thumbnail with a CSS "Play" button.

Use JavaScript to dynamically inject <video src="tencent-cos-url" controls autoplay> only onClick.

Cost Note: Acknowledged that outbound traffic (外网下行流量) incurs pay-as-you-go costs.

Benefit: Zero initial page weight; bypasses GFW/YouTube blocking; completely unbranded UI.

4. Content Mapping & Next Steps Checklist

[ ] Draft "Explorations & Open Problems": Write 2-3 short, pragmatic paragraphs outlining your current technical obsessions.

[ ] Expand InsightOS Details: Gather high-level architecture notes for the Media I/O runtime to populate the [Detailedness: 3] section.

[ ] Design Community Timeline Nodes: Create a CSS class to visually differentiate community/volunteer nodes from work/academic nodes on the main timeline (e.g., a different colored dot or a small "Community" badge).