# Sample Project Map

Open these files first when you need concrete implementation patterns.
All paths below are bundled inside this skill under `references/sample-projects/`.

## Apple Sample Project
- `sample-projects/FoundationModelsTripPlanner/Views/Itinerary/TripPlanningView.swift`
  Availability-driven UI branching for `.available`, `.appleIntelligenceNotEnabled`, and `.modelNotReady`.
- `sample-projects/FoundationModelsTripPlanner/Model/Itinerary/ItineraryPlanner.swift`
  Long-lived session with `Instructions`, tool calling, structured streaming, `includeSchemaInPrompt: false`, and `prewarm()`.
- `sample-projects/FoundationModelsTripPlanner/Model/Itinerary/FindPointsOfInterestTool.swift`
  Minimal `Tool` surface with `@Generable` arguments.
- `sample-projects/FoundationModelsTripPlanner/Model/Itinerary/Itinerary.swift`
  Good `@Generable` and `@Guide` examples for nested structured output.
- `sample-projects/FoundationModelsTripPlanner/Views/Itinerary/LandmarkDescriptionView.swift`
  `SystemLanguageModel(useCase: .contentTagging)` with partially generated structured streaming.

## Foundation Lab Example Project
- `sample-projects/FoundationLab/ViewModels/ChatViewModel.swift`
  Reusable session ownership, `session.isResponding`, transcript-driven chat, streaming cancellation, and prompt-prefix prewarming.
- `sample-projects/FoundationLab/Services/ToolExecutor.swift`
  Small reusable executor for tool-backed sessions.
- `sample-projects/FoundationLab/Services/ConversationContextBuilder.swift`
  Summarize old transcript content into fresh instructions when context grows too large.
- `sample-projects/FoundationLab/Views/ModelUnavailableView.swift`
  User-facing messaging for Apple Intelligence unavailable reasons.
- `sample-projects/BookPlaygrounds/02_GettingStartedWithSessions/11_BasicPrewarming.swift`
  Basic `prewarm()` example.
- `sample-projects/BookPlaygrounds/02_GettingStartedWithSessions/12_PrewarmingWithPromptPrefix.swift`
  `prewarm(promptPrefix:)` example.

## Official Documentation
- [Foundation Models overview](https://developer.apple.com/documentation/foundationmodels)
- [Foundation Models updates](https://developer.apple.com/documentation/updates/foundationmodels)
- [SystemLanguageModel](https://developer.apple.com/documentation/foundationmodels/systemlanguagemodel)
- [Instructions](https://developer.apple.com/documentation/foundationmodels/instructions)
- [Prompt](https://developer.apple.com/documentation/foundationmodels/prompt)
- [Transcript](https://developer.apple.com/documentation/foundationmodels/transcript)
- [GeneratedContent](https://developer.apple.com/documentation/foundationmodels/generatedcontent)
