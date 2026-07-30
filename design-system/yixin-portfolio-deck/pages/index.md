# Portfolio deck page override

This file overrides the generated `MASTER.md` for `index.html`.

## Direction

- Use an evidence-first editorial grid: Swiss structure, research-note clarity,
  asymmetric compositions, and one restrained blue accent.
- Avoid the generated HUD / sci-fi recommendation. Decorative telemetry and glow
  effects would undermine the pragmatic tone.
- Use source fragments as evidence: crop only the relevant interface, table,
  plot, frame, or diagram region and combine fragments with captions.
- Do not synthesize a headshot or replace documentary artifacts with an
  illustrative redraw.

## Palette

| Role | Value |
| --- | --- |
| Paper | `#F4F2EC` |
| Surface | `#FCFBF7` |
| Ink | `#171816` |
| Muted ink | `#555A54` |
| Rule | `#C9CCC5` |
| Primary | `#1746A2` |
| Primary tint | `#E8EEF9` |
| Education | `#1F6B49` |
| Project | `#7A4E00` |
| Volunteer / warning | `#8A3030` |

Meaning is never conveyed by color alone.

## Typography

- Use local system stacks for a fast, dependency-free GitHub Pages load.
- Display: `Iowan Old Style`, `Palatino Linotype`, `Book Antiqua`, `Georgia`,
  serif.
- Body: `Inter`, `SF Pro Text`, `Segoe UI`, `Helvetica Neue`, system-ui,
  sans-serif.
- Data labels: `SFMono-Regular`, `Cascadia Code`, `Roboto Mono`, `Menlo`,
  monospace.
- Do not scale the entire slide or compress desktop text into unreadable mobile
  facsimiles.

## Layout

- Nine full-viewport slides beside a quiet vertical desktop rail; switch to a
  compact top bar below 960px.
- Page one pairs the robot-learning goal with a frameless vertical chronology.
- Career, education, HIT projects, and volunteering use distinct timeline
  labels; each project receives its own dated row.
- Project pages use an open case-story layout: concise problem/method/result copy
  alongside a loose collage of traceable artifacts.
- Credentials occupy a dedicated provider-grouped page.
- No slide has an internal vertical scrollbar.
- Choose among discrete `roomy`, `compact`, and `essential` layouts. Essential
  mode removes secondary content; it never applies whole-slide scaling.

## Interaction

- Left/right arrows, PageUp/PageDown, Home/End, visible previous/next buttons,
  direct navigation, and touch swipe.
- Keep the current slide in the URL hash.
- Do not hijack arrow keys while focus is inside links, buttons, or video
  controls.
- Use a short opacity/translate transition and disable it under
  `prefers-reduced-motion`.
- The cabinet video uses a click-to-load facade, `preload="none"`, native
  controls, and a direct fallback link.

## Quality gates

- 4.5:1 minimum normal-text contrast and a visible `:focus-visible` treatment.
- At least 44px interactive targets.
- No horizontal or vertical overflow at 1440×900, 1366×768, 1024×768,
  390×844, 360×640, and short landscape viewports.
- Meaningful image alt text and stable image dimensions/aspect ratios.
- No unsourced portrait, decorative stock image, or unqualified result claim.
- `Needs review` is reserved for an actual evidence or methodology gap, not
  portfolio-process commentary.
