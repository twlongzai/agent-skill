# SwiftUI Scalable Architecture Reference

Use this reference when a SwiftUI task is about long-term maintainability, refactoring large views, separating business logic, adding navigation/data boundaries, or preventing a prototype from turning into a fragile production codebase.

## Core Boundary

SwiftUI scales when each layer has a small job:

| Layer | Owns | Avoids |
|-------|------|--------|
| View | Rendering, layout, local visual state, user intent forwarding | API calls, persistence, validation rules, route policy |
| ViewModel | Screen/feature state, validation, async orchestration, derived presentation values | Rendering details and direct UI layout concerns |
| Service/Actor | Model lifecycle, inference, network clients, expensive or serialized work | Direct SwiftUI view dependencies |
| Repository/Gateway | Data source selection, caching, persistence, network/local merge behavior | View-specific branching |
| Router/Coordinator | Cross-screen navigation, route mapping, deep links | Business rules unrelated to navigation |

The exact names can vary by project. The boundary matters more than the label.

## Refactor Triggers

Treat these as architecture debt signals:

- A view is around 100 lines and has multiple responsibilities
- A view file is 300+ lines
- `body` contains validation, data mapping, filtering, sorting, or async setup that is not strictly visual
- Button closures contain multi-step business logic instead of calling a method
- A view imports networking, database, analytics, inference, or persistence frameworks
- `@State` stores domain state that must survive navigation or coordinate with other screens
- `@EnvironmentObject` is used as a broad dependency bus
- Navigation routes are duplicated across multiple views
- Deep linking would require rewriting the navigation structure
- Changes in one feature unexpectedly affect unrelated screens

## ViewModel Guidance

Use a view model when state has behavior, async work, validation, or lifecycle rules.

```swift
@Observable
@MainActor
final class TranslateViewModel {
    enum Status: Equatable {
        case checkingModel
        case ready
        case translating
        case failed(String)
    }

    private let engine: TranslationEngine

    var sourceText = ""
    var translatedText = ""
    var status: Status = .checkingModel

    init(engine: TranslationEngine) {
        self.engine = engine
    }

    func translate() async {
        guard case .ready = status else { return }
        status = .translating

        do {
            translatedText = try await engine.translate(sourceText)
            status = .ready
        } catch {
            status = .failed(error.localizedDescription)
        }
    }
}
```

Keep view models focused:

- One view model per screen or cohesive feature flow
- Prefer explicit dependencies in initializers
- Represent long-running work with visible states such as checking, ready, running, and failed
- Keep domain logic testable without rendering a SwiftUI view
- Avoid putting layout-only state in the view model unless it affects behavior or persistence

## View Guidance

Views should mostly compose UI and call named actions:

```swift
struct TranslateView: View {
    @State private var viewModel: TranslateViewModel

    init(engine: TranslationEngine) {
        _viewModel = State(wrappedValue: TranslateViewModel(engine: engine))
    }

    var body: some View {
        Form {
            TextEditor(text: $viewModel.sourceText)

            Button("Translate") {
                Task { await viewModel.translate() }
            }
            .disabled(!canTranslate)
        }
    }

    private var canTranslate: Bool {
        if case .ready = viewModel.status {
            return !viewModel.sourceText.isEmpty
        }
        return false
    }
}
```

Keep local `@State` for purely visual concerns such as selected tabs, focus state, transient sheet selection, animation flags, and small form fields that do not affect feature behavior outside the view.

## Data Boundaries

Use repositories or gateways when a feature reads or writes external data:

- Hide whether data comes from network, SQLite, files, keychain, cache, or an actor
- Keep data mapping and persistence details out of views
- Inject repositories into view models or services
- Start with a lightweight concrete type when protocols add no value
- Introduce protocols when tests, previews, alternate stores, or platform splits need substitution

Avoid this shape:

```swift
struct ProfileView: View {
    var body: some View {
        Button("Load") {
            Task {
                let url = URL(string: "https://example.com/profile")!
                let data = try await URLSession.shared.data(from: url).0
                // parse and mutate UI state here
            }
        }
    }
}
```

Prefer this shape:

```swift
@Observable
@MainActor
final class ProfileViewModel {
    private let repository: ProfileRepository
    var profile: Profile?

    init(repository: ProfileRepository) {
        self.repository = repository
    }

    func load() async throws {
        profile = try await repository.fetchProfile()
    }
}
```

## Navigation Boundaries

Use local `NavigationStack` state for simple, isolated screens. Add explicit route ownership when navigation:

- Spans multiple screens
- Needs deep links
- Needs restoration
- Is shared by multiple entry points
- Has modal and push flows that interact

Prefer typed routes:

```swift
enum AppRoute: Hashable {
    case history
    case phraseDetail(id: Phrase.ID)
    case settings
}
```

Map deep links and user intents to route values instead of scattering navigation decisions across child views.

## Feature Organization

When a feature grows, group by user-facing capability before grouping by technical type:

```text
Features/
  Translate/
    TranslateView.swift
    TranslateViewModel.swift
    TranslateRoute.swift
    TranslationRepository.swift
  History/
    HistoryView.swift
    HistoryViewModel.swift
Shared/
  DesignSystem/
  Persistence/
  Networking/
```

Use shared folders only for code with real cross-feature reuse. Avoid turning `Views/`, `ViewModels/`, and `Services/` into catch-all folders where ownership is unclear.

## Scale-Proportional Defaults

Do not add ceremony just because a pattern exists:

- A tiny local-only component can use `@State`
- A static settings screen may not need a repository
- A single push destination can keep navigation local
- A one-off helper can stay private until reused

Add boundaries when the feature has side effects, multiple screens, shared state, persistence, deep links, testing needs, or repeated logic.
