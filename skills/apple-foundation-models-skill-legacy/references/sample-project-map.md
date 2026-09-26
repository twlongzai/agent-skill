# Sample Project Map

**Legacy scope:** This sample collection is only for iOS 26 / macOS 26 or earlier, subject to each API's minimum OS availability. It does not cover new iOS 27 / macOS 27 features; see [What's new in the Foundation Models framework — WWDC26 session 241](https://developer.apple.com/videos/play/wwdc2026/241/).

Open these files first when you need concrete implementation patterns.
All paths below are bundled inside this skill under `references/sample-projects/`. These are selected source excerpts for adaptation in a host project. The bundle does not include complete app projects or dependency manifests. Read the source and host notes before copying or running a sample; importing an excerpt alone is not a supported build target.

## Sources, Versions, And Host Requirements

The original copied revisions were not recorded. File headers and API shapes primarily reflect OS 26-era samples; they do not establish compatibility with every later SDK. Verify the host's deployment target, SDK availability, dependencies, and permissions for the selected excerpt. Model generation needs an Apple Intelligence-capable device, enabled Apple Intelligence, and ready model assets. Compilation alone does not verify model or external-tool behavior.

| Bundle | Upstream and version evidence | Required host context |
| --- | --- | --- |
| FoundationModelsTripPlanner | [Apple sample documentation](https://developer.apple.com/documentation/foundationmodels/adding-intelligent-app-features-with-generative-models), associated with [WWDC25 session 259](https://developer.apple.com/videos/play/wwdc2025/259/). Apple's documentation identifies OS/Xcode 26 introduction. The official archive used to recover its license is recorded below; the original excerpt revision is unknown. | The full Apple project supplies `Landmark`, `Logging`, tool lookup helpers (`Lookup`, categories/suggestions), images, and app configuration. Selected files import SwiftUI, MapKit, and WeatherKit; restore only host services/capabilities needed by the selected feature. |
| FoundationLab | [Rudrank Riyam's upstream repository](https://github.com/rudrankriyam/Foundation-Models-Framework-Lab), formerly `Foundation-Models-Framework-Example` (the Settings link redirects there). Upstream was inspected at [`9e3dd5ae24ba6821626f24bfbbb187f4b88d7efe`](https://github.com/rudrankriyam/Foundation-Models-Framework-Lab/tree/9e3dd5ae24ba6821626f24bfbbb187f4b88d7efe) on 2026-09-26; this is an inspection revision, not a claimed source snapshot for these excerpts. | The host supplies `AppConfiguration`, `DefaultPrompts`, `FoundationModelsErrorHandler`, `PermissionManager`, voice types/services, summary models, transcript/token and string extensions, and theme helpers. Some excerpts need FoundationModelsTools, LumoKit, VecturaKit, LiquidGlasKit, or HighlightSwift. Resolve the appropriate host package versions and capabilities; the current upstream has evolved since these copied excerpts. |
| BookPlaygrounds | Chapter-oriented examples from the same [upstream repository](https://github.com/rudrankriyam/Foundation-Models-Framework-Lab/tree/9e3dd5ae24ba6821626f24bfbbb187f4b88d7efe/BookPlaygrounds). Original copied revision unknown. | Xcode with the `Playgrounds` module and FoundationModels SDK. Run generation only with a ready, eligible device/model. The prewarming examples expose separate composing and submit event methods for a host UI; the playground itself does not submit a request. |

FoundationLab tool excerpts can access or change reminders, calendar, contacts, health, location, music, and network resources. Retain app/tool-level permissions and the user's authorization. A model response alone does not establish that any action occurred. `ToolExecutor` accepts a host `verifyAction` callback to confirm a receipt/app-state check; without one it keeps input and reports only that a response was generated. These external tool implementations are not bundled here. Tool, voice, and UI snippets remain examples to adapt, not a production-readiness certification.

## License Provenance

- `sample-projects/FoundationModelsTripPlanner/LICENSE.txt` is copied byte-for-byte from the top-level `LICENSE.txt` of [Apple's official sample archive](https://docs-assets.developer.apple.com/published/5414fd17db13/AddingIntelligentAppFeaturesWithGenerativeModels.zip), linked by the [Apple documentation data](https://developer.apple.com/tutorials/data/documentation/foundationmodels/adding-intelligent-app-features-with-generative-models.json). Retrieved 2026-09-26; archive SHA-256: `8d0f6e93cdcd93b7ac25a12af4b217c744ab814eb79d90772ca52dfbdad91631`; license SHA-256: `0817cde0fddac2eb0ca60ad88df24595790f3ac5f02ea1da9e13e902974d9711`. Preserve Apple's notice and the original sample headers.
- `sample-projects/FoundationLab/LICENSE` and `sample-projects/BookPlaygrounds/LICENSE` preserve the MIT license from the [inspected upstream revision](https://github.com/rudrankriyam/Foundation-Models-Framework-Lab/blob/9e3dd5ae24ba6821626f24bfbbb187f4b88d7efe/LICENSE), including Rudrank Riyam's 2025 copyright. The original copied revision remains unknown; these license copies do not pin dependency versions.
- Local corrections cover prompt dates, response API spelling, regex whitespace, prewarming event separation, and tool completion/verification states. Retained examples and author headers preserve their original teaching context; check changed behavior in the host before shipping.

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
  Reusable executor that separates response completion from host-verified tool actions and retains input for unverified/failed actions.
- `sample-projects/FoundationLab/Services/ConversationContextBuilder.swift`
  Summarize old transcript content into fresh instructions when context grows too large.
- `sample-projects/FoundationLab/Views/ModelUnavailableView.swift`
  User-facing messaging for Apple Intelligence unavailable reasons.
- `sample-projects/BookPlaygrounds/02_GettingStartedWithSessions/11_BasicPrewarming.swift`
  Basic `prewarm()` from an earlier composing event; submit happens in a separate event with natural lead time.
- `sample-projects/BookPlaygrounds/02_GettingStartedWithSessions/12_PrewarmingWithPromptPrefix.swift`
  `prewarm(promptPrefix:)` from an earlier composing event using the exact submitted prefix; latency improvement is not guaranteed.

## Official Documentation
- [Foundation Models overview](https://developer.apple.com/documentation/foundationmodels)
- [Foundation Models updates](https://developer.apple.com/documentation/updates/foundationmodels)
- [SystemLanguageModel](https://developer.apple.com/documentation/foundationmodels/systemlanguagemodel)
- [Instructions](https://developer.apple.com/documentation/foundationmodels/instructions)
- [Prompt](https://developer.apple.com/documentation/foundationmodels/prompt)
- [Transcript](https://developer.apple.com/documentation/foundationmodels/transcript)
- [GeneratedContent](https://developer.apple.com/documentation/foundationmodels/generatedcontent)
