# Session Patterns

Use these patterns when implementing or reviewing `FoundationModels` code.

## Choose The Affected Pattern

For open-ended generation, use `SystemLanguageModel.default` or `SystemLanguageModel(useCase: .general)`. Use `.contentTagging` for a matching tagging/classification task. Check APIs against the project's SDK; these excerpts primarily illustrate the OS 26 on-device APIs.

Use `respond(to:)` for one-shot text, typed `respond(to:generating:)` for complete structured results, and `streamResponse` when partial text or `PartiallyGenerated` fields benefit the UI. Dynamic `GeneratedContent` is useful when a static `@Generable` type cannot describe the schema.

## Availability Gate

```swift
import FoundationModels

let model = SystemLanguageModel.default

switch model.availability {
case .available:
    break
case .unavailable(let reason):
    // Map reason to explicit UI state.
    print(reason)
}
```

Use `model.availability` when the UI must explain why the feature is blocked. Use `model.isAvailable` only when a simple boolean gate is enough.

## Plain Text Response

```swift
let session = LanguageModelSession()
let response = try await session.respond(to: Prompt("Summarize this note."))
let text = response.content
```

Use this for one-shot text output with no need for partial rendering or typed schema.

## Instructions Plus Prompt

```swift
let session = LanguageModelSession(
    instructions: Instructions {
        "You are a concise travel assistant."
        "Answer in short paragraphs."
    }
)

let response = try await session.respond(to: Prompt("Plan a two-day trip to Tainan."))
```

Keep durable rules in `Instructions`. Keep request data in `Prompt`.

## Structured Generation

```swift
@Generable
struct Summary {
    @Guide(description: "One sentence overview")
    let overview: String

    @Guide(description: "Exactly three key points", .count(3...3))
    let bullets: [String]
}

let session = LanguageModelSession()
let response = try await session.respond(
    to: Prompt("Summarize the following meeting transcript..."),
    generating: Summary.self
)
```

Prefer this over post-processing raw strings when your UI or downstream logic needs predictable fields.

## Streaming Structured Output

```swift
@State private var partial: Summary.PartiallyGenerated?

let stream = session.streamResponse(
    to: Prompt("Summarize this transcript..."),
    generating: Summary.self,
    options: GenerationOptions(sampling: .greedy)
)

for try await update in stream {
    partial = update.content
}
```

Use this when the UI can render partially generated fields as they arrive.

## Tool Calling

```swift
@Observable
final class WeatherTool: Tool {
    let name = "weather"
    let description = "Fetches current weather for a city."

    @Generable
    struct Arguments {
        @Guide(description: "City name to look up")
        let city: String
    }

    func call(arguments: Arguments) async throws -> String {
        "Taipei is 23C and cloudy."
    }
}

let session = LanguageModelSession(tools: [WeatherTool()])
let response = try await session.respond(to: Prompt("What is the weather in Taipei?"))
```

Tools should expose the smallest argument surface that still lets the model do the job reliably.

Keep descriptions precise and results compact. If a workflow always needs a tool, specify that requirement in `Instructions`; the app still needs evidence of the tool's result. A normal model reply can be a refusal or can omit the tool call. Report generation completion separately from a verified action; only clear input or claim action success after a tool receipt or app-state check confirms it. Preserve app permissions and existing user authorization in the tool implementation.

## Streaming Lifecycle And Errors

Use `session.isResponding` for loading/concurrency state. Keep a cancellable task for long-lived streams; cancel it on view departure or replacement and distinguish cancellation from a failed generation. Surface unavailable, refused, context-limit, and tool-failure states as appropriate to the feature. After an uncertain side-effecting tool outcome, reconcile app state before retrying.

## Transcript And Context
- Reuse one session when turns should build on each other.
- Recreate the session when instructions or tools materially change.
- If context keeps growing, summarize prior turns and seed a new session with that summary.
- Bound or chunk summary input so recovery does not exceed the same context limit. Keep summaries of user content separate from durable safety policy.
- Use transcript inspection only when the feature truly needs it; do not mirror the entire transcript into parallel state without a reason.

## Prewarming

```swift
let session = LanguageModelSession()
session.prewarm()

let prefix = Prompt("You are a helpful writing assistant. The user is asking about:")
session.prewarm(promptPrefix: prefix)
```

Use `prewarm(promptPrefix:)` only when subsequent prompts share the same leading structure.

Call prewarming from an earlier interaction, such as the user beginning to type, when the next request is likely and there is at least one second of lead time. Do not insert a delay just to prewarm. Resource loading and a speedup are not guaranteed; measure latency on the target device when performance is the task.

## Conditional Project Pattern: Unison Alignment

Apply this pattern when the project's instructions or existing architecture explicitly use Unison conventions: keep UI state in `@Observable`, `@MainActor` view models; prefer an actor-owned engine/coordinator for shared session lifecycle; expose checking, ready, and failed states. Preserve its offline-first inference path once the model is available. In other projects, retain their ownership and state conventions; a focused prompt or availability edit does not require adopting this architecture.

## Good Local Examples
- `sample-projects/FoundationModelsTripPlanner/Model/Itinerary/ItineraryPlanner.swift`
- `sample-projects/FoundationModelsTripPlanner/Views/Itinerary/LandmarkDescriptionView.swift`
- `sample-projects/FoundationLab/ViewModels/ChatViewModel.swift`
- `sample-projects/FoundationLab/Services/ToolExecutor.swift`
