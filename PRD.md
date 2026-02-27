# Espresso Extraction Anatomy — Product Requirements Document

## Overview

A single-page interactive data visualization that anatomizes the espresso extraction process. Users explore how water pressure, temperature, grind size, and brew method interact to produce different flavor profiles — presented through a top-down portafilter basket view rendered on a 2D canvas, a companion 3D cross-section, and an optional narrated guided tour.

The visualization is entirely client-side: one HTML file with inline CSS and JavaScript, no build step, no framework, no server-side logic. It deploys as a static site on Vercel.

---

## Technical Stack

| Layer | Technology | Notes |
|---|---|---|
| Markup / Styling | HTML5, CSS3 (custom properties) | Single `index.html`, all inline |
| 2D Visualization | Canvas 2D API | Full 360° radial visualization |
| 3D Companion | Three.js r128 (CDN) | Cylinder-based puck cross-section |
| Typography | Google Fonts (Cormorant Garamond, Karla) | Loaded via `<link>` |
| Icons | Material Symbols Outlined (Google Fonts) | Variable font with FILL/wght/GRAD/opsz axes |
| Audio | HTML5 `<audio>` + ElevenLabs TTS | Pre-generated MP3s in `/audio/` |
| Video Capture | Canvas `captureStream()` + `MediaRecorder` | 5-second WebM recording |
| Image Export | Canvas `toDataURL('image/png')` | With configuration watermark |
| Deployment | Vercel (static) | `vercel.json` with cache headers |
| State Management | Plain JS object with lerp-based animation | No framework or library |
| URL State | `URLSearchParams` + `history.replaceState` | Shareable configuration URLs |

### External Dependencies (CDN only)
- `three.min.js` r128 — `cdnjs.cloudflare.com`
- Cormorant Garamond (300, 400, 500 + italic) — Google Fonts
- Karla (300, 400, 500, 600) — Google Fonts
- Material Symbols Outlined — Google Fonts

---

## Project Structure

```
Coffee-Anatomy/
├── index.html              # Complete application (~2,400 lines)
├── vercel.json             # Deployment config and cache headers
├── PRD.md                  # This document
├── DESIGN-SYSTEM.md        # Visual language specification
├── ROADMAP.md              # Feature roadmap and enhancement backlog
├── scripts/
│   └── generate-audio.js   # ElevenLabs TTS narration generator
└── audio/
    ├── 01-overview.mp3
    ├── 02-phases.mp3
    ├── 03-brew-methods.mp3
    ├── 04-temperature.mp3
    ├── 05-pressure-crema.mp3
    ├── 06-problems.mp3
    └── 07-dialing-in.mp3
```

---

## Features

### F1 — 2D Extraction Visualization (Canvas)

The primary visualization is a full 360° top-down view of a portafilter basket rendered on an HTML5 Canvas. The center of the canvas represents the center of the coffee puck, and concentric rings radiating outward represent the three extraction phases.

**Layout geometry:**
- Center: `cx = width * 0.5`, `cy = height * 0.5`
- Maximum radius: `maxR = min(cx, cy) * 0.80`
- Full circle: `0` to `2π`

**Rendered layers (bottom to top):**

1. **Dot grid background** — Faint grid of 0.5px dots at 32px spacing
2. **Phase fills** — Three concentric annular rings (acids, sugars, bitters) with graduated opacity
3. **Phase boundary circles** — Dashed circles at each phase boundary with time labels at the top
4. **Phase name labels** — Positioned at approximately 2 o'clock angle on each boundary
5. **Temperature gradient** — Smooth radial gradient from center outward + three dashed contour rings at 93°C, 90°C, 85°C (toggleable)
6. **Resistance zone** — Partial annular arc segment (40°–80°) near the basket rim showing over-compacted puck areas
7. **Channeling paths** — 5 irregular thin radial lines at pseudo-random angles, each with a radial gradient showing depth penetration
8. **Pressure profile** — 8 concentric radial gradient layers in copper tones showing pressure distribution
9. **Flow distribution outline** — Slightly wobbly dashed circle (sine perturbation on radius) showing flow evenness
10. **Crema formation** — Expanding golden annular ring that grows outward from center and resets (toggleable)
11. **Basket rim** — Solid circle at `maxR` representing the 58mm basket edge
12. **Water flow pulse** — Thin expanding ring that radiates outward from center and resets
13. **Highlight overlays** — When a legend item is hovered, all other layers dim to 4% opacity while the highlighted layer renders at full brightness with a thick stroke
14. **Center origin** — Minimal geometric dot (2.5px) with subtle radial glow and faint 6px halo ring

