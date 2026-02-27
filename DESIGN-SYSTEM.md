# Espresso Extraction Anatomy — Design System

## Design Philosophy

Editorial minimalism rooted in print design. The visual language borrows from specialty coffee packaging and scientific illustration: restrained typography, warm earth tones, sharp zero-radius geometry, and generous negative space. Every element earns its place — no decorative borders, no drop shadows, no rounded corners. The design trusts the data visualization to carry the page.

---

## Typography

### Font Stack

| Role | Family | Fallback | Source |
|---|---|---|---|
| Display | Cormorant Garamond | Georgia, serif | Google Fonts |
| Body | Karla | system-ui, sans-serif | Google Fonts |
| Icons | Material Symbols Outlined | — | Google Fonts (variable) |

### Display Type — Cormorant Garamond

Used for the page title and the blurb heading. High-contrast serif with calligraphic character. Always italic, always light.

| Element | Weight | Style | Size | Line Height | Letter Spacing |
|---|---|---|---|---|---|
| Page title `h1` | 300 (Light) | Italic | `clamp(32px, 5vw, 48px)` | 1.05 | -0.01em |
| Blurb heading `h3` | 400 (Regular) | Italic | 15px | default | -0.01em |

**Loaded weights:** 300, 400, 500 (regular + italic for 300 and 400).

### Body Type — Karla

Used for all interface text: stats, controls, labels, tooltips, legend, and canvas-rendered labels. A geometric sans-serif with a humanist feel. Clean at small sizes.

| Element | Weight | Size | Letter Spacing | Transform | Color |
|---|---|---|---|---|---|
| Control labels | 500 | 10px | 1px | uppercase | `--text-muted` |
| Stat keys | 500 | 10px | 1.5px | uppercase | `--text-muted` |
| Stat values | 600 | 13px | — | — | `--text-secondary` or themed |
| Button text | 500 | 13px | — | — | `--text-muted` (off) / `--text` (on) |
| Chip text | 500 | 11px | — | — | themed color (on) / `--text-muted` (off) |
| Legend items | 500 | 10px | — | — | `--text-muted` |
| Tooltips | 400 | 12.5px | — | — | `--tooltip-text` |
| Phase tooltip title | 600 | 13px | — | — | `--tooltip-text` |
| Phase tooltip range | 400 | 11px | — | — | `--tooltip-text` at 55% opacity |
| Phase tooltip items | 400 | 12px | — | — | `--tooltip-text` |
| Phase tooltip note | 400 | 11.5px | — | italic | `--tooltip-text` at 70% opacity |
| Blurb body | 400 | 10.5px | — | — | `--text-muted` |
| Blurb body (tour) | 400 | 11px | — | — | `--text-muted` |
| Capture buttons | 500 | 10px | — | — | `--text-muted` |
| Rotate hint | 400 | 9px | 0.3px | — | `--text-muted` |
| Canvas labels | 500 | 9px | — | — | copper tones (theme-dependent) |
| Canvas phase names | 500 | 10px | 1px | uppercase | copper tones |
| Rec indicator | 600 | 13px | — | — | #fff |

**Loaded weights:** 300, 400, 500, 600.

### Icon Font — Material Symbols Outlined

Variable font with four axes:

```css
font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24;
```

| Context | Size |
|---|---|
| Theme toggle button | 20px |
| Tour start button | 20px |
| Chip icons (thermostat, blur_on) | 16px |
| Capture button icons | 13px |
| Tour control buttons | 18px (desktop), 16px (mobile) |
| Rotate hint icon (3d_rotation) | 12px |

**Icons used:** `light_mode`, `dark_mode`, `auto_stories`, `thermostat`, `blur_on`, `download`, `fiber_manual_record`, `stop`, `pause`, `play_arrow`, `skip_next`, `close`, `3d_rotation`.

### Text Rendering

