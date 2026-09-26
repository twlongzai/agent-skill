# Standalone Browser Prototypes

Read when building a standalone HTML/React artifact. Existing application conventions take precedence; these examples do not require changing an app to classic scripts or CDN dependencies.

## Technical Specifications

### HTML File Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Descriptive Title</title>
    <style>/* CSS */</style>
</head>
<body>
    <!-- Content -->
    <script>/* JS */</script>
</body>
</html>
```

### React + Babel (Inline JSX)

For standalone HTML React prototypes, the following pinned CDN scripts are a reproducible starting point. Keep their integrity checks. If the CDN is unavailable or an integrity check fails, use verified local copies or another verified source; do not remove integrity as a workaround. For existing React/Vite/Next/etc. projects, use the repo's package manager, local dependencies, build scripts, and component conventions instead of CDN scripts.

```html
<script src="https://unpkg.com/react@18.3.1/umd/react.development.js"
        integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L"
        crossorigin="anonymous"></script>
<script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js"
        integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm"
        crossorigin="anonymous"></script>
<script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js"
        integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y"
        crossorigin="anonymous"></script>
```

#### Scope and script loading

These UMD scripts and inline Babel examples are for standalone browser prototypes. Load React, ReactDOM, Babel, then application scripts in order. Keep these UMD library tags as classic scripts; an ES-module application should use its normal module build instead. Babel's [`data-type="module"`](https://babeljs.io/docs/babel-standalone#data-type) is a separate, supported setup and is not required by this example.

- Classic browser scripts share a global environment, and Babel presets can change how top-level bindings are emitted. Avoid name collisions across such scripts; do not assume each block creates an isolated component module.
- A local `styles` variable inside a component or ES module is valid. For intentionally shared prototype globals, use a named namespace, for example `window.PrototypeUI = { Terminal, Line }`, and document loading order. Use normal imports/exports in module projects.
- If an iframe preview has demonstrated outer-frame scrolling problems, scroll the intended container with `scrollTop` or an explicitly chosen window. `scrollIntoView` is not forbidden in ordinary app code; verify the actual scroll/focus behavior.

### CSS Best Practices

- Prefer CSS Grid + Flexbox for layout
- Manage design tokens with CSS custom properties
- Prefer the existing brand palette; use `oklch()` to derive variants when useful. New colors should serve the brief and remain legible, rather than obeying an arbitrary hue ban.
- Use `text-wrap: pretty` for better line breaking
- Avoid viewport-driven font scaling. Use stable type sizes with responsive breakpoints/container queries; use `clamp()` only when tightly bounded and verified not to overflow.
- Use `@container` queries for component-level responsiveness
- Leverage `@media (prefers-color-scheme)` and `@media (prefers-reduced-motion)`

### File Management

- For standalone artifacts, use descriptive filenames: `Landing Page.html`, `Dashboard Prototype.html`
- For existing repositories, follow the existing file naming and module structure
- Split files when responsibilities become hard to maintain. Use the repository module structure in apps; explicitly ordered classic scripts are an option only for standalone prototypes.
- For major standalone revisions, copy + rename with `v2`/`v3` to preserve older versions (`My Design.html` -> `My Design v2.html`)
- For production app code, edit in place and rely on git history unless the user requests variants as separate files
- For multiple variants, prefer **a single file + Tweaks toggles** over separate files
- Copy assets locally before referencing them - don't hotlink directly to user-provided assets

> **More code templates** (device frames, slide engine, animation timeline, Tweaks panel, dark mode, design canvas, data visualization) available in [advanced-patterns.md](advanced-patterns.md)

---

## Common CDN Resources

**Default to hand-written CSS or resources from the brand/design system.** In existing repositories, prefer installed dependencies and project tooling. The CDN resources below should only be loaded for standalone artifacts or quick prototypes when the scenario clearly calls for them - do not include everything by default.

### Use When the Scenario Clearly Requires It

```html
<!-- Data Visualization: Charts -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>     <!-- Standard charts (line / bar / pie) -->
<script src="https://d3js.org/d3.v7.min.js"></script>              <!-- Complex custom visualizations -->

<!-- Optional font example: prefer available brand fonts and verify language coverage. -->
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Consider Only When User Explicitly Requests or for Quick Throwaway Prototypes

```html
<!-- Tailwind CSS (utility-first rapid prototyping)
     Use the existing framework when present. For a new standalone page, plain CSS
     may be sufficient; Tailwind and design tokens are not inherently incompatible. -->
<script src="https://cdn.tailwindcss.com"></script>

<!-- Lucide Icons (use when the user provides an icon library or explicitly specifies one)
     When no icons are available, prefer drawing placeholders ([icon] / simple geometric shapes)
     rather than inserting icons just to "look complete." -->
<script src="https://unpkg.com/lucide@latest"></script>
```

> The React/Babel versions and hashes above were checked together. Change them only for a concrete compatibility need, updating and verifying the hashes as part of that change. The unpinned chart/icon examples below the main template are discovery examples: select a verified, pinned version or local dependency before distributing an artifact.

---
