# Modern SwiftUI APIs Reference

## Overview

This reference distinguishes API migrations from design preferences. Use APIs supported by the project’s target platforms and minimum deployment versions; preserve compatible code when migration is outside the request. A preferred alternative does not imply that the existing API is deprecated.

| API / pattern | Relevant iOS / macOS minimum | Guidance |
|---|---|---|
| `foregroundStyle`, materials | iOS 15 / macOS 12 | Prefer when supported; check the particular overload |
| `NavigationStack`, `scrollIndicators`, `ImageRenderer` | iOS 16 / macOS 13 | Retain supported earlier navigation/rendering alternatives |
| Observation, two-/no-parameter `onChange`, `.rect(cornerRadius:)`, `containerRelativeFrame`, `visualEffect` | iOS 17 / macOS 14 | Use compatibility alternatives for earlier targets |
| `Tab` | iOS 18 / macOS 15 | Use `tabItem()` for earlier supported OS versions |
| Liquid Glass | iOS/macOS/tvOS/watchOS 26; unavailable on visionOS | See the dedicated reference only when relevant |

Check Apple symbol documentation or the installed SDK for other platforms and exact overloads. `Button` versus a gesture, `bold` versus `fontWeight`, and geometry choices are semantic/design decisions rather than blanket deprecations.

## Styling and Appearance

### foregroundStyle() vs foregroundColor()

Prefer `foregroundStyle()` when the target and required overload support it.

```swift
// Modern (Correct)
Text("Hello")
    .foregroundStyle(.primary)

Image(systemName: "star")
    .foregroundStyle(.blue)

// Legacy (Avoid)
Text("Hello")
    .foregroundColor(.primary)
```

**Why**: `foregroundStyle()` supports hierarchical styles, gradients, and materials, making it more flexible and future-proof.

### clipShape() vs cornerRadius()

For modern targets, prefer `clipShape(.rect(cornerRadius:))`; use `clipShape(RoundedRectangle(cornerRadius:))` when supporting earlier versions.

```swift
// Modern (Correct)
Image("photo")
    .clipShape(.rect(cornerRadius: 12))

VStack {
    // content
}
.clipShape(.rect(cornerRadius: 16))

// Legacy (Avoid)
Image("photo")
    .cornerRadius(12)
```

**Why**: `cornerRadius()` is deprecated. `clipShape()` is more explicit and supports all shape types.

### fontWeight() vs bold()

**Don't apply `fontWeight()` unless there's a good reason. Always use `bold()` for bold text.**

```swift
// Correct
Text("Important")
    .bold()

// Avoid (unless you need a specific weight)
Text("Important")
    .fontWeight(.bold)

// Acceptable (specific weight needed)
Text("Semibold")
    .fontWeight(.semibold)
```

## Navigation

### NavigationStack vs NavigationView

Prefer `NavigationStack` on iOS 16+/macOS 13+. Keep a compatible navigation implementation for earlier supported targets.

```swift
// Modern (Correct)
NavigationStack {
    List(items) { item in
        NavigationLink(value: item) {
            Text(item.name)
        }
    }
    .navigationDestination(for: Item.self) { item in
        DetailView(item: item)
    }
}

// Legacy (Avoid)
NavigationView {
    List(items) { item in
        NavigationLink(destination: DetailView(item: item)) {
            Text(item.name)
        }
    }
}
```

### navigationDestination(for:)

**Use `navigationDestination(for:)` for type-safe navigation.**

```swift
struct ContentView: View {
    var body: some View {
        NavigationStack {
            List {
                NavigationLink("Profile", value: Route.profile)
                NavigationLink("Settings", value: Route.settings)
            }
            .navigationDestination(for: Route.self) { route in
                switch route {
                case .profile:
                    ProfileView()
                case .settings:
                    SettingsView()
                }
            }
        }
    }
}

enum Route: Hashable {
    case profile
    case settings
}
```

## Tabs

### Tab API vs tabItem()

**For iOS 18 and later, prefer the `Tab` API over `tabItem()` to access modern tab features, and use availability checks or `tabItem()` for earlier OS versions.**

```swift
// Modern (Correct) - iOS 18+
TabView {
    Tab("Home", systemImage: "house") {
        HomeView()
    }
    
    Tab("Search", systemImage: "magnifyingglass") {
        SearchView()
    }
    
    Tab("Profile", systemImage: "person") {
        ProfileView()
    }
}

// Legacy (Avoid)
TabView {
    HomeView()
        .tabItem {
            Label("Home", systemImage: "house")
        }
}
```

**Important**: When using `Tab(role:)` with roles, you must use the new `Tab { } label: { }` syntax for all tabs. Mixing with `.tabItem()` causes compilation errors.

```swift
// Correct - all tabs use Tab syntax
TabView {
    Tab(role: .search) {
        SearchView()
    } label: {
        Label("Search", systemImage: "magnifyingglass")
    }
    
    Tab {
        HomeView()
    } label: {
        Label("Home", systemImage: "house")
    }
}

// Wrong - mixing Tab and tabItem causes errors
TabView {
    Tab(role: .search) {
        SearchView()
    } label: {
        Label("Search", systemImage: "magnifyingglass")
    }
    
    HomeView()  // Error: can't mix with Tab(role:)
        .tabItem {
            Label("Home", systemImage: "house")
        }
}
```

## Interactions

