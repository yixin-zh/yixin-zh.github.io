import type { ReactNode } from "react";

const sections = [
  ["01", "Profile", "profile"],
  ["02", "Current work", "current-work"],
  ["03", "DQN planner", "dqn-planner"],
  ["04", "Research questions", "research-questions"],
  ["05", "Industrial CV", "industrial-cv"],
  ["06", "Climate data", "climate-data"],
  ["07", "Video OCR", "video-ocr"],
  ["08", "Public work", "public-work"],
  ["09", "Credentials", "credentials"],
] as const;

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

function ResumeSection({
  number,
  label,
  id,
  children,
}: {
  number: string;
  label: string;
  id: string;
  children: ReactNode;
}) {
  return (
    <section className="resume-section" id={id} aria-labelledby={`${id}-heading`}>
      <a className="line-number" href={`#${id}`} aria-label={`Section ${number}: ${label}`}>
        {number}
      </a>
      <div className="section-content">
        <p className="section-label">{label}</p>
        {children}
      </div>
    </section>
  );
}

function Navigator() {
  return (
    <aside className="navigator" aria-label="Resume navigation">
      <div className="navigator-header">
        <div className="navigator-title">Navigate</div>
      </div>
      <nav className="navigator-body">
        <p className="navigator-group">Resume</p>
        {sections.map(([number, label, id]) => (
          <a className="navigator-row" key={id} href={`#${id}`}>
            <span className="navigator-number">{number}</span>
            <span>{label}</span>
          </a>
        ))}
        <p className="navigator-group navigator-group-spaced">Elsewhere</p>
        <ExternalLink href="https://yixin.blog/">Blog</ExternalLink>
        <ExternalLink href="https://github.com/yixin-zh">GitHub</ExternalLink>
        <ExternalLink href="https://www.linkedin.com/in/yixin-zh">LinkedIn</ExternalLink>
      </nav>
      <div className="navigator-help">Public, read-only résumé</div>
    </aside>
  );
}

