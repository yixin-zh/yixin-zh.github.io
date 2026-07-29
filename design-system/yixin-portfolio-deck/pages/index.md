# Portfolio deck page override

This file overrides the generated `MASTER.md` for `index.html`.

## Direction

- Use an evidence-first editorial grid: Swiss structure, research-note clarity, and one restrained blue accent.
- Do not use the generated HUD / sci-fi recommendation. Its thin lines, glow effects, and decorative telemetry would undermine the requested pragmatic tone and have poor accessibility.
- Treat every slide as a compact technical case sheet: problem, implemented work, evidence, limits, and references.
- Use only visuals with traceable provenance. A missing headshot stays empty; do not synthesize a person or substitute an unrelated image.

## Palette

| Role | Value |
| --- | --- |
| Paper | `#F4F2EC` |
| Surface | `#FCFBF7` |
| Ink | `#171816` |
| Muted ink | `#5A5E58` |
| Rule | `#C9CCC5` |
| Primary | `#1746A2` |
| Primary tint | `#E8EEF9` |
| Verified | `#1F6B49` |
| Verified tint | `#E6F2EC` |
| Review | `#8B5A00` |
| Review tint | `#FFF1D6` |
| Boundary | `#8A3030` |
| Boundary tint | `#F8E7E4` |

Status is never conveyed by color alone; every status chip includes text.

## Typography

- Use local system stacks only for a fast, dependency-free GitHub Pages load.
- Display: `Iowan Old Style`, `Palatino Linotype`, `Book Antiqua`, `Georgia`, serif.
- Body: `Inter`, `SF Pro Text`, `Segoe UI`, `Helvetica Neue`, system-ui, sans-serif.
- Data labels: `SFMono-Regular`, `Cascadia Code`, `Roboto Mono`, `Menlo`, monospace.
- Minimum body size: `15px` on desktop and `14px` only for compact citations.

## Layout

- Eight full-viewport slides.
- Desktop: asymmetric 12-column grids with a persistent slim progress rail.
- Mobile: one column; each slide scrolls internally when needed.
- All project slides contain:
  1. a concrete problem statement;
  2. implemented work;
  3. an evidence or artifact panel;
  4. an explicit boundary or review note;
  5. source links.
- Cards use borders and spacing, not ornamental shadows. Border radius stays modest (`10-14px`).

## Interaction

- Left/right arrows, PageUp/PageDown, Home/End, visible previous/next buttons, and touch swipe.
- Do not hijack arrow keys while focus is inside links, buttons, or video controls.
- Keep the current slide in the URL hash for deep linking.
- Use one short opacity/translate transition (about `220ms`); disable it under `prefers-reduced-motion`.
- The cabinet video uses a click-to-load facade, `preload="none"`, native controls, and a direct fallback link.

## Quality gates

- 4.5:1 minimum text contrast.
- Visible `:focus-visible` treatment.
- 44px minimum touch targets.
- No horizontal overflow at 375, 768, 1024, or 1440px.
- No unsourced headshot or decorative stock photography.
- No result is presented as independently verified when only a resume or retrospective note supports it.