```css
html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

---

## Color System

### CSS Custom Properties

All colors are defined as CSS custom properties on `[data-theme]` selectors. No hardcoded colors in the stylesheet body — everything references variables.

#### Light Theme

```
--bg:               #FFFFFF
--surface:          #F5F5F5
--surface-hover:    #EBEBEB
--text:             #1A1A1A
--text-secondary:   #4A4A4A
--text-muted:       #757575
--border:           rgba(0,0,0,0.13)
--border-hover:     rgba(0,0,0,0.25)
--primary:          #B87333        (copper)
--secondary:        #8B6914        (dark gold)
--secondary-muted:  rgba(139,105,20,0.08)
--tertiary:         #A0522D        (sienna)
--tertiary-muted:   rgba(160,82,45,0.08)
--tooltip-bg:       #1A1A1A
--tooltip-text:     #F5F5F5
--dot-color:        rgba(0,0,0,0.05)
```

#### Dark Theme (Default)

```
--bg:               #111111
--surface:          #1A1A1A
--surface-hover:    #242424
--text:             #E8E8E8
--text-secondary:   #9A9A9A
--text-muted:       #6A6A6A
--border:           rgba(255,255,255,0.10)
--border-hover:     rgba(255,255,255,0.20)
--primary:          #D4A574        (light copper)
--secondary:        #C9A84C        (gold)
--secondary-muted:  rgba(201,168,76,0.08)
--tertiary:         #CD853F        (peru)
--tertiary-muted:   rgba(205,133,63,0.06)
--tooltip-bg:       #E8E8E8
--tooltip-text:     #111111
--dot-color:        rgba(255,255,255,0.03)
```

### Semantic Color Usage

| Role | Property | Applied To |
|---|---|---|
| Primary accent | `--primary` | TDS and Yield stat values, copper visualization tones |
| Secondary accent | `--secondary` | Dose stat value, crema chip active border, golden tones |
| Tertiary accent | `--tertiary` | Temperature chip active border, warm red tones |
| Interactive text | `--text` | Active button text, page title |
| Supporting text | `--text-secondary` | Stat values (default), hovered elements |
| Subdued text | `--text-muted` | Labels, inactive buttons, legend items, hints |
| Borders | `--border` | Button groups, chips, stat underlines |
| Hover borders | `--border-hover` | Hover state for bordered elements |

### Canvas Drawing Colors

Colors on the 2D canvas are hardcoded rgba values selected per theme using the `c(dark, light)` helper function.

| Layer | Dark Mode | Light Mode |
|---|---|---|
| Pressure gradient | `rgba(212,165,116,…)` | `rgba(184,115,51,…)` |
| Flow distribution | Same as pressure, dashed | Same |
| Channeling paths | `rgba(205,133,63,…)` | `rgba(160,82,45,…)` |
| Temperature gradient | `rgba(220,100,60,…)` | `rgba(180,60,30,…)` |
| Temperature contours | `rgba(220,100,60,0.3)` | `rgba(180,60,30,0.25)` |
| Crema ring | `rgba(240,200,80,…)` | `rgba(218,165,32,…)` |
| Resistance zone | `rgba(180,100,40,0.08)` | `rgba(139,69,19,0.06)` |
| Phase fills | Copper tints at 2.5%–6% opacity | Copper tints at 3%–7% opacity |
| Phase boundaries | Copper at 22%–30% opacity | Copper at 22%–30% opacity |
| Phase hover fill | Copper at 10%–16% opacity | Copper at 8%–14% opacity |
| Basket rim | `rgba(212,165,116,0.30)` | `rgba(184,115,51,0.25)` |
| Dot grid | `rgba(255,255,255,0.025)` | `rgba(0,0,0,0.05)` |
| Background fill | `#111111` | `#FFFFFF` |

### 3D Scene Colors