export default function App() {
  return (
    <div className="site-shell">
      <header className="top-bar">
        <div className="top-left">
          <a className="home-button" href="#profile" aria-label="Resume home">⌂</a>
        </div>
        <div className="top-main">
          <div className="top-main-inner">
            <a className="page-name" href="#profile">Yixin Zhang / Resume</a>
          </div>
        </div>
        <nav className="top-actions" aria-label="Primary links">
          <ExternalLink href="https://github.com/yixin-zh">GitHub</ExternalLink>
          <ExternalLink href="https://yixin.blog/">Blog</ExternalLink>
          <a href="mailto:hi.yixinz@gmail.com">Email</a>
        </nav>
      </header>

      <div className="workspace">
        <Navigator />

        <main className="editor-pane">
          <div className="editor-page">
            <ResumeSection number="01" label="Profile" id="profile">
              <h1 id="profile-heading">Yixin Zhang</h1>
              <p className="lede">R&amp;D engineer building dependable sensing and control infrastructure.</p>
              <p className="status-line">I am actively seeking PhD opportunities in robot learning.</p>

              <p className="inline-links">
                <a href="mailto:hi.yixinz@gmail.com">hi.yixinz@gmail.com</a>
                <span>·</span>
                <ExternalLink href="https://github.com/yixin-zh">GitHub</ExternalLink>
                <span>·</span>
                <ExternalLink href="https://www.linkedin.com/in/yixin-zh">LinkedIn</ExternalLink>
                <span>·</span>
                <ExternalLink href="https://yixin.blog/">evidence portfolio</ExternalLink>
              </p>

              <p className="admonition"><strong>Note</strong> This is the compact résumé. Project evidence, longer scope notes, and supporting material live on <ExternalLink href="https://yixin.blog/">yixin.blog</ExternalLink>.</p>

              <h2>Direction</h2>
              <p>
                Be challenged in robot learning—and shorten the loop from physical failure to a better policy.
                I am most interested in work where deployment evidence, open evaluation, and research depth can
                change each other rather than staying on separate tracks.
              </p>

              <h2>Experience &amp; education</h2>
              <div className="timeline">
                <div className="timeline-item">
                  <span className="timeline-date">Sep 2025—present</span>
                  <div><strong>R&amp;D Engineer — InsightOS</strong><br /><span className="muted">Robot media I/O, sensor synchronization, and cabinet-operation tooling.</span></div>
                </div>
                <div className="timeline-item">
                  <span className="timeline-date">Jul—Sep 2025</span>
                  <div><strong>Industrial Digitalization Engineer — Beijing Zhongke Shengtai</strong><br /><span className="muted">Industrial-wastewater vision PoCs and a floc-analysis handoff.</span></div>
                </div>
                <div className="timeline-item">
                  <span className="timeline-date">Sep 2024—Jan 2025</span>
                  <div><strong>Scientist Intern — SIMTech, A*STAR</strong><br /><span className="muted">ASEAN energy-system studies converted into model-ready data.</span></div>
                </div>
                <div className="timeline-item">
                  <span className="timeline-date">2023—2025</span>
                  <div><strong>NUS-ISS — Graduate Diploma in Systems Analysis</strong><br /><span className="muted">GPA 4.61 / 5.0.</span></div>
                </div>
                <div className="timeline-item">
                  <span className="timeline-date">2020—2024</span>
                  <div><strong>Harbin Institute of Technology — B.Eng., Intelligent Test &amp; Control Engineering</strong><br /><span className="muted">Electrical Engineering · 86.95 / 100 · People’s Scholarship ×5.</span></div>
                </div>
              </div>
            </ResumeSection>

            <ResumeSection number="02" label="Current work" id="current-work">
              <h1 id="current-work-heading">Closing the cabinet-operation loop</h1>
              <p className="lede-small">A reusable robot media runtime underneath perception, pose estimation, and contact.</p>
              <p>
                Cameras and depth sensors move across devices, while open-loop motion becomes brittle when target
                and robot frames drift. My current work keeps the sensing path stable and exposes the same data to
                perception and control components.
              </p>
              <ul>
                <li>Media I/O daemon, memfd IPC, ROS2 bridge, C++ SDK, and <code>insightos://</code> routing.</li>
                <li>Device discovery, topology-drift recovery, and cross-view time synchronization.</li>
                <li>YOLO11 segmentation, RGB-D pose estimation, ROS TF transforms, and visual/tactile correction.</li>
              </ul>
              <p className="stack-line"><code>C++</code> <code>Linux</code> <code>ROS2</code> <code>DDS</code> <code>RGB-D</code> <code>shared memory</code> <code>REST/CLI</code></p>
              <p><ExternalLink href="https://www.insightos.cn/">InsightOS</ExternalLink> · <ExternalLink href="https://yixin.blog/">full evidence and scope notes</ExternalLink></p>
            </ResumeSection>

            <ResumeSection number="03" label="DQN planner" id="dqn-planner">
              <h1 id="dqn-planner-heading">Path planning with delayed observations</h1>
              <p>
                My HIT capstone used discrete DQN actions in a dynamic simulator with randomized observation delay,
                replay memory, main/target networks, and reward terms for progress, collision avoidance, and convergence.
              </p>
              <pre className="plain-code">delayed state s[t-d] → Q(s,a) → argmax action → environment → replay memory</pre>
              <table>
                <thead><tr><th>Method</th><th>Reported success</th><th>Mean path length</th></tr></thead>
                <tbody>
                  <tr><td>Proposed</td><td>98.1%</td><td>29.113</td></tr>
                  <tr><td>Traditional DQN</td><td>92.6%</td><td>30.852</td></tr>
                  <tr><td>Traditional Q-learning</td><td>93.1%</td><td>32.224</td></tr>
                </tbody>
              </table>
              <p className="note">Reported means are from 15 repetitions in the preserved capstone material; raw logs, seeds, confidence intervals, and real-robot evaluation are not available.</p>
            </ResumeSection>

            <ResumeSection number="04" label="Research questions" id="research-questions">
              <h1 id="research-questions-heading">What is worth testing next?</h1>
              <p>Systems engineering now; robot learning next. I try to keep the questions close to physical evidence.</p>
              <ol>
                <li>How can a robot verify that a physical task is actually complete?</li>
                <li>How should perception, calibration, and control error be represented and recovered?</li>
                <li>Which moments—contact, failure, intervention—are worth retaining or sharing across robots?</li>
                <li>Which assumptions in LLM-driven robotics can be formalized, checked, and falsified?</li>
              </ol>
              <p className="muted">Also following inference-time learning, world models, action-conditioned models, long-horizon memory, and knowledge workflows that surface conflicts rather than flattening them.</p>
            </ResumeSection>

            <ResumeSection number="05" label="Industrial CV" id="industrial-cv">
              <h1 id="industrial-cv-heading">From floc video to a binary operator cue</h1>
              <p>
                For an industrial-wastewater PoC, I kept the source frame, binary mask, geometry features, and final
                cue inspectable rather than hiding them behind a single prediction.
              </p>
              <pre className="plain-code">grayscale → median blur → adaptive threshold → morphology → components → XGBoost</pre>
              <ul>
                <li><strong>2,270</strong> labeled images in the preserved account.</li>
                <li><strong>88.5%</strong> reported XGBoost test accuracy and <strong>87.9%</strong> weighted F1.</li>
                <li>Features covered component count, scale, compactness, and area fraction.</li>
              </ul>
              <p className="note">The evaluation used image labels replicated to individual flocs and a random split; it does not establish video/day/plant independence or temporal deployment performance.</p>
            </ResumeSection>

            <ResumeSection number="06" label="Climate data" id="climate-data">
              <h1 id="climate-data-heading">Turning case studies into model-ready data</h1>
              <p>
                At SIMTech, A*STAR, I translated ASEAN energy-system case studies into a consistent JSON contract for
                optimization workflows: prose, equations, assets, constraints, trade links, units, and CO₂ budgets.
              </p>
              <ul>
                <li>Built a schema-aware, LLM-assisted conversion workflow.</li>
                <li>Inspected optimization output against prior OSeMOSYS/TIMES cases.</li>
                <li>Contributed to early MOYA Cascade concepts within a broader team effort.</li>
              </ul>
              <p><ExternalLink href="https://mitigationatlas.org/">Global Mitigation Potential Atlas</ExternalLink></p>
              <p className="note">The scenario charts are modeled outputs used to inspect behavior, not observed forecasts; my documented role was data translation and workflow prototyping rather than ownership of the full Atlas model.</p>
            </ResumeSection>

            <ResumeSection number="07" label="Video OCR" id="video-ocr">
              <h1 id="video-ocr-heading">Recognizing text across blurred frames</h1>
              <p>
                In an HIT innovation project, the team retained high-quality matched crops, fused a reference with four
                support crops, and passed the aligned evidence to an SVTR-inspired recognizer with CTC prediction.
              </p>
              <ul>
                <li>Documented role: Transformer-inspired recognition and coupling recognition features to the upstream restoration network.</li>
                <li>Reported recognition accuracy: <strong>69.2%</strong> on Chinese Benchmark and <strong>68.5%</strong> on ICDAR 2019-LSVT.</li>
                <li>First prize at HIT; selected for national-level continuation.</li>
              </ul>
              <p className="note">The preserved record supports recognizer/feature coupling; it does not by itself support broader deployment claims.</p>
            </ResumeSection>

            <ResumeSection number="08" label="Public work" id="public-work">
              <h1 id="public-work-heading">Public code and model evaluation</h1>
              <div className="work-list">
                <article>
                  <p className="meta-line">Feb 2026 · camel-ai/camel</p>
                  <h2>Qdrant query filters</h2>
                  <p>Added distance metrics and filtering, with tests and examples around the new query behavior.</p>
                  <ExternalLink href="https://github.com/camel-ai/camel/pull/3758">merged PR #3758</ExternalLink>
                </article>
                <article>
                  <p className="meta-line">Jan 2026 · labring/FastGPT</p>
                  <h2>OceanBase HNSW quantization</h2>
                  <p>Added SQ/BQ vector-index quantization levels and corresponding distance constraints.</p>
                  <ExternalLink href="https://github.com/labring/FastGPT/pull/6348">merged PR #6348</ExternalLink>
                </article>
                <article>
                  <p className="meta-line">2023 · model evaluation</p>
                  <h2>Agricultural KBQA assessment</h2>
                  <p>RAG knowledge base, closed/open questions, prompt injection, and jailbreak tests; the résumé record reports 100+ questions and 10+ attacks.</p>
                  <ExternalLink href="https://github.com/yixin-zh/SparkDesk-LLM-KBQA-Assessment">open report</ExternalLink>
                </article>
                <article>
                  <p className="meta-line">2023 · datawhalechina/llm-cookbook</p>
                  <h2>Prompt-engineering coursework</h2>
                  <p>Proofreading, terminology/API alignment, prompt reproduction, and chatbot experiments.</p>
                  <ExternalLink href="https://github.com/datawhalechina/llm-cookbook">open repository</ExternalLink>
                </article>
              </div>
            </ResumeSection>

            <ResumeSection number="09" label="Credentials" id="credentials">
              <h1 id="credentials-heading">ML, cloud, and data credentials</h1>
              <p>Seven professional certifications and two NVIDIA DLI course certificates are listed in the current portfolio record.</p>
              <div className="credential-list">
                <div><strong>NVIDIA</strong><span>Certified Professional: Gen AI LLMs · Disaster Risk Monitoring Using Satellite Imagery · Introduction to Transformer-Based NLP</span></div>
                <div><strong>Oracle</strong><span>OCI 2025 DevOps Professional · Data Science Professional · Generative AI Professional</span></div>
                <div><strong>Microsoft</strong><span>Azure Data Scientist Associate · Power BI Data Analyst Associate</span></div>
                <div><strong>AWS</strong><span>Machine Learning Engineer — Associate</span></div>
              </div>
            </ResumeSection>

            <section className="in-this-section" aria-labelledby="in-this-section-heading">
              <h1 id="in-this-section-heading">In this résumé</h1>
              <ul>
                {sections.map(([number, label, id]) => (
                  <li key={id}><a href={`#${id}`}>{label}</a> <span className="muted">— section {number}</span></li>
                ))}
              </ul>
            </section>

            <footer className="footer">
              <span>Static GitHub Pages résumé · read-only</span>
              <a href="#profile">Back to top</a>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}
