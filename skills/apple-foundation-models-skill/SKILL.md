---
name: apple-foundation-models-skill
description: "Use when building, reviewing, or refactoring SwiftUI features that use Apple's FoundationModels framework, including LanguageModelSession, on-device availability, guided generation, streaming, tools, and model-specific prompts."
---

# Apple Foundation Models Skill

Use this skill for on-device `FoundationModels` features on iOS, iPadOS, macOS, or visionOS. Preserve the local inference path and the app's existing architecture, readiness states, permissions, and user authorization. Add network access when the product requires it.

## Route By Task

Choose the relevant path; a prompt edit or focused review needs only the references and checks that bear on that change.

| Task | Read and do | Completion evidence |
| --- | --- | --- |
| Review existing code | Read the relevant session, output, streaming, or tool pattern in `references/session-patterns.md`; inspect the affected caller and lifecycle. | Report actionable findings with file locations, effect, and evidence; distinguish static conclusions from runtime assumptions. State when no issue was found. |
| Implement or refactor | Check target OS/SDK and the app's existing availability gate; use `references/session-patterns.md` for the affected behavior and `references/sample-project-map.md` for a concrete example. | Verify the changed path with the smallest useful check: compilation for API changes, lifecycle/error checks for streaming, or tool-result checks for actions. Report checks run and remaining device requirements. |
| Adjust prompts or generation quality | Read `references/prompting-and-adaptation.md`; preserve the Apple device model's useful examples and schema constraints. Change one variable at a time. | Compare representative inputs against the task's quality requirements on the target OS/model when available. Report the comparison, or label the edit as unvalidated when generation cannot be run. |
| Evaluate an adapter | Read the version and deployment constraints in `references/prompting-and-adaptation.md` before proposing training. | Establish target OS/model compatibility, an evaluation dataset, and deployment requirements before recommending adapter work. |

## Core Decisions

- Gate model-backed actions on `SystemLanguageModel.default.availability`; distinguish `deviceNotEligible`, `appleIntelligenceNotEnabled`, and `modelNotReady` when the UI needs reasons. Keep required app readiness states.
- Put durable policy and role constraints in `Instructions`, and request facts and user content in `Prompt` or `@PromptBuilder`.
- Use `@Generable` and `@Guide` for predictable fields, counts, or enums; use dynamic `GeneratedContent` when a static type is unsuitable.
- Reuse a session for related conversation turns. Follow existing ownership; long-lived or shared workflows may need a service, view model, or actor.
- Use streaming when partial rendering benefits the UI. Cancel in-flight work on departure or replacement, and avoid overlapping requests on one session.
- Return compact tool results. Treat a generated reply and a verified tool action as separate outcomes; preserve input after failure or an unverified action.
- Prewarm when an upcoming user interaction gives at least one second of useful lead time. Loading and latency improvements are not guaranteed.

## Evidence And Limits

If the SDK, host dependencies, eligible device, model readiness, permissions, or required data are unavailable, complete the independent work and identify the exact unverified behavior and the next check. Do not report an unrun build, generation, or external action as successful. Avoid retrying a side-effecting tool until its previous outcome is known.

Scope verification to the task: a prose-only prompt review does not require a full app build. Read sample provenance and host requirements before copying or attempting to run an excerpt. Keep tool authorization enforced in app/tool code; prompt instructions do not grant system permissions.

When evaluating this skill's routing or workload, test GPT-6 Astra, Sol, and Luna separately. Results from one model do not establish the others' behavior. These agent tests are separate from generation-quality tests of Apple's on-device model.

## References On Demand

- `references/session-patterns.md`: availability, session/output selection, streaming, tools, context, prewarming, and conditional project architecture.
- `references/prompting-and-adaptation.md`: prompt design, OS/model changes, schema, and OS 26 adapter constraints.
- `references/sample-project-map.md`: specific local examples, upstream sources, host dependencies, licenses, and validation limits.
