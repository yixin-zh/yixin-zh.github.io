"""The only file you need to edit to make this portfolio yours.

Everything below is plain Python data: the section scripts in `sections/`
render it, and `build.py` compiles those scripts into the traces that the
website plays back line by line.

Replace the placeholder values with your own, drop images into `images/` and
videos into `media/`, then run `python3 build.py`.
"""

PROFILE = {
    "name": "Yixin Zhang",
    "title": "Machine Learning Systems Engineer",
    "location": "Shenzhen, China",
    "email": "hi.yixinz@gmail.com",
    "summary": (
        "I build the layer between research ideas and GPUs: training stacks that "
        "scale to hundreds of accelerators, inference engines that squeeze the last "
        "30% out of a kernel, and the tooling that keeps both honest."
    ),
    "focus": [
        "Distributed training (FSDP, tensor/pipeline parallel)",
        "Inference optimization (paged KV cache, CUDA graphs, quantization)",
        "Profiling and performance modeling",
    ],
}

LINKS = {
    "GitHub": "https://github.com/",
    "Google Scholar": "https://scholar.google.com/",
    "LinkedIn": "https://www.linkedin.com/",
    "Blog": "https://example.com/blog",
    "Resume (PDF)": "https://example.com/resume.pdf",
}

EDUCATION = [
    {
        "school": "Shanghai Jiao Tong University",
        "degree": "M.Eng. in Computer Science",
        "start": "2020-09",
        "end": "2023-03",
        "location": "Shanghai, China",
        "details": [
            "Thesis: memory-efficient fine-tuning for long-context transformers",
            "Advisor: Prof. Example Advisor",
            "GPA 3.8/4.0; graduate course assistant for *Distributed Systems*",
        ],
    },
    {
        "school": "Zhejiang University",
        "degree": "B.Eng. in Computer Science",
        "start": "2016-09",
        "end": "2020-06",
        "location": "Hangzhou, China",
        "details": [
            "ACM-ICPC Asia Regional silver medal (2019)",
            "Undergraduate research assistant, Parallel Processing Lab",
        ],
    },
]

EXPERIENCE = [
    {
        "company": "Nebula AI",
        "role": "Senior ML Systems Engineer",
        "start": "2024-02",
        "end": None,  # None means "present"
        "location": "Shenzhen, China",
        "highlights": [
            "Rebuilt the serving stack on a paged KV cache; 3.9x tokens/s/GPU and 42% lower p99 latency",
            "Led the 70B-parameter pretraining run on 256 GPUs, sustaining 47% MFU for 6 weeks",
            "Introduced deterministic replay debugging, cutting on-call triage time from hours to minutes",
        ],
        "stack": ["PyTorch", "CUDA", "Triton", "Kubernetes", "NCCL"],
    },
    {
        "company": "Orbit Labs",
        "role": "ML Infrastructure Engineer",
        "start": "2023-03",
        "end": "2024-01",
        "location": "Remote",
        "highlights": [
            "Built the multi-tenant fine-tuning platform used by 40+ internal teams",
            "Cut checkpoint stalls by 88% with asynchronous, sharded state persistence",
            "Shipped a GPU utilization dashboard that reclaimed ~300 idle GPU-days per quarter",
        ],
        "stack": ["Python", "Ray", "Go", "Prometheus"],
    },
    {
        "company": "Zhejiang University, Parallel Processing Lab",
        "role": "Research Assistant",
        "start": "2019-06",
        "end": "2020-06",
        "location": "Hangzhou, China",
        "highlights": [
            "Profiled and re-wrote the lab's graph sampling kernels (4.1x speedup)",
            "Co-authored a paper on bandwidth-aware operator fusion",
        ],
        "stack": ["C++", "OpenMP", "PyTorch"],
    },
]

PROJECTS = [
    {
        "name": "NanoLLM",
        "tagline": "A 1.3B-parameter model trained end to end, from raw bytes to chat, in 24 GPU-hours.",
        "image": "images/project-tokenizer.svg",
        "video": None,
        "year": 2025,
        "stack": ["PyTorch", "Triton", "FlashAttention", "W&B"],
        "highlights": [
            "Byte-level BPE tokenizer trained on 2.4 TB of filtered CommonCrawl (4.31 bytes/token)",
            "FSDP + activation checkpointing: 1.3B params at 52% MFU on 8xH100",
            "Full recipe published so the run is reproducible on a single rented node",
        ],
        "links": {
            "GitHub": "https://github.com/",
            "Write-up": "https://example.com/nanollm",
        },
    },
    {
        "name": "FlashServe",
        "tagline": "An inference engine that keeps the GPU busy: paged KV cache, CUDA graphs, speculative decoding.",
        "image": "images/project-inference.svg",
        "video": "media/demo-inference.mp4",
        "year": 2025,
        "stack": ["CUDA", "C++", "Python", "gRPC"],
        "highlights": [
            "Continuous batching with a paged KV cache: 3.9x throughput over the naive baseline",
            "Speculative decoding with a 70M draft model, 2.1x latency win at equal quality",
            "Ships with a roofline profiler that tells you why a kernel is slow",
        ],
        "links": {
            "GitHub": "https://github.com/",
            "Benchmarks": "https://example.com/flashserve-bench",
        },
    },
    {
        "name": "KernelBench",
        "tagline": "A benchmark that asks: can a model write a faster matrix multiply than a human?",
        "image": None,
        "video": None,
        "year": 2024,
        "stack": ["Python", "Triton", "Docker"],
        "highlights": [
            "250 kernel tasks with correctness and speed-of-light baselines",
            "Used by three labs to evaluate code-generation models",
        ],
        "links": {"GitHub": "https://github.com/"},
    },
]

PUBLICATIONS = [
    {
        "title": "Bandwidth-Aware Operator Fusion for Irregular Graph Workloads",
        "authors": "Y. Zhang, L. Chen, M. Okafor",
        "venue": "PPoPP",
        "year": 2022,
        "links": {
            "PDF": "https://example.com/paper.pdf",
            "arXiv": "https://arxiv.org/abs/2203.15556",
            "Code": "https://github.com/",
        },
    },
    {
        "title": "Memory-Efficient Fine-Tuning for Long-Context Transformers",
        "authors": "Y. Zhang, K. Watanabe",
        "venue": "MLSys",
        "year": 2024,
        "links": {
            "PDF": "https://example.com/paper2.pdf",
            "arXiv": "https://arxiv.org/abs/2402.16819",
        },
    },
    {
        "title": "Where Does the Time Go? A Roofline Study of LLM Serving",
        "authors": "Y. Zhang, R. Silva, L. Chen",
        "venue": "arXiv preprint",
        "year": 2025,
        "links": {"arXiv": "https://arxiv.org/abs/2501.12948"},
    },
]

TALKS = [
    "“Serving 70B models on a budget” — GPU Technology Night, Shenzhen, 2025",
    "“Profiling before optimizing” — PyCon China, 2024",
]

SKILLS = {
    "Systems": ["CUDA", "Triton", "C++", "NCCL", "Kubernetes"],
    "Machine Learning": ["PyTorch", "JAX", "Distributed training", "Quantization", "RLHF"],
    "Languages": ["Python", "C++", "Go", "TypeScript"],
    "Tooling": ["Docker", "Ray", "Prometheus", "Grafana", "GitHub Actions"],
}

SKILL_LEVELS = {
    "Distributed training": 92,
    "Kernel / CUDA": 78,
    "Inference serving": 90,
    "Model quality & eval": 74,
}
