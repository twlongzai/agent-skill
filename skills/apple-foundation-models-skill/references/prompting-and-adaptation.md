# Prompting And Adaptation

Use this note when prompts become brittle, verbose, or model-version specific.

## Prompt Split
- Put durable role, safety, and tool-use policy in `Instructions`.
- Put request-specific facts and user content in `Prompt`.
- Use `@PromptBuilder` when the prompt has clear sections, examples, or interpolated blocks.
- Prefer delimiters and concrete examples over repeated prose about style.

## Strong Default Pattern

```swift
let session = LanguageModelSession(
    instructions: Instructions {
        "You translate text for a mobile app."
        "Preserve meaning, names, and units."
        "Return concise output without commentary."
    }
)

let response = try await session.respond(
    to: Prompt {
        "Target language: Traditional Chinese"
        "Input text:"
        sourceText
    }
)
```

This keeps stable rules separate from volatile request content.

## When To Prefer Schema Over Prompting
- The UI needs fixed fields.
- Counts or enums matter.
- You keep adding wording like "return exactly three items" or "respond in JSON only".
- A tool or downstream parser depends on stable structure.

In those cases, move the contract into `@Generable` and `@Guide`.

## Updating Prompts For New Model Versions
- Re-test the existing prompt on the new OS or model before rewriting it.
- Remove workaround text that exists only because an older model needed it.
- Re-check few-shot examples; stale examples often hurt more than they help.
- Keep prompts shorter when the newer model already follows the structure well.
- If behavior shifted, change one variable at a time: instructions, examples, schema, then sampling.

## When To Consider Adapters
Optimize prompt, instructions, schema, and tool design first. Consider adapters only if all of these are true:
- the task is repeated and narrow
- the domain vocabulary is specialized
- output format quality is still insufficient after prompt cleanup
- the product can justify the additional evaluation and maintenance cost

If prompt engineering still fails, adapter work is the next step. Do not jump to adapters to compensate for vague prompts.

## Common Review Heuristics
- If the prompt repeats the same rule in multiple places, tighten the split between `Instructions` and `Prompt`.
- If output parsing feels fragile, introduce `@Generable`.
- If the prompt contains large reference blocks every turn, consider tool calling or transcript summarization.
- If latency is the main complaint, check prewarming and unnecessary transcript growth before changing prompts.

## Official Sources To Revisit For API Or Behavior Changes
- [Foundation Models overview](https://developer.apple.com/documentation/foundationmodels)
- [Generating content and performing tasks with Foundation Models](https://developer.apple.com/documentation/foundationmodels/generating-content-and-performing-tasks-with-foundation-models)
- [Prompting an on-device foundation model](https://developer.apple.com/documentation/foundationmodels/prompting-an-on-device-foundation-model)
- [Updating prompts for new model versions](https://developer.apple.com/documentation/foundationmodels/updating-prompts-for-new-model-versions)
