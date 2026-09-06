# Every Espresso

An interactive anatomy of espresso extraction. Every shot is a 25-second chemistry experiment — pressure, temperature, grind, and time producing wildly different flavor profiles from the same beans. This project makes that visible.

**Live:** [everyespresso.pro](https://everyespresso.pro)

## What it does

A single-page interactive visualization of the espresso extraction process. A top-down radial view of the portafilter basket shows the three extraction phases — sours, sugars, bitters — as they develop across the puck. A companion 3D cross-section reveals what's happening top-to-bottom inside the coffee bed. A seven-chapter narrated tour walks first-time viewers through the science.

Users can:

- **Swap brew methods** — espresso, ristretto, lungo, or pour-over, each with its own pressure, temperature, and time profile
- **Change grind size** — from Turkish-fine to French-press-coarse, watching phase proportions and channeling risk shift in real time
- **Toggle temperature and crema layers** to isolate specific variables
- **Follow a guided tour** — seven chapters of narrated audio explaining phases, brew methods, temperature, pressure, and dialing in
- **Export a shot** — PNG snapshot with a configuration watermark, or a 5-second WebM recording of the extraction
- **Share a configuration** — every parameter is encoded in the URL, so any state is one link away

## How it's built

Entirely client-side. One `index.html` with inline CSS and JavaScript. No build step, no framework, no server. Deploys as a static site.

| Layer | Technology |
|---|---|
| 2D visualization | HTML5 Canvas 2D API |
| 3D cross-section | Three.js r128 (CDN) |
| Typography | Cormorant Garamond, Karla (Google Fonts) |
| Icons | Material Symbols Outlined |
| Audio | Pre-generated ElevenLabs TTS narration |
| Video capture | Canvas `captureStream()` + `MediaRecorder` |
| State | URL query params via `URLSearchParams` |
| Deployment | Vercel (static) |

The whole thing is around 2,400 lines of code in one file. That's a design choice, not a limitation — the tight scope keeps the project readable end-to-end and the visualization runs at 60fps everywhere.

## Design language

Editorial minimalism rooted in print design. The visual language borrows from specialty coffee packaging and scientific illustration: restrained typography, warm earth tones, sharp zero-radius geometry, and generous negative space. Every element earns its place — no decorative borders, no drop shadows, no rounded corners. The design trusts the data visualization to carry the page.

See [`DESIGN-SYSTEM.md`](./DESIGN-SYSTEM.md) for the full type scale, color tokens, and interaction language.

## Documentation

- **[PRD.md](./PRD.md)** — Complete product requirements: feature list (F1–F15), technical stack, audio pipeline, deployment configuration
- **[DESIGN-SYSTEM.md](./DESIGN-SYSTEM.md)** — Typography, color, spacing, motion, and component specifications
- **[ROADMAP.md](./ROADMAP.md)** — Planned enhancements: live shot timer, comparison mode, extraction quality meter, and more

## Running locally

No build required.

```
git clone https://github.com/brikerr/Espresso.git
cd Espresso
python3 -m http.server 8000
# open http://localhost:8000
```

Regenerating narration audio requires an ElevenLabs API key:

```
export ELEVENLABS_API_KEY=your_key_here
node scripts/generate-audio.js
```

## License

MIT — see [LICENSE](./LICENSE).
