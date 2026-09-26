# SwiftUI Engineering and Review Guide

Read only the sections relevant to the task. Use the full checklist for a requested broad review; a local change does not require unrelated architecture, API, or styling work. Resolve API choices against the project’s target platforms, minimum deployment versions, and toolchain.

## Core Guidelines

### Production Architecture
- Keep views thin: render state, compose UI, and forward user intent
- Put screen/feature orchestration in view models: validation, async actions, derived UI state, and user-visible task states
- Keep business rules, network calls, persistence, model lifecycle, and analytics side effects out of SwiftUI views
- Inject dependencies into view models/services; avoid hidden global mutable state and broad `@EnvironmentObject` dependency sprawl
- Use repositories/gateways for external data sources; views should not import `URLSession` or persistence SDKs
- Make navigation explicit with typed routes, `NavigationPath`, or a coordinator/router when flows span screens or need deep links
- Organize growing code by feature, not only by technical layer; reserve shared folders for code used by multiple features
- Treat views around 100 lines as a refactor cue and 300+ line views as urgent architecture debt
- Keep architecture proportional: do not add coordinators or repositories for trivial local-only views

### State Management
- Prefer `@Observable` for new UI models when the deployment target supports Observation (iOS 17, macOS 14, tvOS 17, watchOS 10 or later); preserve compatible `ObservableObject` code when migration is outside scope
- Keep UI-facing models on `@MainActor` unless default isolation already provides it; choose isolation for non-UI models according to their responsibilities
- **Always mark `@State` and `@StateObject` as `private`** (makes dependencies clear)
- Use plain inputs or bindings for values that must follow parent updates. An explicit initializer may seed owned state or a local draft once; document that later inputs do not reset it
- Use `@State` with `@Observable` classes (not `@StateObject`)
- `@Binding` only when child needs to **modify** parent state
- `@Bindable` for injected `@Observable` objects needing bindings
- Use `let` for read-only values; `var` + `.onChange()` for reactive reads
- Legacy: `@StateObject` for owned `ObservableObject`; `@ObservedObject` for injected
- Nested `ObservableObject` doesn't work (pass nested objects directly); `@Observable` handles nesting fine

### Modern APIs
- Use `foregroundStyle()` instead of `foregroundColor()`
- Use `clipShape(.rect(cornerRadius:))` instead of `cornerRadius()`
- Prefer `Tab` on iOS 18+/macOS 15+ and corresponding supported platforms; retain `tabItem()` for earlier targets
- Use `Button` for control actions; use gestures for content interaction or gesture composition
- Use `NavigationStack` instead of `NavigationView`
- Use `navigationDestination(for:)` for type-safe navigation
- Use the two-parameter or no-parameter `onChange()` variant on iOS 17+/macOS 14+; keep a compatible overload for earlier targets
- Use `ImageRenderer` for rendering SwiftUI views
- Use `.sheet(item:)` instead of `.sheet(isPresented:)` for model-based content
- Sheets may own presentation/dismissal intent; delegate business saves to injected models or actions and dismiss only after success
- Use `ScrollViewReader` for programmatic scrolling with stable IDs
- Avoid `UIScreen.main.bounds` for sizing
- Avoid `GeometryReader` when alternatives exist (e.g., `containerRelativeFrame()`)

### Swift Best Practices
- Use modern Text formatting (`.format` parameters, not `String(format:)`)
- Use `localizedStandardContains()` for user-input filtering (not `contains()`)
- Prefer static member lookup (`.blue` vs `Color.blue`)
- Use `.task` for view-lifecycle cancellation; make work cooperate with cancellation and keep detached work explicitly owned
- Use `.task(id:)` for value-dependent tasks

