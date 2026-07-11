# Agent Skills

This repository collects the agent skills we use to make Codex more useful in day-to-day work. Each skill lives under `skills/` and includes a `SKILL.md` file, with supporting references, reusable assets, or agent configuration when the skill needs them.

The goal is practical: keep reusable instructions close to the work they support, make their source clear, and make it easy to improve a skill when we find better patterns.

## Skills

| Skill | Purpose |
| --- | --- |
| `skills/apple-foundation-models-skill` | Helps build, review, and refactor Apple Foundation Models features in SwiftUI apps. |
| `skills/static-website-builder` | Helps build and improve text-first static sites with plain HTML, CSS, and JavaScript, including multilingual navigation, local Markdown rendering, and a reusable template. |
| `skills/swiftui-expert-skill` | Guides SwiftUI implementation, review, architecture, state management, performance, and modern API usage. |
| `skills/web-design-engineer` | Guides visual and interactive front-end work, including pages, prototypes, dashboards, slide decks, and UI mockups. |
| `skills/write-like-human` | Guides drafting, rewriting, polishing, summarizing, tone adaptation, and prose review so writing stays natural, specific, and credible. |

## Attribution

Some skills started from public work and were adapted for this repository:

| Skill | Source |
| --- | --- |
| `skills/web-design-engineer` | Copied from the skill in [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills). |
| `skills/swiftui-expert-skill` | Based on [AvdLee/SwiftUI-Agent-Skill](https://github.com/AvdLee/SwiftUI-Agent-Skill), with added references such as scalable architecture guidance. |

## Original Work

These skills were created for this repository:

- `skills/apple-foundation-models-skill`
- `skills/static-website-builder`
- `skills/write-like-human`

The reusable template in `skills/static-website-builder` includes local copies of Marked, DOMPurify, and PrismJS. See the [vendor notes](skills/static-website-builder/assets/static-site-template/vendor/README.md) for versions and license details.
