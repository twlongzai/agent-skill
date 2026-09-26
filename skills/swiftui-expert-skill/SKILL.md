---
name: swiftui-expert-skill
description: "Use when implementing, reviewing, or fixing SwiftUI views, state/data flow, navigation, layout, or UI performance, including explicitly requested Liquid Glass styling."
---

# SwiftUI Expert Skill

Keep the change proportional to the user’s request and the project’s existing conventions. Prefer native SwiftUI patterns that the supported platforms and deployment targets can use.

## Choose the relevant guidance

Identify the requested outcome, touched views, target platforms, minimum OS versions, and Swift/toolchain settings from the supplied code or project. If missing information changes an API choice, inspect it or state the assumption. Do not raise deployment targets or migrate unrelated code to satisfy a style preference.

For a local fix, read the relevant reference and any dependency needed to understand that fix. For a new feature, select the references for its actual state, UI, and side effects. For a requested broad review, use `references/review-guide.md` and report only applicable findings. Read additional references when the task exposes a concrete concern.

| Task or concern | Reference |
|---|---|
| Owned/injected state, bindings, Observation, model lifetime | `references/state-management.md` |
| View extraction, identity, reusable containers | `references/view-structure.md` |
| API migration or platform compatibility | `references/modern-apis.md` |
| Lists, stable identity, filtering, enumerated data | `references/list-patterns.md` |
| Layout, sizing, Dynamic Type, action boundaries | `references/layout-best-practices.md` |
| Sheets, save/dismiss behavior, typed navigation | `references/sheet-navigation-patterns.md` |
| Scrolling, anchors, transitions, position tracking | `references/scroll-patterns.md` |
| Text formatting, localization, search, styled text | `references/text-formatting.md` |
| Image loading, failure states, measured decoding costs | `references/image-optimization.md` |
| Slow updates or rendering, profiling, cancellation | `references/performance-patterns.md` |
| Large-feature refactoring, business/data/navigation boundaries | `references/scalable-architecture.md` |
| Explicitly requested Liquid Glass or maintenance of existing glass | `references/liquid-glass.md` |
| Comprehensive engineering guidance and review checklist | `references/review-guide.md` |

## Defaults and boundaries

- Keep owned view state private; choose plain values, bindings, or observable inputs according to ownership and mutation needs. Preserve intentional one-time state initialization and draft editing semantics.
- Use Observation when the deployment target supports it. Isolate UI-facing mutable models appropriately; preserve compatible legacy patterns when migration is outside scope.
- Keep `body` presentation-focused. Move multi-step business operations and data access into explicit collaborators when the feature needs those boundaries. Tiny local components need no new architecture layers.
- Use stable identities for dynamic collections and preserve state across intended view updates.
- Prefer accessible controls and adaptive layout. Native API preferences are conditional on availability and intent, not automatic deprecation findings.
- Treat performance changes as hypotheses to verify with the relevant workload or Instruments. Keep useful extraction and narrow-dependency patterns without promising undocumented diffing behavior.
- Async examples should cover the loading, success, failure, input-change, and cancellation behavior relevant to the operation. A cancellation signal alone does not stop noncooperative or detached work.
- Adopt Liquid Glass only when explicitly requested. When maintaining existing glass, keep that work within scope. Check every supported platform’s availability, including helper declarations; do not apply iOS checks to an incompatible platform. Keep fallbacks for supported older systems.
- Suggest image downsampling only for a concrete performance-sensitive use case; it is an optional optimization.

## Completion and limitations

Match verification to the changed behavior. For code changes, run the project’s smallest relevant build/test where available, checking supported deployment targets and concurrency settings. For state, collection, image, or save-flow fixes, exercise the relevant initial, changed-input, error, and cancellation paths. Verify visual or accessibility changes with an appropriate preview/device when available; profile performance claims before reporting an improvement. A small text/layout edit does not require unrelated architecture checks or a full performance suite.

Report the result, material changes, checks actually performed, and remaining limitations. For review-only tasks, give evidence and impact without making unrequested edits. If a check fails, resolve it within scope or report the specific failure and blocker; if the environment cannot run it, state what remains unverified and why. Do not claim a successful build, runtime behavior, or performance gain from inspection alone.
