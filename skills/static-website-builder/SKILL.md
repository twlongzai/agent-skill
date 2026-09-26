---
name: static-website-builder
description: "Build or improve text-first static sites with HTML, CSS, JavaScript, and optional Markdown. Use for multilingual docs, tutorials, knowledge bases, serialized writing, and prose-first sites."
---

# Static Website Builder

Use this skill for reading-oriented static websites: docs, tutorials, manuals, essays, serialized writing, course notes, changelogs and knowledge bases. A prose-writing request alone does not need site-building work. Follow an existing framework or documentation generator's conventions; this skill does not require migrating it to plain HTML.

## Choose the Scope

Read the affected source material, files and local design context before editing. Choose only the references needed for the requested change:

- **Existing-site local edit:** change the affected content, link or style and preserve the site's architecture. No site-map redesign, template copy, new search, or locale work is needed unless that behavior changes.
- **New site or shared-structure change:** read [site-authoring.md](references/site-authoring.md) and the relevant sections of [layout-principles.md](references/layout-principles.md). Use `assets/static-site-template/` when no reusable structure exists. Before substantial edits, briefly state palette, typography, layout, navigation, shared components and verification choices.
- **Markdown or code highlighting:** read [markdown-pages.md](references/markdown-pages.md). Keep `.md` sources and safe inline JSON payloads synchronized; use the included local tools when using the template.
- **Multilingual site or locale change:** read [multilingual-sites.md](references/multilingual-sites.md). Localize framework and content, and map language links by page id. A single-language task does not require the two-locale template.
- **Layout/shared-component review:** read only relevant sections of [layout-principles.md](references/layout-principles.md), including accessibility when controls change.

References are knowledge to consult for their conditions, not a required sequence or full reading list.

## Core Constraints

The default stack is plain HTML, CSS, JavaScript, optional local Markdown rendering, and local syntax highlighting. Preserve the existing stack; introduce React, build tooling, Tailwind or external CDNs only when already used or explicitly requested. Favor stable reading structure over marketing-page composition.

Put repeated navigation/UI in shared components when building a multi-page site. Keep content pages lean and reading order explicit. For template sites, `pages` drives navigation/index/pager, while `searchIndex` requires its own updates. Keep local vendor files and licenses; DOMPurify must sanitize rendered Markdown before insertion. Safe JSON source serialization protects the earlier HTML parsing stage. Use inline source/search data when `file://` is a requirement, rather than relying on adjacent-file fetch.

## Content Rules

- Preserve supplied technical facts, names, paths, commands, API contracts, code blocks, and code fence language labels.
- Do not invent metrics, diagrams, screenshots, customer logos, quotes, or claims.
- For tutorials and docs, make navigation obvious before adding visual detail.
- For serialized fiction or essays, favor chapter/part navigation, reading progress, and comfortable measure over dashboard-like density.
- Use placeholders only when real assets are missing. Label them plainly, such as `[image: architecture diagram]`.

## Built-In Design Rules

These rules are duplicated here so this skill can stand on its own without activating the `web-design-engineer` skill:

- Gather local design context first. Read existing HTML, CSS, screenshots, and adjacent pages before inventing new styling.
- Match the local visual vocabulary: color ratio, type scale, spacing, border radius, hover/focus states, and density.
- Prefer CSS Grid and Flexbox for layout.
- Use `text-wrap: pretty` for headings and prose where supported.
- Prefer anchor links for page sections. If an iframe preview demonstrates unwanted outer-frame scrolling with `scrollIntoView`, scroll the intended container with `scrollTop` or an explicitly chosen window with `window.scrollTo`. In other contexts, `scrollIntoView` is valid; verify the actual scrolling, focus, and fixed-topbar offsets.
- Avoid AI-style visual clichés: purple-pink-blue gradients, meaningless icon spam, decorative blobs, fake logos, fabricated stats, and oversized marketing heroes for documentation.
- Do not use emoji as icons unless the site already uses emoji as part of its real voice.
- Keep body text at least 16px. Keep touch targets at least 44px on mobile.
- Add hover, focus-visible, active, and disabled states where those states can occur.
- Use generated or sourced images only when the user asks for visuals or when an image materially helps the reader understand the content.

## Verify and Deliver

Select checks from [verification.md](references/verification.md) according to the changed behavior and actual opening mode. For a local edit, inspect the changed page and affected behavior; for shared changes/new sites, cover affected routes and distinct shells, desktop/mobile, navigation and relevant repository checks.

Report the result and checks actually run. State failed or unverified checks with their reason and next step. Browser or dependency unavailability is a validation limit: use available checks, stop unchanged retries, and do not claim unexecuted browser, responsive or sanitizer checks passed. Fix relevant failures within scope and rerun those checks; keep existing unrelated diagnostics separate.
