# Session Patterns

Use these patterns when implementing or reviewing `FoundationModels` code.

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

## Transcript And Context
- Reuse one session when turns should build on each other.
- Recreate the session when instructions or tools materially change.
- If context keeps growing, summarize prior turns and seed a new session with that summary.
- Use transcript inspection only when the feature truly needs it; do not mirror the entire transcript into parallel state without a reason.

## Prewarming

```swift
let session = LanguageModelSession()
session.prewarm()

let prefix = Prompt("You are a helpful writing assistant. The user is asking about:")
session.prewarm(promptPrefix: prefix)
```

Use `prewarm(promptPrefix:)` only when subsequent prompts share the same leading structure.

## Good Local Examples
- `sample-projects/FoundationModelsTripPlanner/Model/Itinerary/ItineraryPlanner.swift`
- `sample-projects/FoundationModelsTripPlanner/Views/Itinerary/LandmarkDescriptionView.swift`
- `sample-projects/FoundationLab/ViewModels/ChatViewModel.swift`
- `sample-projects/FoundationLab/Services/ToolExecutor.swift`