| Element | Dark Mode Hex | Light Mode Hex |
|---|---|---|
| Phase 1 (Acids) | `0xD4A574` | `0xB87333` |
| Phase 2 (Sugars) | `0xC9A84C` | `0xC9A84C` |
| Phase 3 (Bitters) | `0xA08030` | `0x8B6914` |
| Saturated Phase 1 | `0xE8C090` | `0xD09050` |
| Saturated Phase 2 | `0xDDBC60` | `0xDDB860` |
| Saturated Phase 3 | `0xC09840` | `0xA88020` |
| Water particles (start) | `0x88CCFF` | `0x88CCFF` |
| Water particles (mid) | `0xC9A84C` | `0xC9A84C` |
| Water particles (end) | `0xB87333` | `0xB87333` |
| Crema disc | `0xE8C870` | `0xDAA520` |
| Crema emissive | `0x806020` | `0x6B4510` |
| Channeling tubes | `0xFFD080` | `0xE8A040` |
| Temperature glow (top) | `0x993300` | `0x882200` |
| Temperature glow (mid) | `0x662200` | `0x551500` |
| Temperature glow (bottom) | `0x331100` | `0x220800` |
| Ground grid | `0xD4A574` | `0xB87333` |
| Highlight wireframe | `0xFFD8B0` | `0xD49555` |

### Legend Dot Colors

| Item | Dot Style |
|---|---|
| Pressure | Solid `#B87333` |
| Flow distribution | Transparent with `1px dashed rgba(184,115,51,0.35)` border |
| Channeling | Solid `#A0522D` |
| Temperature | Solid `#B84030` |
| Crema | Solid `#DAA520` |
| Resistance | Solid `rgba(139,69,19,0.3)` |
| Phases | `rgba(184,115,51,0.12)` with `0.5px solid rgba(184,115,51,0.2)` border |

---

## Geometry and Spacing

### Border Radius

**Zero everywhere.** No rounded corners on any element: buttons, tooltips, chips, stat pills, button groups, or recording indicator. This is a deliberate editorial design choice — sharp corners reinforce the technical, precise character of the subject matter.

```css
border-radius: 0;
```

### Layout

| Property | Value |
|---|---|
| Page max-width | 100% (full bleed) |
| Page height | 100dvh |
| Page padding | 2px 16px 16px (desktop) / 8px 8px 8px (mobile) |
| Page layout | Flex column |
| Header alignment | Center |
| Stats gap | 6px, flex-wrap |
| Controls gap | 10px, flex-wrap |
| Legend gap | 14px, flex-wrap |

### Component Dimensions

| Component | Height | Padding |
|---|---|---|
| Stat pill | 38px (30px mobile) | 0 24px (0 12px mobile) |
| Button group | 38px (34px mobile) | — |
| Group button | 100% of parent | 0 16px (0 13px mobile) |
| Chip | 34px (30px mobile) | 0 12px (0 10px mobile) |
| Theme button | 40x40px | — |
| Tour start button | 40x40px | — |
| Tour control button | 36x36px (30x30 mobile) | — |
| Capture button | auto | 4px 8px |
| Tooltip | auto | 10px 14px |
| Phase tooltip | auto, min 220px, max 300px | 14px 16px |

### 3D Container

| Screen | Width | Height | Position |
|---|---|---|---|
| Desktop | 420px | 420px | Absolute, bottom 8px, right 8px |
| Mobile (≤600px) | 220px | 220px | Same |

### Canvas

Fills available flex space. Actual pixel dimensions set via JavaScript: `width = rect.width * devicePixelRatio`, `height = rect.height * devicePixelRatio`. The CSS `width`/`height` are set to `rect.width`/`rect.height` for correct DPR scaling.

---

## Interaction Patterns

### Button States

**Group buttons (`.gbtn`):**
- Default: `color: --text-muted`, `background: transparent`
- Hover: `color: --text-secondary`, `background: --surface`
- Active (`.on`): `color: --text`, `background: transparent`, `border-bottom: 2px solid --text`
- Dividers: 1px `--border` line at 28% top, 44% height between adjacent buttons. Hidden when either neighbor is active.

