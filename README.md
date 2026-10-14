# yixin-zh.github.io

A deliberately plain online résumé inspired by the public SilverBullet documentation: centered mono-spaced content, a quiet grey top bar, blue links, restrained borders, and document-like sections.

The previous executable-trace presentation has been retired from the deployed site. The line-number motif remains, but each numbered line is now a normal static résumé section rather than a Python execution step.

## Structure

```text
site/
├── index.html
├── src/
│   ├── App.tsx       # résumé content and section order
│   ├── index.css     # SilverBullet-inspired visual system
│   └── main.tsx
└── vite.config.ts

.github/workflows/deploy.yml  # builds and publishes to GitHub Pages
```

The older `tracer/`, `sections/`, `build.py`, and related files remain in the repository as historical scaffold material, but they are not used by the current deployment workflow.

## Local preview

```bash
npm --prefix site ci
npm --prefix site run dev
```

Then open <http://localhost:5173/>.

## Production build

```bash
npm --prefix site run build
```

Vite writes the result to `docs/`. GitHub Actions publishes that directory on every push to `main`.

## Editing the résumé

Edit `site/src/App.tsx`. The section list at the top controls the numbered navigation, and each `ResumeSection` keeps the same line-number + one-section-per-line visual structure.

Edit `site/src/index.css` for typography and layout. The current palette follows SilverBullet's default light theme closely: white document background, `#eee` top bar, `#20252d` text, `#0330cb` links, subtle grey rules, and a mono-spaced editor-like type stack.