**Phase hover interaction:**
- Moving the cursor over the visualization detects which phase ring the cursor is in (based on distance from center vs. phase boundary radii)
- A rich tooltip appears showing phase title, time range, 5 compound bullet points, and a tasting note
- The hovered phase ring brightens; non-hovered phases dim

**Animation:**
- `state.currentGrind` lerps toward `state.targetGrind` at 6% per frame for smooth transitions
- Phase time values (`animTime1/2/3`) lerp toward brew config targets
- `flowPulse` increments continuously; resets at 1.0
- `cremaPhase` increments at 0.002/frame; resets at 1.0 (outward expansion only, no oscillation)

### F2 — Grind Size Control

Four discrete grind settings that control phase proportions and channeling risk:

| Setting | Index | Phase 1 End | Phase 2 End | Channeling | Resistance |
|---|---|---|---|---|---|
| Fine | 0 | 0.25 | 0.55 | 0.80 | 0.15 |
| Med-Fine | 1 | 0.30 | 0.62 | 0.45 | 0.08 |
| Medium | 2 | 0.36 | 0.68 | 0.20 | 0.04 |
| Coarse | 3 | 0.44 | 0.76 | 0.08 | 0.01 |

Grind values are interpolated between integer configs using `getGrindValues()` for smooth animation when switching. The grind lerps at 6% per frame via `state.currentGrind`.

**Auto-set behavior:** When switching brew methods, the grind automatically sets to the method's typical default (espresso → Med-Fine, pour-over → Medium, AeroPress → Med-Fine, French Press → Coarse). The user can override by clicking a different grind button afterward.

### F3 — Brew Method Selector

Four brew methods, each with a complete configuration:

| Method | TDS | Yield | Dose | Ratio | Time | Default Grind |
|---|---|---|---|---|---|---|
| Espresso | ~10% | 20% | 18g | 1:2 | 25–30s | Med-Fine (1) |
| Pour-Over | ~1.3% | 20% | 15g | 1:15 | 3:30 | Medium (2) |
| AeroPress | ~1.4% | 19% | 15g | 1:12 | 2:00 | Med-Fine (1) |
| French Press | ~1.2% | 17% | 17g | 1:15 | 4:00 | Coarse (3) |

Each brew config includes:
- Numeric stat values for animated transitions (`tdsNum`, `yieldNum`)
- Phase timing in seconds (`time1`, `time2`, `time3`)
- Phase names array (3 strings)
- `phaseInfo` object with title, range, 5 items, and tasting note per phase
- `statTooltips` — context-specific tooltip text for each stat pill
- `legendPressureTooltip` — method-specific pressure legend tooltip
- `defaultGrind` — recommended grind setting (integer 0–3)
- `puck3d` — 3D geometry config (radius, height, screenRadius, screenColor, screenOpacity)

Stat values animate between old and new values using an easeOutCubic curve over 600ms.

### F4 — Toggle Layers

Two chip-style toggle buttons:

- **Temperature** (thermostat icon) — Shows/hides the temperature gradient and contour rings on the 2D canvas, and the emissive heat glow on the 3D puck
- **Crema** (blur_on icon) — Shows/hides the crema expansion ring on the 2D canvas and the golden crema disc on the 3D puck

Both default to **on**. State is preserved in URL params.

### F5 — Stat Pills

Five horizontally-arranged stat indicators in the header:

1. **TDS** — Total Dissolved Solids percentage (colored `--primary`)
2. **Yield** — Extraction yield percentage (colored `--primary`)
3. **Dose** — Dry coffee weight in grams (colored `--secondary`)
4. **Ratio** — Brew ratio
5. **Time** — Total extraction time

Each pill has a hover tooltip with a detailed explanation that updates when the brew method changes.

### F6 — Legend with Highlight Interaction

Seven legend items across the bottom of the visualization:

| Legend Item | Key | 2D Layer | 3D Counterpart |
|---|---|---|---|
| Pressure | `pressure` | Radial gradient layers + flow outline | Puck meshes + wires brighten |
| Flow distribution | `flow` | Wobbly dashed circle | Water particles stay visible |
| Channeling | `channeling` | Radial path lines | Channeling tubes brighten |
| Temperature | `temp` | Radial gradient + contour rings | Emissive heat glow boosts 1.8x |
| Crema | `crema` | Expanding golden ring | Crema disc brightens |
| Resistance | `resistance` | Partial annular blockage zone | Everything dims (2D-only concept) |
| Phases | `phases` | Annular ring fills | Puck layers stay visible |

Hovering a legend item:
- Sets `state.highlightedLayer` to the item's key
- Dims all other legend items to 25% opacity via `.dimmed` class
- 2D canvas: `lA(layerName)` returns 1.0 for the highlighted layer, 0.04 for everything else
- 3D scene: `updateHighlight3D()` applies matching opacity multipliers — 1.4x for highlighted, 0.08x for dimmed; ground grid fades to 3–4% opacity