**Chip toggles (`.chip`):**
- Default (off): `color: --text-muted`, `border: 1px solid --border`
- Active (`.on`): themed color + themed border color, transparent background
- Temperature chip active: `color: --tertiary`, `border-color: --tertiary`
- Crema chip active: `color: --secondary`, `border-color: --secondary`

**Fixed buttons (theme, tour):**
- Default: `background: --bg`, `color: --text-muted`
- Hover: `color: --text-secondary`, `background: --surface`

### Stat Pill States

- Default: `border-bottom: 1px solid --border`
- Hover: `border-bottom-color: --border-hover`
- Stat values with `.c-primary`: colored `--primary`
- Stat values with `.c-secondary`: colored `--secondary`

### Legend Item States

- Default: `color: --text-muted`, `padding: 4px 8px`
- Hover: `color: --text-secondary`, `background: --surface`
- Dimmed (`.dimmed`): `opacity: 0.25`

### Tooltip Behavior

- Delay: 300ms before showing
- Fade: 180ms opacity transition
- Position: Below trigger for stats, above trigger for legend items
- Edge clamping: 8px minimum margin from viewport edges
- Max width: 260px (stat/legend), 300px (phase)

---

## Animation

### Timing Tokens

```css
--ease:     ease-in-out;
--ease-out: ease-out;
--dur:      400ms;
```

### CSS Transitions

| Element | Property | Duration | Easing |
|---|---|---|---|
| Body background/color | background, color | 400ms | ease-in-out |
| Button states | all | 180ms | ease-in-out |
| Tooltip opacity | opacity | 180ms | ease-in-out |
| Phase tooltip | opacity, transform | 180ms | ease-in-out |
| Legend dim | opacity (via class) | 180ms | ease-in-out |
| Tour UI fade | opacity | 400ms / 600ms | ease-in-out |
| Tour pip | background, width | 300ms | ease-in-out |

### CSS Animations

| Name | Duration | Easing | Behavior |
|---|---|---|---|
| `rise` | 800ms | ease-in-out | `opacity: 0 → 1`, staggered delays |
| `hintFade` | 6s | ease-in-out | Fade in at 12%, hold until 70%, fade out. 1.5s delay. |
| `recordPulse` | 1.2s | ease-in-out | `opacity: 1 → 0.6 → 1`, infinite |

### Canvas Animations (per frame)

| Animation | Rate | Behavior |
|---|---|---|
| Grind interpolation | 6% lerp/frame | `currentGrind → targetGrind` |
| Phase time interpolation | 6% lerp/frame | `animTime1/2/3 → cfg.time1/2/3` |
| Flow pulse | +0.003/frame | Expanding ring, resets at 1.0 |
| Crema expansion | +0.002/frame | Outward ring, resets at 1.0 |

### 3D Animations (per frame)

| Animation | Rate | Behavior |
|---|---|---|
| Water particles | Variable (grind-dependent) | Fall speed 0.008–0.032 per frame |
| Color saturation | +0.003/frame | ~35s cycle, phased per layer |
| Crema expansion | +0.005/frame | Smoothstep ease to full radius |
| Channeling pulse | `sin(clock * 2)` | 0.85–1.15 opacity multiplier |
| Temperature pulse | `sin(clock * 1.5)` | 0.9–1.1 intensity multiplier |
| Idle rotation | `2π / 1800` per frame | ~1 revolution per 30s at 60fps |
| Idle resume ease | 1.5s linear ramp | After 2s post-drag pause |

### Stat Value Animation

When brew method changes, numeric stat values animate from old to new over 600ms using an easeOutCubic curve: `1 - (1 - t)^3`.

---

## Tour Visual Language

### Dimming

During guided tour, all non-essential UI dims to 12% opacity with `pointer-events: none`. Transition: 600ms ease-in-out.

### Spotlighting

