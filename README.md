# Agent Skills

This repository collects reusable skills for Codex, Claude Code and Claude Cowork, Gemini CLI and Google Antigravity, and GitHub Copilot. Each skill follows the open Agent Skills format: a folder under `skills/` with a required `SKILL.md` and optional references, assets, scripts, or agent-specific metadata.

The canonical copy of every skill lives under `skills/`. Install or link those folders into the discovery directory used by your agent; do not maintain separate edited copies for each product.

The instructions are maintained for **GPT-6 Astra, GPT-6 Sol, and GPT-6 Luna** as the agents using these skills. This scope does not replace the Apple on-device models discussed by the Foundation Models skill. The other installation guides below describe portable packaging, not validation of other models.

Each `SKILL.md` provides task routing, essential constraints, and completion criteria. Read detailed references only for the task at hand. A local correction does not require a new architecture, every reference, or a full-project audit. Keep useful examples and operational safeguards even when simplifying an entrypoint.

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

Choose by the requested work:

- Use `static-website-builder` for text-first static reading sites and their navigation, local Markdown, or language structure; use `web-design-engineer` for visual and interactive web design. Existing project tooling and scope take precedence over a starter template.
- Use `apple-foundation-models-skill` for the Foundation Models integration; add `swiftui-expert-skill` when the work also needs SwiftUI-specific state, layout, navigation, or rendering guidance.
- Use `write-like-human` for an actual prose drafting or editing task. A small correction may leave already suitable wording unchanged.

Combine skills only when their distinct capabilities help the request. Shared constraints may intentionally appear in independently installable skills; do not remove them solely because another skill contains similar wording.

## Verification and Limitations

Completion depends on the requested outcome and the affected behavior. Run relevant available checks, fix failures caused by the change, and report checks that could not run. Static inspection is not a browser pass, a snippet parse is not a full app build, and a model response is not proof that a tool action succeeded.

The static-site assets are a reusable template with local dependencies. The Apple examples include host-dependent excerpts, not complete buildable applications; consult their [sample map](skills/apple-foundation-models-skill/references/sample-project-map.md) for dependencies, provenance, and limits. Browser/OS compatibility and device behavior must be checked in the consuming project.

Maintenance checks do not establish faster execution or better output from Astra, Sol, or Luna. Compare representative tasks separately on each model before claiming a model-specific improvement. Preserve a recoverable copy before replacing or removing existing skill files.

For changes to the bundled templates and examples, these focused checks require Node.js and no package installation:

```bash
node skills/static-website-builder/scripts/check-template.cjs
node skills/web-design-engineer/scripts/check-examples.mjs
```

They exercise source synchronization, navigation/search contracts, failure handling, and timeline/slide behavior. They do not replace relevant browser or Swift project checks. The static-site skill also includes `sync-markdown.cjs` to safely regenerate a specified HTML shell's inline Markdown; see its `--help` and the skill's Markdown reference before use.

The entrypoint and routing approach follows [OpenAI's guidance on rethinking skills and prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra), with detailed support retained for all three target models.

## Attribution

Some skills started from public work and were adapted for this repository:

| Skill | Source |
| --- | --- |
| `skills/web-design-engineer` | Copied from the skill in [ConardLi/garden-skills](https://github.com/ConardLi/garden-skills). |
| `skills/swiftui-expert-skill` | Based on [AvdLee/SwiftUI-Agent-Skill](https://github.com/AvdLee/SwiftUI-Agent-Skill), with added references such as scalable architecture guidance. |
| Apple Foundation Models example excerpts | See the [sample provenance and dependency notes](skills/apple-foundation-models-skill/references/sample-project-map.md); retain their upstream notices and sample-specific licenses. |

## Original Work

These skill instructions were created for this repository; bundled third-party examples and libraries retain their own attribution:

- `skills/apple-foundation-models-skill`
- `skills/static-website-builder`
- `skills/write-like-human`

The reusable template in `skills/static-website-builder` includes local copies of Marked, DOMPurify, and PrismJS. See the [vendor notes](skills/static-website-builder/assets/static-site-template/vendor/README.md) for versions and license details.
