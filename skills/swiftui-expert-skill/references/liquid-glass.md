# SwiftUI Liquid Glass Reference (Apple OS 26+)

## Overview

Liquid Glass is Apple's new design language introduced in iOS 26. It provides translucent, dynamic surfaces that respond to content and user interaction. This reference covers the native SwiftUI APIs for implementing Liquid Glass effects.

## Availability

Load this reference for explicitly requested adoption or work on existing glass. Custom SwiftUI Liquid Glass requires iOS, macOS, tvOS, or watchOS 26+ and is unavailable on visionOS. Preserve fallbacks when the project supports older systems. Minimum-version annotations are appropriate for glass-only helpers; a runtime check in a caller does not protect an unannotated helper body.

The examples below target supported non-visionOS platforms. For a cross-platform helper including visionOS, use conditional compilation as shown under Fallback Strategies.

```swift
if #available(iOS 26, macOS 26, tvOS 26, watchOS 26, *) {
    // Liquid Glass implementation
} else {
    // Fallback using materials
}
```

## Core APIs

### glassEffect Modifier

The primary modifier for applying glass effects to views:

```swift
.glassEffect(_ glass: Glass = .regular, in shape: some Shape = DefaultGlassEffectShape())
```

#### Basic Usage

```swift
Text("Hello")
    .padding()
    .glassEffect()  // Default regular material, capsule shape
```

#### With Shape

```swift
Text("Rounded Glass")
    .padding()
    .glassEffect(in: .rect(cornerRadius: 16))

Image(systemName: "star")
    .padding()
    .glassEffect(in: .circle)

Text("Capsule")
    .padding(.horizontal, 20)
    .padding(.vertical, 10)
    .glassEffect(in: .capsule)
```

### Glass

#### Material Variants

```swift
.glassEffect(.regular)     // Standard glass appearance
.glassEffect(.clear)       // Clear glass variant
.glassEffect(.identity)    // No glass effect
```

#### Tinting

Add color tint to the glass:

```swift
.glassEffect(.regular.tint(.blue))
.glassEffect(.regular.tint(.red.opacity(0.3)))
```

#### Interactivity

Make glass respond to touch/pointer hover:

```swift
// Interactive glass - responds to user interaction
.glassEffect(.regular.interactive())

// Combined with tint
.glassEffect(.regular.tint(.blue).interactive())
```

**Important**: Only use `.interactive()` on elements that actually respond to user input (buttons, tappable views, focusable elements).

## GlassEffectContainer

Wraps multiple glass elements for proper visual grouping and spacing:

```swift
GlassEffectContainer {
    HStack {
        Button("One") { }
            .glassEffect()
        Button("Two") { }
            .glassEffect()
    }
}
```

### With Spacing

Control the visual spacing between glass elements:

```swift
GlassEffectContainer(spacing: 24) {
    HStack(spacing: 24) {
        GlassChip(icon: "pencil")
        GlassChip(icon: "eraser")
        GlassChip(icon: "trash")
    }
}
```

The container’s `spacing` is the interaction/blending distance between effects, not the layout spacing. A larger value blends shapes sooner; a value larger than the interior layout gap can merge effects at rest. Choose both values for the intended transition and verify the result visually.

## Glass Button Styles

Built-in button styles for glass appearance:

```swift
// Standard glass button
Button("Action") { }
    .buttonStyle(.glass)

// Prominent glass button (higher visibility)
Button("Primary Action") { }
    .buttonStyle(.glassProminent)
```

### Custom Glass Buttons

For more control, apply glass effect manually:

```swift
Button(action: { }) {
    Label("Settings", systemImage: "gear")
        .padding()
}
.glassEffect(.regular.interactive(), in: .capsule)
```

## Morphing Transitions

Create smooth transitions between glass elements using `glassEffectID` and `@Namespace`:

```swift
@available(iOS 26, macOS 26, tvOS 26, watchOS 26, *)
@available(visionOS, unavailable)
struct MorphingExample: View {
    @Namespace private var animation
    @State private var isExpanded = false

    var body: some View {
        GlassEffectContainer {
            if isExpanded {
                ExpandedCard()
                    .glassEffect()
                    .glassEffectID("card", in: animation)
            } else {
                CompactCard()
                    .glassEffect()
                    .glassEffectID("card", in: animation)
            }
        }
        .animation(.smooth, value: isExpanded)
    }
}
```

### Requirements for Morphing

1. Give each effect a stable, unique ID in the namespace; reuse an ID across mutually exclusive representations of the same logical element
2. Use the same `@Namespace`
3. Wrap in `GlassEffectContainer`
4. Apply animation to the container or parent

## Modifier Order

**Critical**: Apply `glassEffect` after layout and visual modifiers:

```swift
// CORRECT order
Text("Label")
    .font(.headline)           // 1. Typography
    .foregroundStyle(.primary) // 2. Color
    .padding()                 // 3. Layout
    .glassEffect()             // 4. Glass effect LAST

// WRONG order - glass applied too early
Text("Label")
    .glassEffect()             // Wrong position
    .padding()
    .font(.headline)
```

## Complete Examples

### Toolbar with Glass Buttons

