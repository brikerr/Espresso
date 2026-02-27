# Espresso Extraction Anatomy — Roadmap

## Current State (v1.0)

Shipped features: 2D radial visualization, 3D puck cross-section, 4 brew methods, 4 grind sizes, temperature/crema toggles, stat pills, legend hover highlights (synced 2D/3D), 7-chapter guided tour with ElevenLabs narration, Cafe Ambiance audio, light/dark theme, PNG export, WebM recording, URL state encoding, responsive layout.

---

## Tier 1 — Interactive & Simulation

### 1. Live Shot Timer

A "Pull Shot" button that runs a real-time extraction simulation. The visualization animates through Phase 1 → 2 → 3 progressively over the brew method's total time (e.g., 25–30s for espresso). Water particles accelerate, crema builds, stats tick up live, and phase rings fill sequentially instead of being static.

**Key details:**
- Play/pause/reset controls anchored near the canvas
- Progress bar or circular timer showing elapsed time
- Stats (TDS, Yield) count up from 0 to final values in real time
- Phase boundary highlights pulse as the extraction crosses each threshold
- 3D puck layers saturate progressively top-to-bottom
- At completion: brief flash or glow indicating shot is "done"
- Works for all 4 brew methods at their respective durations

### 2. Comparison Mode

Split-screen or overlay toggle that renders two configurations side-by-side. Users select an A/B pair — two brew methods, two grind settings, or any combination — and see both visualizations simultaneously with stat pills for each.

**Key details:**
- Toggle button in the controls area: "Compare"
- Two independent canvas views, each half-width (or a stacked layout on mobile)
- Shared legend, independent controls per side
- Differencing overlay option: highlight areas where the two configs diverge
- Useful for understanding trade-offs (e.g., fine vs. coarse, espresso vs. pour-over)

### 3. Extraction Quality Meter

A gauge or indicator that responds to the current grind + brew + temp combination and shows whether the configuration produces an under-extracted, ideal, or over-extracted result.

**Key details:**
- Compact UI element near the stat pills or below the controls
- Visual range: a horizontal bar with three zones (sour / balanced / bitter)
- Marker position derived from the current parameter combination
- Tooltip explains why the current combo lands where it does
- Adjusting grind/brew/temp slides the marker in real time
- Educational: teaches beginners which knobs to turn and in what direction

---

## Tier 2 — Visual & Polish

### 4. Micro-Interactions & Sound Design

Subtle audio cues for user interactions, complementing the existing Cafe Ambiance feature. Each sound is short (<500ms), non-intrusive, and themed to the coffee domain.

**Key details:**
- Grinder whir (short, layered noise) when changing grind size
- Water pour (brief splash) when switching brew methods
- Soft click for toggle chips (temp, crema)
- Quiet ceramic tap for legend hover
- Master SFX toggle (independent of Cafe Ambiance) — off by default
- All sounds loaded as small base64-encoded audio or generated via Web Audio API oscillators
- Respect `prefers-reduced-motion` — disable if set

### 5. Animated Brew Method Transitions

Instead of instantly swapping configurations when changing brew methods, morph the 2D visualization geometry with a visible crossfade over ~500ms.

**Key details:**
- Phase rings expand/contract smoothly to new proportions
- Channeling paths redistribute and fade-swap
- Pressure gradient layers cross-dissolve between color intensities
- 3D puck geometry morphs (cylinder heights lerp) — already partially in place via lerp
- Stat pill values already animate (easeOutQuart, 1200ms) — no change needed there
- Crema ring size adjusts to match new brew method's crema behavior

### 6. Canvas Zoom & Pan

Let users zoom into specific regions of the 2D visualization for finer detail — particularly useful on mobile where the canvas is smaller.

**Key details:**
- Scroll wheel to zoom (desktop), pinch to zoom (mobile)
- Click-drag to pan when zoomed in (desktop), one-finger drag (mobile)
- Zoom range: 1x – 4x
- Smooth momentum scrolling on pan release
- Reset button or double-tap to return to 1x
- Phase hover tooltips still work at all zoom levels
- Zoom level does not persist in URL state (always resets to 1x)

---

## Tier 3 — Educational & Content

### 7. "Dial It In" Interactive Challenge

A mini-game mode where the app presents a target flavor profile and the user adjusts grind, brew method, and temperature to match. Scores the result and explains the reasoning.

**Key details:**
- Accessible via a button or menu item: "Try a Challenge"
- Presents a prompt like "Achieve a bright, fruity espresso" or "Maximize body and sweetness"
- User adjusts controls; a live score indicator shows how close they are
- On submit: reveals the ideal configuration with a brief explanation
- 5–8 predefined challenges covering common extraction goals
- Tracks best scores in `localStorage`
- Educational: builds intuition for how grind/brew/temp interact

### 8. Compound Detail Cards

Tapping or clicking a phase ring opens a drawer or modal with deeper information about the specific compounds extracted during that phase.

**Key details:**
- Extends the existing phase hover tooltip into a richer, persistent view
- Content per compound: name, molecular family, flavor descriptor, extraction curve
- Optional: simple molecular structure illustration (SVG or Canvas-drawn)
- Flavor wheel placement reference (SCA flavor wheel quadrant)
- Accessible via click on the phase ring (hover still shows the quick tooltip)
- Dismiss by clicking outside or pressing Escape
- Mobile: slides up as a bottom sheet

### 9. Coffee Origin Profiles

A dropdown or selector for bean origin that subtly shifts phase proportions, flavor notes, and the information displayed in tooltips.

**Key details:**
- Origins: Ethiopian (bright, fruity), Colombian (balanced, nutty), Sumatran (earthy, heavy), Kenyan (complex, berry), Brazilian (chocolatey, low acid)
- Each origin modifies: phase duration ratios, compound emphasis, tasting notes
- Visualization reflects origin — e.g., Ethiopian has a proportionally larger Phase 1 (acids)
- Default: "Generic" or no origin selected (current behavior)
- Integrates with the guided tour if active
- URL state param: `origin=ethiopian`

---

## Tier 4 — Utility

### 10. Recipe Card Sharing

Extend the existing URL state and PNG export into a styled, branded "recipe card" image designed for sharing on social media or with a barista.

**Key details:**
- "Share Recipe" button alongside the existing Export/Record buttons
- Generates a card-format image (1080x1350 or 1200x630 for social)
- Layout: mini visualization thumbnail, brew method icon, key stats (TDS, Yield, Dose, Ratio, Time), grind setting, and a "brewed with Espresso Extraction Anatomy" footer
- Color-themed to match current light/dark mode
- Optional: QR code encoding the shareable URL for the exact configuration
- Downloads as PNG or copies to clipboard

---

## Implementation Notes

- All enhancements should follow the existing single-file architecture (`index.html`) unless complexity warrants splitting
- Maintain zero border-radius, editorial typography (Cormorant Garamond + Karla), and copper-amber-gold palette per DESIGN-SYSTEM.md
- No external dependencies beyond what's already loaded (Three.js, Google Fonts, Material Symbols)
- Each feature should degrade gracefully — the core visualization must always work without any enhancement enabled
- Mobile (≤600px) considerations required for every feature
- URL state encoding should be extended for any new persistent user configuration
