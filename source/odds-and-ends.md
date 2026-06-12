== Ideas<c>
#chiline()
- Career and research interests
  - Robotics:
    1) Tried a white boxed way to let a single robot plan for its tasks
      - Challenges: 
        1) Robot's proprioception 
          - _How it knows its dof/eef - via its urdf and moveit planning model?_
          - _How robots follow a LLM/VLM policy and control its moves?_
            mpc？
          - pose space vs Cartesian space - _who does the underlying work?
            IK solver or the robot manufacturers' SDK? _
              - _ via ROS services?_
        2) How it knows the completion status of a task, or to get latest observation from the environment? e.g. A clicked button / A turned switch?
              - _Is tactile a must-have?_ < must use sensors?
              - _Is (perception of) depth info a must have?_ < must use depth sensor? x they sucks.
              < How to estimate the depth info?
              - tool call发现失败是因为空间满- check how much can be freed, and which part can be safely removed 1G; which needs user approval 500M - ask user -< user themselves do some cleaning and cleaned 16GB> - it perceives "freed 16 GiB". 
                There aren't valid monitoring of the environment.
              - _Does an RL agent needs an eye on the environment _
        3) Accumulated error - How to overcome the difficulities of sensor resolution / minor offset caused by motor accuracy ? How to auto recover from a wrong pose/position?
          - Are they efficient enough? Obviously not. _Only data of certain time (e.g. contact) is of use? or the trace of data?_
          - Do we must use VQA to solve this? This is even less efficient.
          - _Can kv cache be good for this use? Are there some kind of memory to be shared between < agents in a same body/ across robots?>_
          - _How error accumulates across a pipeline mathematically? _
        4) Generalizability - How to scale the data - single teleop/retargeting no longer works
          - Nvidia DreamDojo
          - data collection
          - the mindmap
        5) Long horizon - white box or black box? _Is black box/ LLM-driven approaches hard to trace such tasks because of context and compression?_
          - What would happen if compression happens at the policy rollout time?

      - Is more towards Prof. Sutton's idea to Agent and RL: to learn from inference time
      - What exactly is WM/JEPL/action-conditioned models/WAM?
      - Gray and pipelined, with layered LLM and report freq - 穆尧
    2) Engineering side
      Depth cam
        - It feels like LocalSend
          Discoverable, usable, create in-system links
        - quirks: 1) time sync between channels of a single device - needs work with model sdks 2) Framerate report  - Can a frame record its wall time clearly? 3) time sync between all sources of devices? Is this a requirement? 4) 内外参?
      Linux and IPC
        - socket, poll/epoll, ipc via ...< shm/ memfd ...>
        - data transfer: custom header for a memory section, 
        - 3rd party implementaion: iceoryx 1/2; spoke and hub; FastDDS
          How I outperform them
          serial/deserial: DDS, proto, _Some standard they are implementing?_
            Choose a way between a packaged or transparent format
        - REST/json vs proto/? vs proto/gRPC
      ROS
        Services -> Topics -> 电机控制 （力矩、位置、速度三者混合控制 / 阻抗/导纳 ）-> 总线与pwm
          We normally operate on topics
        Moveit , rviz, and its python/C++ _SDK?_
          _ Which layer is it at?_
        And graspit? _Which kind of move can be seen as grasp?_
      SDK design 
      AI Coding
    3) My thoughts
      RL - should be with minimum toolset and let it freely explore the worl
      Data wheel - Nvidia
      原子能力？ 小模型？

      串口/485 通信
    4) 架构对这种大型项目的影响
- Reading list
- My priorities and to-dos
  - cs336
  - 现代控制与mpc
  - 推理框架
  - 数学与形式化
  - b站收藏的
  - rl 
    - academic side
    - engineering side
      - reward design
  - llm conversation history and insights; llm workflow
    - for a docs-only task, a crapped environment (e.g. icloud-traced folder, docker) can cause 60 dollars just trying to making things runnable.
    - tricks to saving tokens
  - getting decentralized and give agents their identity
    - 银行 播客
    - A2P2协议 (京东) APOP协议（银联商务）
      - job opportunities here?
      - 小协议会被大厂干碎？
  - storytelling, and different ways of value preposition between multiple Chinese companies / the silicon valley (see podcasts)
  - toolkit for myself
  - what getting into depth means?
- Nice tutorial I've ever read
  - Datawhale ones 
- Podcasts that I learned a lot from
- Keep the trees in sight; not only walk on meadow
- My external knowledge base
  - how many cache needed
- Contrarian: one assumption to doubt
  _What are the assumptions in modern LLM driven robotics?_