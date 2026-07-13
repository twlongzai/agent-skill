# Agent Skills

This repository collects reusable skills for Codex, Claude Code and Claude Cowork, Gemini CLI and Google Antigravity, and GitHub Copilot. Each skill follows the open Agent Skills format: a folder under `skills/` with a required `SKILL.md` and optional references, assets, scripts, or agent-specific metadata.

The canonical copy of every skill lives under `skills/`. Install or link those folders into the discovery directory used by your agent; do not maintain separate edited copies for each product.

## Installation and Usage

Choose the guide for your agent. Each guide includes project and personal installation, configuration, verification, invocation examples, updates, and removal.

| Agent | Guide |
| --- | --- |
| OpenAI Codex | [Codex installation and usage](docs/CODEX.md) |
| Claude Code or Claude Cowork | [Claude installation and usage](docs/CLAUDE.md) |
| Gemini CLI or Google Antigravity | [Gemini and Google AI installation and usage](docs/GEMINI.md) |
| GitHub Copilot | [Copilot installation and usage](docs/COPILOT.md) |

The shared `name` and `description` frontmatter is intentionally portable. Files under a skill's `agents/` directory are optional product metadata; an agent that does not recognize one of those files can ignore it and still use the skill through `SKILL.md`.

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
