---
name: apple-foundation-models-skill
description: "Build or review Apple Foundation Models features in SwiftUI. Use for availability, LanguageModelSession, prompts, streaming, structured output, tool calling, prewarming, and model adaptation."
---

# Apple Foundation Models Skill

## Overview
Use this skill for on-device generative features built with `FoundationModels` on iOS, iPadOS, macOS, or visionOS. Focus on correct availability handling, durable `LanguageModelSession` design, concise prompting, structured generation, streaming UX, and tool integration that stays local-first unless the product explicitly requires network access.

## Quick Start
- Check `SystemLanguageModel.default.availability` before exposing model-backed actions.
- Keep long-lived session state out of SwiftUI views when the feature is conversational or streams over time.
- Put durable policy and role constraints in `Instructions`; keep request data in `Prompt`.
- Prefer `@Generable` and `@Guide` for typed output before falling back to raw text parsing.
- Use `streamResponse` for chat, progressive rendering, or partially generated structured content.
- Use `prewarm()` only when the user is likely to invoke the feature soon.

## Workflow

### 1. Gate on availability first
- Read `references/session-patterns.md` for concrete patterns.
- Branch explicitly on `.available` vs `.unavailable(reason)`.
- Distinguish `deviceNotEligible`, `appleIntelligenceNotEnabled`, and `modelNotReady`.
- Disable actions until the model is ready.
- If the current app has required readiness states, preserve them instead of inventing new ones.

### 2. Choose the model and session shape
- Use `SystemLanguageModel.default` or `.general` for open-ended generation.
- Use a specialized use case such as `.contentTagging` for tagging, extraction, or classification-style work when it matches the task.
- Keep one `LanguageModelSession` alive per conversation or workflow. Recreate it only when the model, instructions, or tools materially change.
- If multiple views share the same model-backed workflow, move session ownership into a service or actor boundary and let the view model orchestrate UI state.

### 3. Choose the output mode deliberately
- Use `respond(to:)` for plain text completion.
- Use `respond(generating:)` for typed structured results.
- Use `streamResponse(to:)` for token-like text streaming.
- Use `streamResponse(generating:)` when the UI should render `PartiallyGenerated` structured output as it arrives.
- Use `GeneratedContent` only when the schema is dynamic enough that a static `@Generable` type is a poor fit.

### 4. Design prompts with a stable split
- Read `references/prompting-and-adaptation.md` when changing prompts or evaluating adapters.
- Put long-lived behavior in `Instructions`.
- Put request-specific facts, user text, and examples in `Prompt` or `@PromptBuilder`.
- Prefer short, explicit constraints over broad style prose.
- If the task needs shape guarantees, use schema and guides instead of adding more English instructions.
- Keep prompts compact so transcript history and tool results still fit in context.

### 5. Add tools only when the model needs outside facts or app actions
- Define strongly typed tool arguments with `@Generable`.
- Make tool descriptions precise enough that the model can choose them correctly.
- Return compact task-shaped results, not unbounded dumps.
- For workflows that always need a tool, say so explicitly in `Instructions`.

### 6. Treat transcript and streaming as product features
- Reuse the same session when prior turns should influence the next answer.
- Use `session.isResponding` to drive loading state and cancellation affordances.
- Cancel in-flight streaming tasks when the user leaves the screen or starts a new request.
- When context grows too large, summarize prior turns and start a fresh session with updated instructions instead of blindly appending forever.

### 7. Use prewarming narrowly
- Call `prewarm()` when a feature is about to be used.
- Call `prewarm(promptPrefix:)` only when many requests share a stable leading prompt or instruction prefix.
- Avoid broad startup prewarming unless the feature is the primary app path and latency matters more than memory pressure.

## Unison Alignment
- Preserve the offline-first inference path once the model is available.
- Keep UI state in `@Observable` and `@MainActor` view models.
- Prefer an actor-owned engine or coordinator for session lifecycle and model state.
- Surface explicit user-visible states for model checking, ready, and failed.

## Load These References As Needed
- `references/session-patterns.md`
- `references/prompting-and-adaptation.md`
- `references/sample-project-map.md`
- `references/sample-projects/` for bundled local Swift example files copied into this skill

## Default Deliverable
When using this skill, prefer changes that:
- add readiness gating before model use
- keep prompts and instructions explicit in code
- use typed generation for structured outputs
- preserve cancellation and streaming correctness
- note OS or device constraints when they affect behavior