### Button vs onTapGesture()

Use `Button` for actions with control semantics, accessibility, keyboard activation, and feedback. Use gestures for interaction with view content, such as tap location/count or gesture composition.

```swift
// Correct - standard tap action
Button("Tap me") {
    performAction()
}

// Correct - need tap location
Text("Tap anywhere")
    .onTapGesture { location in
        handleTap(at: location)
    }

// Correct - need tap count
Image("photo")
    .onTapGesture(count: 2) {
        handleDoubleTap()
    }

// Wrong - use Button instead
Text("Tap me")
    .onTapGesture {
        performAction()
    }
```

**Why**: `Button` provides proper accessibility, visual feedback, and semantic meaning. Choose a gesture when its interaction semantics are required.

### Button with Images

Give image-only buttons a meaningful accessible name. A title/`Label` (optionally with `.labelStyle(.iconOnly)`) or an explicit `.accessibilityLabel` can provide it.

```swift
// Correct - includes text label
Button("Add Item", systemImage: "plus") {
    addItem()
}

// Also correct - custom label
Button {
    addItem()
} label: {
    Label("Add Item", systemImage: "plus")
}

// Wrong - image only, no text
Button {
    addItem()
} label: {
    Image(systemName: "plus")
}
// Add .accessibilityLabel("Add Item") to make this image-only control accessible.
```

## Layout and Sizing

### Avoid UIScreen.main.bounds

**Never use `UIScreen.main.bounds` to read available space.**

```swift
// Wrong - uses UIKit, doesn't respect safe areas
let screenWidth = UIScreen.main.bounds.width

// Correct - use GeometryReader
GeometryReader { geometry in
    Text("Width: \(geometry.size.width)")
}

// Better - use containerRelativeFrame (iOS 17+)
Text("Full width")
    .containerRelativeFrame(.horizontal)

// Best - let SwiftUI handle sizing
Text("Auto-sized")
    .frame(maxWidth: .infinity)
```

### GeometryReader Alternatives

> **iOS 17+**: `containerRelativeFrame` and `visualEffect` require iOS 17 or later.

**Don't use `GeometryReader` if a newer alternative works.**

```swift
// Modern - containerRelativeFrame
Image("hero")
    .resizable()
    .containerRelativeFrame(.horizontal) { length, axis in
        length * 0.8
    }

// Modern - visualEffect for position-based effects
Text("Parallax")
    .visualEffect { content, geometry in
        content.offset(y: geometry.frame(in: .global).minY * 0.5)
    }

// Legacy - only use if necessary
GeometryReader { geometry in
    Image("hero")
        .frame(width: geometry.size.width * 0.8)
}
```

## Type Erasure

### Avoid AnyView

**Avoid `AnyView` unless absolutely required.**

```swift
// Prefer - use @ViewBuilder
@ViewBuilder
func content() -> some View {
    if condition {
        Text("Option A")
    } else {
        Image(systemName: "photo")
    }
}

// Avoid - type erasure has performance cost
func content() -> AnyView {
    if condition {
        return AnyView(Text("Option A"))
    } else {
        return AnyView(Image(systemName: "photo"))
    }
}

// Acceptable - when protocol conformance requires it
var body: some View {
    // Complex conditional logic that requires type erasure
}
```

## Styling Best Practices

### Dynamic Type

**Don't force specific font sizes. Prefer Dynamic Type.**

```swift
// Correct - respects user's text size preferences
Text("Title")
    .font(.title)

Text("Body")
    .font(.body)

// Avoid - fixed size doesn't scale
Text("Title")
    .font(.system(size: 24))
```

### UIKit Colors

**Avoid using UIKit colors in SwiftUI code.**

```swift
// Correct - SwiftUI colors
Text("Hello")
    .foregroundStyle(.blue)
    .background(.gray.opacity(0.2))

// Wrong - UIKit colors
Text("Hello")
    .foregroundColor(Color(UIColor.systemBlue))
    .background(Color(UIColor.systemGray))
```

## Static Member Lookup

**Prefer static member lookup to struct instances.**

```swift
// Correct - static member lookup
Circle()
    .fill(.blue)
Button("Action") { }
    .buttonStyle(.borderedProminent)

// Verbose - unnecessary struct instantiation
Circle()
    .fill(Color.blue)
Button("Action") { }
    .buttonStyle(BorderedProminentButtonStyle())
```

## Summary Checklist

- [ ] Use `foregroundStyle()` instead of `foregroundColor()`
- [ ] Use `clipShape(.rect(cornerRadius:))` instead of `cornerRadius()`
- [ ] Tab/navigation/API choices match supported platform versions
- [ ] Use `Button` instead of `onTapGesture()` (unless need location/count)
- [ ] Use `NavigationStack` instead of `NavigationView`
- [ ] Use `navigationDestination(for:)` for type-safe navigation
- [ ] Avoid `AnyView` unless required
- [ ] Avoid `UIScreen.main.bounds`
- [ ] Avoid `GeometryReader` when alternatives exist
- [ ] Use Dynamic Type instead of fixed font sizes
- [ ] Avoid hard-coded padding/spacing unless requested
- [ ] Avoid UIKit colors in SwiftUI
- [ ] Use static member lookup (`.blue` vs `Color.blue`)
- [ ] Image-only buttons have meaningful accessible names
- [ ] Use `bold()` instead of `fontWeight(.bold)`
