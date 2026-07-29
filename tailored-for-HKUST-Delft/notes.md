https://amc.hkust.edu.hk/mphil-phd-program-application-admission-requirement

还需要走online application 吗

The Academy of Interdisciplinary Studies (AIS) (https://ais.hkust.edu.hk), the fifth School at HKUST, is a hub for driving new pedagogy and interdisciplinary research particularly in emerging areas with flexibility and agility. AIS currently houses five academically significant and socially impactful divisions, namely the Division of Environment and Sustainability, the Division of Public Policy, the Division of Emerging Interdisciplinary Areas, the Division of Integrative Systems & Design, and the newly established Division of Arts and Machine Creativity. These divisions offer over 10 undergraduate and postgraduate programs, all of which are highly interdisciplinary and relevant to our modern world.

Applicants are required to develop a research plan in the form of a written proposal. Prior to submitting the application, applicants are encouraged to form a research team consisting of at least two faculty members from diverse academic backgrounds, with one member from the Division of Arts and Machine Creativity serving as the prime supervisor. Such an arrangement serves the purpose of converging arts and machine creativity research.

Applicants are expected to review the research interests of prospective supervisors and PhD recruitment advertisements. Additionally, applicants are expected to demonstrate their capability and track record in the proposed research plan, whether it focuses on scientific, managerial, or critical studies aspects of arts and machine creativity. Relevant information regarding faculty members, ongoing research projects, and research student recruitment advertisements should be available on the division's website. 

需要以下这样吗
Title & Abstract: A clear, working title and a 150–250 word summary of the project.

Introduction & Motivation: The context of the problem bridging art, design, and machine creativity or robotics.

Research Questions: 2 to 3 specific, measurable questions you intend to answer.

Proposed Methodology: This is critical in HCI and Robotics. Detail whether you will be building robotic hardware, designing interactive systems, training machine learning models, conducting user-centric studies, or evaluating human-robot interaction metrics.

Alignment & Supervision: Explicitly state why the TU Delft and HKUST partnership is necessary for this work. Name the specific labs or faculty members at both institutions whose research interests match your topic.

Timeline: A rough milestone breakdown for the duration of the PhD program.

拿的推介信是这个吗 需要导师确认+改吗
需要单独发邮件问吗
They should also make initial contacts with potential supervisor(s) and identify prime and co-supervisors when applicable.

Use which email?

选定一个research proposal

肯定要有review吧

现有的数据环路 以及通过视频/3d 来生成场景 摆脱现有的egocentric采集流程（是怎样的？）
“仍然不是manifold的网格”

TriSplat: Simulation-Ready Feed-Forward 3D Scene Reconstruction

前馈式 3D 重建在新视角合成上已经做得很成熟，但一旦接入机器人、AR/VR、数字孪生的工程管线，立刻撞上同一道坎：物理引擎只认mesh，而高斯椭球、Pointmap必须经 TSDF 或 Poisson 转 mesh，慢且会丢薄结构，"前馈式" 的承诺在最后时刻破功。

与以往沿用 Gaussian 表征再事后提 mesh 的思路不同，我们认为既然下游要的就是表面三角形，那渲染原语本身就该是三角形。我们提出 TriSplat，把场景原生表示为有向三角形原语，从稀疏无位姿图像出发，单次前向 0.57 秒直接输出可被 Unity、Isaac Sim 直接吃下的三角网格，无需 TSDF、无需 Poisson、无需 per-scene 优化。DL3DV 上 F1 接近翻倍，端到端最高 249 倍加速。

项目源代码和模型权重已经全部开源，项目主页提供可交互 demo，可以在TriSplat重建出的场景上进行仿真交互，欢迎大家在 HuggingFace 上 upvote 支持，点点Github star！

作者：Weijie Wang, Zimu Li, Jinchuan Shi, Zeyu Zhang, Botao Ye, Marc Pollefeys, Donny Y. Chen, Bohan Zhuang

单位：Zhejiang University, ETH Zurich, ETH AI Center, Microsoft, Monash University

📄 Paper: https://huggingface.co/papers/2605.26115
💻 Github: https://github.com/ziplab/TriSplat
🌐 Project Page（含可交互 demo）: https://lhmd.top/trisplat
 我们的新工作，李飞飞World Lab一直致力于做Gaussian接入渲染、仿真引擎，我们希望探索一下在Mesh的表征下前馈网络的潜力