Individual UI elements can be spotlighted during the tour via the `.tour-spotlight` class, which overrides the dim: `opacity: 1 !important; pointer-events: none`.

### Character Reveal

Caption text is split into individual `<span>` elements:

```css
.tour-char {
  display: inline;
  opacity: 0;
  filter: blur(3px);
  transition: opacity 200ms ease-out, filter 280ms ease-out;
}
.tour-char.revealed {
  opacity: 1;
  filter: blur(0);
}
```

Characters reveal sequentially, timed to audio duration. The blur-to-sharp transition creates a gentle materialization effect.

### Progress Pips

Horizontal row of pill-shaped indicators centered at the top:

| State | Width | Background |
|---|---|---|
| Default | 24px | `rgba(255,255,255,0.2)` |
| Active | 36px | `rgba(255,255,255,0.8)` |
| Done | 24px | `rgba(255,255,255,0.45)` |

Height: 3px. Gap: 6px. Transition: 300ms ease-in-out on background and width.

### Tour Controls

Positioned absolute, bottom 60px, right 16px (bottom 48px, right 10px on mobile). Glass-morphism style:

```css
background: rgba(0,0,0,0.4);
backdrop-filter: blur(8px);
border: 1px solid rgba(255,255,255,0.3);
color: #fff;
```

Hover: `background: rgba(0,0,0,0.6)`.

---

## Recording Indicator

Fixed position absolute, top 16px, right 16px. Glass-morphism style:

```css
background: rgba(0,0,0,0.6);
backdrop-filter: blur(8px);
border: 1px solid rgba(255,255,255,0.15);
color: #fff;
font-weight: 600;
```

Contains an 8px red dot (`#E53E3E`) with `recordPulse` animation and a countdown label.

---

## Export Watermark

Positioned bottom-left of the exported PNG. Semi-transparent pill:

- Dark mode: `rgba(0,0,0,0.55)` background, `rgba(255,255,255,0.75)` text
- Light mode: `rgba(255,255,255,0.65)` background, `rgba(0,0,0,0.6)` text
- Font: 500 12px Karla
- Padding: 10px horizontal, 6px vertical
- Content: `{Grind Label} · {Brew Method} · Temp {on/off} · Crema {on/off} · {Date}`

---

## Center Origin Point

Instead of an icon, the center of the visualization uses a minimal geometric mark:

1. **Glow** — 12px radial gradient: copper at center (25% opacity dark / 20% light), fading to transparent
2. **Dot** — 2.5px solid circle: copper at 50% opacity (dark) / 40% opacity (light)
3. **Halo** — 6px stroke circle: copper at 15% opacity (dark) / 12% opacity (light), 0.5px line width

This creates a subtle focal point without competing with the data layers.

---

## Key Design Principles

1. **Zero radius** — No rounded corners anywhere. Sharp edges convey precision and scientific rigor.
2. **Underline > fill** — Active button states use a bottom border, not a background fill. Less visual weight.
3. **Opacity as hierarchy** — Instead of using different colors for emphasis, layer opacity to create depth (e.g., phase fills at 3–7%, boundaries at 22–30%, hovers at 10–16%).
4. **Warm neutrals** — The color palette avoids saturated hues. Even "red" (temperature) is a warm sienna, not a pure red. The palette lives in the copper–amber–gold family.
5. **Type contrast** — Serif display (Cormorant Garamond italic) vs. geometric sans body (Karla) creates editorial tension. The serif is only used for two elements: the title and the blurb heading.
6. **Animation restraint** — All transitions use ease-in-out. No bounces, no overshoots, no spring physics. Lerp at 6% per frame for smooth deceleration.
7. **Dimming over hiding** — Highlighting a layer dims everything else to 4% rather than hiding it. The user always sees the full system in context.
8. **Coordinated 2D/3D** — Legend hover highlights apply simultaneously to both the 2D canvas and the 3D scene, reinforcing that they show the same data from different perspectives.
