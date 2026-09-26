# SwiftUI List Patterns Reference

## ForEach Identity and Stability

**Always provide stable identity for `ForEach`.** Never use `.indices` for dynamic content.

```swift
// Good - stable identity via Identifiable
extension User: Identifiable {
    var id: String { userId }
}

ForEach(users) { user in
    UserRow(user: user)
}

// Good - stable identity via keypath
ForEach(users, id: \.userId) { user in
    UserRow(user: user)
}

// Wrong - indices create static content
ForEach(users.indices, id: \.self) { index in
    UserRow(user: users[index])  // Can crash on removal!
}

// Wrong - unstable identity
ForEach(users, id: \.self) { user in
    UserRow(user: user)  // Only works if User is Hashable and stable
}
```

**Critical**: Ensure **constant number of views per element** in `ForEach`:

```swift
// Good - consistent view count
ForEach(items) { item in
    ItemRow(item: item)
}

// Bad - variable view count breaks identity
ForEach(items) { item in
    if item.isSpecial {
        SpecialRow(item: item)
        DetailRow(item: item)
    } else {
        RegularRow(item: item)
    }
}
```

**Avoid inline filtering:**

```swift
// Avoid repeated filtering of a large collection in a frequently evaluated body
ForEach(items.filter { $0.isEnabled }) { item in
    ItemRow(item: item)
}

// Good - prefilter and cache
@State private var enabledItems: [Item] = []

var body: some View {
    ForEach(enabledItems) { item in
        ItemRow(item: item)
    }
    .onChange(of: items, initial: true) { _, newItems in
        enabledItems = newItems.filter { $0.isEnabled }
    }
}
```

**Avoid `AnyView` in list rows:**

```swift
// Bad - hides identity, increases cost
ForEach(items) { item in
    AnyView(item.isSpecial ? SpecialRow(item: item) : RegularRow(item: item))
}

// Good - Create a unified row view
ForEach(items) { item in
    ItemRow(item: item)
}

struct ItemRow: View {
    let item: Item

    var body: some View {
        if item.isSpecial {
            SpecialRow(item: item)
        } else {
            RegularRow(item: item)
        }
    }
}
```

**Why**: Stable identity is critical for performance and animations. Unstable identity causes excessive diffing, broken animations, and potential crashes.

`initial: true` populates the cache for already-loaded data on first appearance (iOS 17+/macOS 14+). The source must be `Equatable` for this overload. Keep cache invalidation tied to every source/filter input; for earlier targets initialize on appearance and use a compatible change handler. A small cheap derived collection may be clearer as a computed value.

## Enumerated Sequences

`ForEach` needs a `RandomAccessCollection`, not specifically an Array. On Apple OS 26+ with a supporting Swift toolchain, `EnumeratedSequence` conforms when its base is a random-access collection. Earlier deployment targets may still require `Array` conversion. Match the toolchain and runtime availability; use the element’s stable ID for mutable content, and treat offset only as a display counter.

```swift
// `items` contains Identifiable models; this branch targets iOS/macOS/tvOS/watchOS 26+.
if #available(iOS 26, macOS 26, tvOS 26, watchOS 26, visionOS 26, *) {
    ForEach(items.enumerated(), id: \.element.id) { offset, item in
        Text("\(offset + 1): \(item.name)")
    }
} else {
    ForEach(Array(items.enumerated()), id: \.element.id) { offset, item in
        Text("\(offset + 1): \(item.name)")
    }
}
```

For a fixed immutable collection, positional identity can be appropriate. Do not infer a persistent model ID from an enumerated offset.

## List with Custom Styling

```swift
// Remove default background and separators
List(items) { item in
    ItemRow(item: item)
        .listRowInsets(EdgeInsets(top: 8, leading: 16, bottom: 8, trailing: 16))
        .listRowSeparator(.hidden)
}
.listStyle(.plain)
.scrollContentBackground(.hidden)
.background(Color.customBackground)
.environment(\.defaultMinListRowHeight, 1)  // Allows custom row heights
```

## List with Pull-to-Refresh

```swift
List(items) { item in
    ItemRow(item: item)
}
.refreshable {
    await loadItems()
}
```

## Summary Checklist

- [ ] ForEach uses stable identity (never `.indices` for dynamic content)
- [ ] Constant number of views per ForEach element
- [ ] Expensive filtering is prepared when inputs change; caches include initial data and filter changes
- [ ] No `AnyView` in list rows
- [ ] Enumerated data meets collection/runtime requirements; convert to Array only where needed
- [ ] Use `.refreshable` for pull-to-refresh
- [ ] Custom list styling uses appropriate modifiers

## Apple API Sources

- [EnumeratedSequence](https://developer.apple.com/documentation/swift/enumeratedsequence) — conditional collection conformance; check SDK runtime annotations
- [onChange(of:initial:_:)](https://developer.apple.com/documentation/swiftui/view/onchange(of:initial:_:)-8wgw9) — initial execution is opt-in
