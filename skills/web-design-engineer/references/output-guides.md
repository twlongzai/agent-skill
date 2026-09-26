# Output Type Guidelines

### Interactive Prototypes

- **No title screen / cover page** - prototypes should center in the viewport or fill it (with sensible margins), letting the user see the product immediately
- Use device frames (iPhone / Android / browser window) to enhance realism (see [advanced-patterns.md](advanced-patterns.md#device-simulation-frames))
- Implement key interaction paths so the user can click through them
- For exploratory design requests, provide 2-3 variants or toggles; for targeted implementation, add variants only when they serve the task
- Cover states the interaction can actually enter: default / hover / active / focus / disabled / loading / empty / error. Do not add artificial states to static content.

### HTML Slide Decks / Presentations

- For a 16:9 deck, a 1920×1080 canvas auto-fitted via `transform: scale()` is a useful default; preserve a supplied aspect ratio or template.
- Centered with letterbox bars; prev/next buttons placed **outside** the scaled container (to remain usable on small screens)
- Keyboard navigation: Left/Right arrows to change slides, Space for next
- For refresh persistence, use a deck-specific `localStorage` key. Validate saved indices and keep navigation usable when storage is unavailable.
- **Slide numbering is 1-indexed**: use labels like `01 Title`, `02 Agenda`, matching human speech ("slide 5" corresponds to label `05` - never use 0-indexed labels that cause off-by-one confusion)
- Each slide should have a `data-screen-label` attribute for easy reference
- Don't cram too much text - visuals lead, text supports; use at most 1-2 background colors per deck

### Data Visualization Dashboards

- Chart.js (simple) or D3.js (complex custom) - use installed dependencies in app projects, CDN only for standalone artifacts
- Responsive chart containers (`ResizeObserver`)
- Preserve the existing theme behavior; add a dark/light toggle when the brief calls for it.
- Focus on **data-ink ratio**: remove unnecessary gridlines, 3D effects, and shadows; let the data speak
- Color encoding should carry semantic meaning (up/down / category / time), not serve as decoration

### Animation / Video Demos

Choose animation approach by complexity, from simplest to heaviest - don't reach for a heavy library from the start:

1. **CSS transitions / animations** - start here for button presses, hovers, entry animations, and state toggles
2. **Simple React state + setTimeout / requestAnimationFrame** - simple frame-by-frame or event-driven animations
3. **Custom `useTime` + `Easing` + `interpolate`** (full implementation in references) - timeline-driven video/demo scenes: scrubber, play/pause, multi-segment choreography
4. **Fallback: Popmotion** (`https://unpkg.com/popmotion@11.0.5/dist/popmotion.min.js`) - only if the above three layers genuinely can't cover the use case

> In an existing app, reuse its motion dependencies and module conventions. For a new standalone inline-Babel prototype, start with the lightest approach that meets the brief; verify loading compatibility before adding Framer Motion, GSAP, Lottie, or another library. Inline-Babel limitations are not a reason to remove a working app dependency.

For timeline-based demos (not every micro-interaction):
- Provide play/pause and a scrubber; verify pause, resume, seeking, and cleanup. The `useTime` example in [advanced-patterns.md](advanced-patterns.md#animation-timeline-engine) supports these controls.
- Define a unified easing-function library (reuse the same set of easings within a project) for consistent motion language
- Don't add a "title screen" to video-type artifacts — go straight into the main content

Use only the section for the requested output. Completion includes the requested content and working paths, relevant accessibility/viewport checks, and an honest report of checks that could not run. Read [advanced-patterns.md](advanced-patterns.md) only for a component you need.
