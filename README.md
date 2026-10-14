# yixin-zh.github.io

A static online résumé styled after the public SilverBullet documentation: mono-spaced typography, quiet grey chrome, blue links, a compact Navigate panel, restrained borders, and an editor-width reading column.

## Structure

```text
site/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── index.css
    └── main.tsx

.github/workflows/deploy.yml
```

## Local preview

```bash
npm --prefix site install
npm --prefix site run dev
```

Then open <http://localhost:5173/>.

## Production build

```bash
npm --prefix site run build
```

Vite writes the static site to `docs/`. GitHub Actions publishes that directory on pushes to `main`.

## Editing

Résumé content and section order live in `site/src/App.tsx`. Styling lives in `site/src/index.css`.