```swift
@available(visionOS, unavailable)
struct GlassToolbar: View {
    var body: some View {
        if #available(iOS 26, macOS 26, tvOS 26, watchOS 26, *) {
            GlassEffectContainer(spacing: 16) {
                HStack(spacing: 16) {
                    ToolbarButton(title: "Pencil", icon: "pencil", action: { })
                    ToolbarButton(title: "Eraser", icon: "eraser", action: { })
                    ToolbarButton(title: "Cut", icon: "scissors", action: { })
                    Spacer()
                    ToolbarButton(title: "Share", icon: "square.and.arrow.up", action: { })
                }
                .padding(.horizontal)
            }
        } else {
            // Fallback toolbar
            HStack(spacing: 16) {
                // ... fallback implementation
            }
        }
    }
}

@available(iOS 26, macOS 26, tvOS 26, watchOS 26, *)
@available(visionOS, unavailable)
struct ToolbarButton: View {
    let title: String
    let icon: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Label(title, systemImage: icon)
                .labelStyle(.iconOnly)
                .font(.title2)
                .frame(width: 44, height: 44)
        }
        .glassEffect(.regular.interactive(), in: .circle)
    }
}
```

### Card with Glass Effect

```swift
@available(visionOS, unavailable)
struct GlassCard: View {
    let title: String
    let subtitle: String

    var body: some View {
        if #available(iOS 26, macOS 26, tvOS 26, watchOS 26, *) {
            cardContent
                .glassEffect(.regular, in: .rect(cornerRadius: 20))
        } else {
            cardContent
                .background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 20))
        }
    }

    private var cardContent: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.headline)
            Text(subtitle)
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding()
        .frame(maxWidth: .infinity, alignment: .leading)
    }
}
```

### Segmented Control

This example assumes fixed options in a stable order; dynamic/reorderable options should carry stable model IDs instead of index identity.

```swift
@available(visionOS, unavailable)
struct GlassSegmentedControl: View {
    @Binding var selection: Int
    let options: [String]
    @Namespace private var animation

    var body: some View {
        if #available(iOS 26, macOS 26, tvOS 26, watchOS 26, *) {
            GlassEffectContainer(spacing: 4) {
                HStack(spacing: 4) {
                    ForEach(options.indices, id: \.self) { index in
                        Button(options[index]) {
                            withAnimation(.smooth) {
                                selection = index
                            }
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 8)
                        .glassEffect(
                            selection == index ? .regular.tint(.accentColor).interactive() : .regular.interactive(),
                            in: .capsule
                        )
                        .glassEffectID(selection == index ? "selected" : "option\(index)", in: animation)
                    }
                }
                .padding(4)
            }
        } else {
            Picker("Options", selection: $selection) {
                ForEach(options.indices, id: \.self) { index in
                    Text(options[index]).tag(index)
                }
            }
            .pickerStyle(.segmented)
        }
    }
}
```

## Fallback Strategies

### Using Materials

```swift
if #available(iOS 26, macOS 26, tvOS 26, watchOS 26, *) {
    content.glassEffect()
} else {
    content.background(.ultraThinMaterial, in: RoundedRectangle(cornerRadius: 16))
}
```

### Available Materials for Fallback

- `.ultraThinMaterial` - Closest to glass appearance
- `.thinMaterial` - Slightly more opaque
- `.regularMaterial` - Standard blur
- `.thickMaterial` - More opaque
- `.ultraThickMaterial` - Most opaque

### Conditional Modifier Extension

```swift
extension View {
    @ViewBuilder
    func glassEffectWithFallback<S: Shape>(
        in shape: S = Capsule(),
        tint: Color? = nil,
        isInteractive: Bool = false,
        fallbackMaterial: Material = .ultraThinMaterial
    ) -> some View {
        #if os(visionOS)
        self.background(fallbackMaterial, in: shape)
        #else
        if #available(iOS 26, macOS 26, tvOS 26, watchOS 26, *) {
            self.glassEffect(.regular.tint(tint).interactive(isInteractive), in: shape)
        } else {
            self.background(fallbackMaterial, in: shape)
        }
        #endif
    }
}
```

## Best Practices

### Do

- Use `GlassEffectContainer` for grouped glass elements
- Apply glass after layout modifiers
- Use `.interactive()` only on tappable elements
- Tune container blending distance independently of layout spacing
- Provide material-based fallbacks for older iOS
- Keep glass shapes consistent within a feature

### Don't

- Apply glass to every element (use sparingly)
- Use `.interactive()` on static content
- Mix different corner radii arbitrarily
- Forget iOS version checks
- Apply glass before padding/frame modifiers
- Nest `GlassEffectContainer` unnecessarily

## Checklist

- [ ] Each target platform’s availability is covered; glass-only helpers are annotated and older targets have fallbacks
- [ ] `GlassEffectContainer` wraps grouped elements
- [ ] `.glassEffect()` applied after layout modifiers
- [ ] `.interactive()` only on user-interactable elements
- [ ] `glassEffectID` with `@Namespace` for morphing
- [ ] Consistent shapes and spacing across feature
- [ ] Container blending distance produces the intended effect relative to layout spacing
- [ ] Valid Glass variants/tints or prominent button styles are used appropriately

## Apple API Sources

- [glassEffect(_:in:)](https://developer.apple.com/documentation/swiftui/view/glasseffect(_:in:)) — `Glass`, default Capsule, modifier semantics
- [Glass](https://developer.apple.com/documentation/swiftui/glass) — regular, clear, identity, tint, interactivity
- [Applying Liquid Glass to custom views](https://developer.apple.com/documentation/SwiftUI/Applying-Liquid-Glass-to-custom-views) — grouping, blending distance, identity, transitions