### F7 — 3D Puck Cross-Section

A Three.js scene rendered in a 420x420px container (220x220 on mobile), positioned absolute bottom-right. Shows the coffee puck as stacked transparent cylinders viewed from a slight angle.

**Base geometry:**
- Three stacked `CylinderGeometry` layers (acids top, sugars middle, bitters bottom)
- Layer heights proportional to grind-interpolated phase boundaries
- A thin shower screen disc on top
- All dimensions scale per brew method via `puck3d` config

**Six enhancement layers:**

1. **Water flow particles** — 60 small spheres falling through the puck. Start blue (water), shift golden mid-puck, then copper at bottom. Speed and density increase with coarser grind. Fade in at top, fade out at bottom.

2. **Color saturation animation** — ~35-second cycle. Phase 1 (acids) saturates first (0–33%), phase 2 (sugars) follows (20–66%), phase 3 (bitters) last (40–100%). Uses smoothstep easing. Opacity increases 0.08 at peak saturation.

3. **Crema disc** — Golden `CylinderGeometry` that smoothly expands above the shower screen when crema toggle is on. Uses smoothstep easing. Has emissive glow (0x806020 dark / 0x6B4510 light).

4. **Channeling lines** — `TubeGeometry` tubes cutting vertically through the puck at random positions. Count scales with channeling risk (2–5 lines). Line thickness scales with risk. Not visible below 0.15 channeling value. Pulse gently.

5. **Temperature heat glow** — Emissive gradient on puck layers when temperature toggle is on. Top layer (acids, near shower screen) = brightest (0.55 intensity). Bottom layer (bitters) = dimmest (0.15). Subtle sinusoidal pulse.

6. **Idle rotation** — Gentle auto-rotation (~1 revolution per 30 seconds). Stops immediately on drag. Resumes with 1.5-second ease-in after 2-second pause post-drag.

**Interaction:**
- Mouse drag rotates orbit (theta and phi)
- Touch drag supported (single finger)
- Scroll wheel zooms (orbit radius 4–22)
- Cursor: `grab` / `grabbing`
- "Drag to rotate" hint fades in at 1.5s, fades out at 6s

### F8 — Light/Dark Theme

Toggle button fixed top-right with Material Symbol icon (`light_mode` / `dark_mode`).

- Default: **Dark mode**
- Transition: 400ms ease-in-out on `background` and `color`
- All colors defined via CSS custom properties
- Canvas drawing uses `c(darkValue, lightValue)` helper
- 3D colors update via `updatePuck3DTheme()`
- State preserved in URL

### F9 — Guided Tour

A 7-chapter narrated walkthrough accessible via the `auto_stories` icon button fixed top-left.

**Tour UI elements:**
- Progress pips at top center (24px wide, 3px tall; active pip is 36px wide)
- Control buttons bottom-right: pause/resume, skip, exit
- Blurb area (bottom-left) shows character-revealed caption text
- During tour: header, stats, controls, legend, theme button, and 3D container dim to 12% opacity and become non-interactive
- Spotlight class overrides dimming on specific UI elements when the tour focuses on them

**Character reveal:**
- Each character in the caption is wrapped in a `<span class="tour-char">`
- Characters reveal sequentially: opacity 0 → 1 and blur 3px → 0 over 200ms
- Reveal speed syncs to audio duration

**Chapter choreography:**

| Ch | Title | Key Actions |
|---|---|---|
| 1 | What you're tasting | Highlight pressure → flash phases 1→2→3 |
| 2 | Three phases of extraction | Highlight phases, start 3D orbit, hover each phase sequentially |
| 3 | Brew method trade-offs | Spotlight brew toggle, switch to pour-over then back |
| 4 | Temperature's role | Enable temp, highlight temp layer, spotlight chip |
| 5 | Pressure and crema | Enable crema, highlight pressure → crema, spotlight chip |
| 6 | When things go wrong | Highlight channeling → resistance |
| 7 | Dialing in your shot | Spotlight grind group, cycle Fine→Medium→Coarse→Med-Fine |

**Tour action helpers:**
- `setGrind(n)` — Set target grind and update button state
- `setBrew(method)` — Simulate click on brew button (triggers full stat animation + auto-grind)
- `ensureTemp(bool)` / `ensureCrema(bool)` — Enable/disable toggle
- `highlightLayer(name)` — Set highlighted layer and dim legend
- `hoverPhase(n)` — Trigger phase hover state
- `startOrbit()` / `stopOrbit()` — Auto-rotate 3D view during tour
- `spotlightElement(selector)` / `unspotlightAll()` — Focus UI element during tour
- `resetDefaults()` — Restore all controls to default state

