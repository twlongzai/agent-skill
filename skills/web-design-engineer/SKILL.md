---
name: web-design-engineer
description: "Build or improve interactive front ends: pages, dashboards, React prototypes, HTML slide decks, CSS/JS animation, UI mockups, data visualization, and design systems. Not for backend-only tasks."
---

# Web Design Engineer

Build usable, visually coherent web deliverables that meet the brief. In an existing repository, preserve its framework, dependencies, file layout, and design system. This skill applies to visual implementation and review, not unrelated backend or data-processing work.

## Choose the Needed Guidance

| Task | Read / do |
| --- | --- |
| Local UI correction | Inspect the affected component, nearby styles, and relevant checks. Make the smallest complete change; no new design system, variants, or whole-app audit is required. |
| New design, substantial redesign, or visual review | Use [workflow and design](references/workflow-and-design.md) for context, composition, exploration, and collaboration. |
| Standalone HTML / inline React prototype | Use [standalone prototypes](references/standalone-prototypes.md) for script loading, verified CDN examples, and file organization. These rules do not replace an app's module system. |
| Prototype, HTML deck, dashboard, or animation | Read only the relevant section of [output guides](references/output-guides.md). |
| Reusable component example | Use the contents of [advanced patterns](references/advanced-patterns.md) to find the needed slide, frame, timeline, theme, or chart example. Adapt its stated host assumptions. |

Read supporting material only when the task needs it. For an existing text-first documentation site, preserve its navigation and content structure; a visual task does not authorize a framework or site-architecture migration.

## Constraints That Apply Throughout

- Follow the user's requested scope, supplied assets, and design system. Ask only for missing decisions that materially affect the result and cannot be inferred.
- Preserve real content and facts. Do not invent data, logos, testimonials, or proof. Label missing assets and data clearly.
- Keep network-dependent assets within existing authorization. Preserve pinned dependencies and integrity checks; use verified local resources when a CDN cannot be used.
- Font, color, and layout suggestions are contextual. Prioritize readability, language coverage, accessibility, and brand fit over a blanket aesthetic ban.
- Add variants or a Tweaks panel only when useful for requested exploration; do not add them to production UI without a request.
- Preserve user-requested checkpoints. Otherwise continue from a first pass through the agreed implementation and relevant verification without asking permission at every reversible step. This does not authorize publishing, external writes, or unrelated changes.

## Completion and Failure Handling

Define success from the requested deliverable: a local fix corrects the affected behavior; a new artifact includes its agreed content, states, and usable interaction paths; a review returns located findings with impact.

For changed code, run the project's relevant checks and inspect affected UI when a browser is available. Select target viewports and keyboard/focus, loading/error, theme, and motion checks according to the change. Look for overflow, broken links, script errors, inaccessible controls, and unintended differences from the brief. Do not require every page or every possible state for a local change.

Fix failures caused by the change and rerun affected checks. Distinguish existing unrelated console warnings from new problems. If a browser, dependency, or preview is unavailable, use meaningful static checks, explain the blocker and the unverified behavior, and do not report a visual pass. Stop retries when the same external limitation persists without a new remedy.

Deliver the requested result with a short account of what changed, what was actually checked, and any remaining limitations. A placeholder first pass or subjective showcase score is not the completion criterion.

## Maintaining the Examples

For changes to the timeline or slide code, run `node scripts/check-examples.mjs`. It checks deterministic behavior without a browser; rendered interaction and React integration still need a browser check when affected.