### View Composition
- **Prefer modifiers over conditional views** for state changes (maintains view identity)
- Extract complex views into separate subviews for better readability and performance
- Keep views small for optimal performance
- Break monolithic screens into focused feature components before the parent view starts owning unrelated responsibilities
- Keep view `body` simple and pure (no side effects or complex logic)
- Use `@ViewBuilder` functions only for small, simple sections
- Prefer `@ViewBuilder let content: Content` over closure-based content properties
- Separate business logic into testable models (not about enforcing architectures)
- Action handlers should reference methods, not contain inline logic
- Use relative layout over hard-coded constants
- Views should work in any context (don't assume screen size or presentation style)

### Performance
- Pass only needed values to views (avoid large "config" or "context" objects)
- Eliminate unnecessary dependencies to reduce update fan-out
- Check for value changes before assigning state in hot paths
- Avoid redundant state updates in `onReceive`, `onChange`, scroll handlers
- Minimize work in frequently executed code paths
- Use `LazyVStack`/`LazyHStack` for large lists
- Use stable identity for `ForEach` (never `.indices` for dynamic content)
- Ensure constant number of views per `ForEach` element
- Prepare expensive filtering when inputs change; cache initialization and invalidation must be explicit
- Avoid `AnyView` in list rows
- Profile expensive view updates before changing composition; do not rely on undocumented POD/diffing guarantees
- Suggest image downsampling for concrete performance-sensitive `UIImage(data:)` use cases (optional)
- Avoid layout thrash (deep hierarchies, excessive `GeometryReader`)
- Gate frequent geometry updates by thresholds
- Use `Self._printChanges()` to debug unexpected view updates

### Liquid Glass (supported Apple OS 26+)
**Only adopt when explicitly requested by the user.**
- Use native `glassEffect`, `GlassEffectContainer`, and glass button styles
- Wrap multiple glass elements in `GlassEffectContainer`
- Apply `.glassEffect()` after layout and visual modifiers
- Use `.interactive()` only for tappable/focusable elements
- Use `glassEffectID` with `@Namespace` for morphing transitions

## Quick Reference

### Property Wrapper Selection (Modern)
| Wrapper | Use When |
|---------|----------|
| `@State` | Internal view state (must be `private`), or owned `@Observable` class |
| `@Binding` | Child modifies parent's state |
| `@Bindable` | Injected `@Observable` needing bindings |
| `let` | Read-only value from parent |
| `var` | Read-only value watched via `.onChange()` |

**Legacy (Pre-iOS 17):**
| Wrapper | Use When |
|---------|----------|
| `@StateObject` | View owns an `ObservableObject` (use `@State` with `@Observable` instead) |
| `@ObservedObject` | View receives an `ObservableObject` |

### Modern API Choices

This table includes design preferences as well as API migrations. It is not a list of deprecated APIs. Check the symbol’s availability and deprecation annotations for the project’s SDK. `Button`, `GeometryReader`, `fontWeight`, and ordinary string operations remain valid for their intended purposes.

| Existing API or pattern | Preferred choice when supported |
|------------|-------------------|
| `foregroundColor()` | `foregroundStyle()` |
| `cornerRadius()` | `clipShape(.rect(cornerRadius:))` |
| `tabItem()` | `Tab` API (iOS 18+/macOS 15+; keep compatible fallback) |
| `onTapGesture()` | `Button` for control actions; gestures for content interaction |
| `NavigationView` | `NavigationStack` |
| `onChange(of:) { value in }` | Two-/no-parameter overload (iOS 17+/macOS 14+) |
| `fontWeight(.bold)` | `bold()` |
| `GeometryReader` | `containerRelativeFrame()` or `visualEffect()` |
| `showsIndicators: false` | `.scrollIndicators(.hidden)` |
| `String(format: "%.2f", value)` | `Text(value, format: .number.precision(.fractionLength(2)))` |
| `string.contains(search)` | `string.localizedStandardContains(search)` (for user input) |

### Liquid Glass Patterns
```swift
// For a requested interactive control on a supported non-visionOS platform
if #available(iOS 26, macOS 26, tvOS 26, watchOS 26, *) {
    content
        .padding()
        .glassEffect(.regular.interactive(), in: .rect(cornerRadius: 16))
} else {
    content
        .padding()
        .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16))
}

// Inside the same availability branch: group multiple glass elements
// and use .buttonStyle(.glassProminent) for a prominent glass button.
// These APIs are unavailable on visionOS; use the platform’s native styling.
```

## Review Checklist

### Production Architecture (see `references/scalable-architecture.md`)
- [ ] Views render state and delegate actions instead of owning business logic
- [ ] View models own screen/feature orchestration and long-running task state
- [ ] Network, persistence, analytics, and model lifecycle work are outside SwiftUI views
- [ ] Dependencies are injected instead of hidden behind broad globals or environment sprawl
- [ ] Navigation is explicit and typed when flows cross screens or need deep links
- [ ] Growing files are grouped by feature, with shared code extracted only when reused
- [ ] 100+ line views have been considered for extraction; 300+ line views are actively refactored

### State Management
- [ ] Observation choices match the deployment target and migration scope
- [ ] `@Observable` classes marked with `@MainActor` (if needed)
- [ ] Using `@State` with `@Observable` classes (not `@StateObject`)
- [ ] `@State` and `@StateObject` properties are `private`
- [ ] Parent-synchronized inputs use plain values/bindings; intentional owned-state seeds document their lifetime
- [ ] `@Binding` only where child modifies parent state
- [ ] `@Bindable` for injected `@Observable` needing bindings
- [ ] Nested `ObservableObject` avoided (or passed directly to child views)

### Modern APIs (see `references/modern-apis.md`)
- [ ] Using `foregroundStyle()` instead of `foregroundColor()`
- [ ] Using `clipShape(.rect(cornerRadius:))` instead of `cornerRadius()`
- [ ] Tab API choice matches supported deployment versions
- [ ] Control actions use accessible buttons; gestures retain appropriate interaction semantics
- [ ] Using `NavigationStack` instead of `NavigationView`
- [ ] Avoiding `UIScreen.main.bounds`
- [ ] Using alternatives to `GeometryReader` when possible
- [ ] Image-only buttons have a meaningful accessible name

### Sheets & Navigation (see `references/sheet-navigation-patterns.md`)
- [ ] Using `.sheet(item:)` for model-based sheets
- [ ] Sheet business saves are delegated; errors remain visible and dismissal follows success
- [ ] Using `navigationDestination(for:)` for type-safe navigation

### ScrollView (see `references/scroll-patterns.md`)
- [ ] Using `ScrollViewReader` with stable IDs for programmatic scrolling
- [ ] Using `.scrollIndicators(.hidden)` instead of initializer parameter

### Text & Formatting (see `references/text-formatting.md`)
- [ ] Using modern Text formatting (not `String(format:)`)
- [ ] Using `localizedStandardContains()` for search filtering

### View Structure (see `references/view-structure.md`)
- [ ] Using modifiers instead of conditionals for state changes
- [ ] Complex views extracted to separate subviews
- [ ] Views kept small for performance
- [ ] Container views use `@ViewBuilder let content: Content`

### Performance (see `references/performance-patterns.md`)
- [ ] View `body` kept simple and pure (no side effects)
- [ ] Passing only needed values (not large config objects)
- [ ] Eliminating unnecessary dependencies
- [ ] State updates check for value changes before assigning
- [ ] Hot paths minimize state updates
- [ ] No object creation in `body`
- [ ] Heavy computation moved out of `body`

### List Patterns (see `references/list-patterns.md`)
- [ ] ForEach uses stable identity (not `.indices`)
- [ ] Constant number of views per ForEach element
- [ ] Expensive filtering is prepared with correct initial data and input invalidation
- [ ] No `AnyView` in list rows

### Layout (see `references/layout-best-practices.md`)
- [ ] Avoiding layout thrash (deep hierarchies, excessive GeometryReader)
- [ ] Gating frequent geometry updates by thresholds
- [ ] Business logic separated into testable models
- [ ] Action handlers reference methods (not inline logic)
- [ ] Using relative layout (not hard-coded constants)
- [ ] Views work in any context (context-agnostic)

### Liquid Glass (supported Apple OS 26+)
- [ ] Liquid Glass was requested; all target-platform availability boundaries and fallbacks are valid
- [ ] Multiple glass views wrapped in `GlassEffectContainer`
- [ ] `.glassEffect()` applied after layout/appearance modifiers
- [ ] `.interactive()` only on user-interactable elements
- [ ] Shapes and tints consistent across related elements

## Philosophy

This skill focuses on **durable SwiftUI practice**, not architecture fashion:
- Do not force architecture labels when simpler boundaries solve the problem
- Do require views to stay presentation-focused as features grow
- Do move orchestration, side effects, data access, and navigation policy into explicit collaborators
- Do prioritize modern APIs over deprecated ones
- We emphasize thread safety with `@MainActor` and `@Observable`
- We optimize for performance and maintainability
- We follow Apple's Human Interface Guidelines and API design patterns