**Audio:**
- 7 MP3 files generated via ElevenLabs TTS (see `scripts/generate-audio.js`)
- Audio syncs caption reveal: characters per second = caption length / audio duration
- Graceful degradation: if audio fails to load, captions still reveal on a timed basis

**Tour state preservation:**
- On tour start: saves current grind, brew, temp, crema, highlight, and hover state
- On tour end: restores saved state

### F10 — PNG Export

Export button in the legend bar. Produces a composited PNG:
1. Draws the 2D canvas
2. Overlays the 3D renderer output at its screen position
3. Adds a configuration watermark pill at bottom-left: `{Grind} · {Brew} · Temp {on/off} · Crema {on/off} · {Date}`
4. Downloads as `espresso-anatomy-{brew}-grind{n}.png`

### F11 — WebM Recording

Record button in the legend bar. Captures a 5-second video:
1. Creates an offscreen canvas compositing 2D + 3D
2. Uses `captureStream(30)` at 30fps
3. Records with `MediaRecorder` (VP9 preferred, VP8 fallback) at 5Mbps
4. Shows a recording indicator with countdown (red dot + "5s"→"0s")
5. Downloads as `espresso-anatomy-{brew}.webm`

### F12 — URL State Encoding

All user-configurable state is encoded in URL query parameters:

| Parameter | Values | Default |
|---|---|---|
| `grind` | `0`–`3` | `1` (Med-Fine) |
| `brew` | `espresso`, `pourover`, `aeropress`, `frenchpress` | `espresso` |
| `temp` | `0`, `1` | `1` (on) |
| `crema` | `0`, `1` | `1` (on) |
| `theme` | `light`, `dark` | `dark` |

Only non-default values are written to the URL. Uses `history.replaceState` (no page reload). Fully round-trippable: copy URL → paste → identical state.

### F13 — Tooltips

Two tooltip systems:

1. **Stat/legend tooltips** — Triggered by `data-tooltip` attribute on any element. Appears after 300ms delay. Positioned below stat pills, above legend items. Max width 260px. Updates dynamically when brew method changes.

2. **Phase tooltips** — Triggered by cursor position on canvas (distance from center mapped to phase). Rich HTML tooltip with title, time range, bullet list of 5 compounds, and a tasting note. Follows cursor position with edge clamping. Max width 300px.

### F14 — Responsive Design

Single breakpoint at 600px:

| Property | Desktop | Mobile (≤600px) |
|---|---|---|
| Page padding | 2px 16px 16px | 8px 8px 8px |
| H1 font size | clamp(32px, 5vw, 48px) | 28px |
| Stat height | 38px | 30px |
| Button group height | 38px | 34px |
| Chip height | 34px | 30px |
| 3D container | 420x420px | 220x220px |
| Tour control buttons | 36x36px | 30x30px |

The canvas fills available space (`flex: 1; min-height: 0`) and scales via `ResizeObserver` with device pixel ratio compensation.

### F15 — Entry Animations

Staggered `rise` animation on page load:
- Header: 0ms delay
- Stats: 100ms delay
- Canvas: 200ms delay
- Controls: 300ms delay
- Legend: 400ms delay
- 3D container: 500ms delay
- Blurb: 600ms delay

All use 800ms ease-in-out opacity fade from 0 to 1.

---

## Audio Generation

The `scripts/generate-audio.js` Node.js script generates narration MP3s via the ElevenLabs TTS API.

**Usage:**
```bash
ELEVENLABS_API_KEY=... ELEVENLABS_VOICE_ID=... node scripts/generate-audio.js
```

**Configuration:**
- Model: `eleven_multilingual_v2`
- Voice settings: stability 0.5, similarity_boost 0.75, style 0.3, speaker_boost enabled
- Output: 7 MP3 files in `audio/` directory
- Sequential generation with 1-second delay between chapters

---

## Deployment

**Vercel configuration (`vercel.json`):**
- No build command, no framework
- Output directory: `.` (root)
- Clean URLs enabled
- Security headers on all routes: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`
- `index.html`: `Cache-Control: public, max-age=0, must-revalidate`
- `/audio/*`: `Cache-Control: public, max-age=31536000, immutable`

---

## Browser Requirements

- Canvas 2D API
- `ResizeObserver`
- `requestAnimationFrame`
- CSS custom properties
- `URLSearchParams`
- `history.replaceState`
- WebGL (for Three.js 3D)
- `MediaRecorder` (for WebM recording; graceful fallback if unavailable)
- `FontFace` API (for Material Symbols; graceful fallback)
