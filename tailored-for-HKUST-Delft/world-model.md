What "egocentric data collection" means in robotics context? Is the common industry practices to use 3/4/6 cameras at different places of a robot, e.g. its arms, hands and body a kind of way to achieve this ? See practices like https://news.qq.com/rain/a/20260520A03MUF00 . And project https://github.com/PhysicalAI-AIM/Robot_synthetic_data_generation_workshop - is it trying to create the scene, use its mesh (or Gaussian representation?)  and create the video all in simulation?

I’ll ground this in the linked article and repo, then separate three ideas that often get conflated: egocentric sensing, multi-view robot sensing, and synthetic data generation.

One useful distinction: “egocentric” does not mean “many cameras.” It means the cameras/sensors are attached to, and move with, the acting body; multiple cameras are one practical way to cover the robot’s own action space.

Thought for 1m 4s

In robotics, “egocentric data collection” means collecting data from the point of view of the acting agent—the human or robot doing the task. For a robot, that usually means cameras and sensors mounted on the robot itself: head/body cameras, wrist cameras, gripper cameras, tactile sensors, joint states, actions, sometimes force/torque. The opposite is exocentric or third-person data: fixed cameras in the room looking at the robot from outside.

So yes: using 3/4/6 cameras on a robot’s arms, hands, head/body is a form of egocentric or robot-centric multi-view data collection, provided those cameras move with the robot. A wrist camera is a classic “eye-in-hand” egocentric view; a head/body camera gives global context; gripper/finger cameras capture contact-level detail. But “many cameras” is not what makes it egocentric—the key is that the viewpoint is attached to the actor. Fixed overhead/side cameras in a data lab are useful, but they are exocentric.

The Tencent article is describing the broader “robot data collection center” model: build real or mock 1:1 kitchens/factories, have robots practice tasks like picking cups or tightening screws, and record the process as training data. The article also criticizes the business loop and data quality, noting claims that some large-scale centers may spend 70–80% of construction cost on robot hardware and that poorly managed data can be unusable. That kind of center may collect egocentric data if it records the robot’s onboard cameras and states; it may also collect exocentric data from room cameras. Good robot-learning datasets usually need both, plus calibration, timestamps, actions, robot state, task labels, and quality filtering.

On the GitHub project: yes, your understanding is mostly right, with one important correction about Gaussian splats. The repo describes an end-to-end workshop pipeline: synthetic data generation → VLA training → simulation evaluation, using a Franka 7-DOF robot in a kitchen GLB scene, with overhead plus wrist cameras, generating 100 episodes, then fine-tuning SmolVLA and evaluating in a Genesis kitchen simulation.

It is not primarily “creating the scene from scratch” inside the script. It downloads/uses a prebuilt Rustic Kitchen asset from World Labs Marble, including an HQ mesh GLB for visual rendering, a collider GLB for collision, and a Gaussian Splat PLY for future use. The project’s own download script says Genesis currently only renders meshes/GLB, while the Gaussian Splat PLY is downloaded for future GS rendering or standalone visualization.

So the practical pipeline is:

World/scene asset: rustic kitchen GLB mesh + collider
Robot/task: Franka Panda picking a red cube
Sensors: simulated overhead camera + wrist/eye-in-hand camera
Data output: LeRobot-style dataset with RGB video/images, robot state, and actions
Training: SmolVLA fine-tuning
Evaluation: closed-loop simulation, success rate, and recorded video

The project’s “Path B” explicitly runs all three steps live on RDNA hardware: download kitchen assets, generate 100 episodes in the kitchen scene, train SmolVLA, then evaluate with --camera-layout up_wrist and video recording.

Bottom line: multi-camera robot rigs are a standard way to collect egocentric/embodied data, especially for manipulation. The GitHub repo is a small synthetic version of that idea: instead of collecting real robot camera streams in a physical data center, it renders robot-centric camera streams in simulation, trains a VLA policy, and evaluates it—all using mesh-based simulation today, not Gaussian-splat-based rendering.