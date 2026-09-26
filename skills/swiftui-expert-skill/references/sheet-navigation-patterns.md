# SwiftUI Sheet and Navigation Patterns Reference

## Sheet Patterns

### Item-Driven Sheets (Preferred)

**Use `.sheet(item:)` instead of `.sheet(isPresented:)` when presenting model-based content.**

```swift
// Good - item-driven
@State private var selectedItem: Item?

var body: some View {
    List(items) { item in
        Button(item.name) {
            selectedItem = item
        }
    }
    .sheet(item: $selectedItem) { item in
        ItemDetailSheet(item: item)
    }
}

// Avoid - boolean flag requires separate state
@State private var showSheet = false
@State private var selectedItem: Item?

var body: some View {
    List(items) { item in
        Button(item.name) {
            selectedItem = item
            showSheet = true
        }
    }
    .sheet(isPresented: $showSheet) {
        if let selectedItem {
            ItemDetailSheet(item: selectedItem)
        }
    }
}
```

**Why**: `.sheet(item:)` automatically handles presentation state and avoids optional unwrapping in the sheet body.

### Presentation Ownership and Business Actions

This example uses Observation (iOS 17+/macOS 14+); retain a compatible observable model for earlier targets. A sheet may own local editing state and dismissal intent. Delegate business persistence to an injected model, service boundary, or save action; callbacks are valid when the parent owns the operation. Keep the sheet open on failure, reset the saving state, and dismiss only after a confirmed success. Cancellation is separate from an actionable save error.

```swift
// A presentation model owns asynchronous status; the injected action owns persistence.
@Observable
@MainActor
final class SheetSaveState {
    private(set) var isSaving = false
    private(set) var errorMessage: String?
    private var task: Task<Void, Never>?

    func start(
        operation: @escaping @MainActor () async throws -> Void,
        onSuccess: @escaping @MainActor () -> Void
    ) {
        guard !isSaving else { return }
        isSaving = true
        errorMessage = nil
        task = Task { await run(operation: operation, onSuccess: onSuccess) }
    }

    private func run(
        operation: @MainActor () async throws -> Void,
        onSuccess: @MainActor () -> Void
    ) async {
        defer {
            isSaving = false
            task = nil
        }
        do {
            try Task.checkCancellation()
            try await operation()
            try Task.checkCancellation()
            onSuccess()
        } catch is CancellationError {
            // Cancellation does not confirm success and should not display a save error.
        } catch {
            guard !Task.isCancelled else { return }
            errorMessage = error.localizedDescription
        }
    }

    func cancel() { task?.cancel() }
}

struct EditItemSheet: View {
    @Environment(\.dismiss) private var dismiss
    let item: Item
    let saveItem: @MainActor (Item, String) async throws -> Void
    @State private var name: String
    @State private var saveState = SheetSaveState()

    init(item: Item, saveItem: @escaping @MainActor (Item, String) async throws -> Void) {
        self.item = item
        self.saveItem = saveItem
        // An intentional one-time editing draft, not synchronization with parent updates.
        _name = State(initialValue: item.name)
    }

    var body: some View {
        NavigationStack {
            Form {
                TextField("Name", text: $name)
                if let errorMessage = saveState.errorMessage {
                    Text(errorMessage).foregroundStyle(.red)
                }
            }
            .navigationTitle("Edit Item")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel", action: cancel)
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button(saveState.isSaving ? "Saving..." : "Save", action: startSave)
                        .disabled(saveState.isSaving || name.isEmpty)
                }
            }
        }
        .onDisappear { saveState.cancel() }
    }

    private func startSave() {
        let draft = name
        saveState.start {
            try await saveItem(item, draft)
        } onSuccess: {
            dismiss()
        }
    }

    private func cancel() {
        saveState.cancel()
        dismiss()
    }
}

// Parent injects the business operation; closure delegation is a valid boundary.
.sheet(item: $selectedItem) { item in
    EditItemSheet(item: item) { item, name in
        try await viewModel.save(item, name: name)
    }
}
```

A draft is seeded once per sheet identity. If a different item is shown, use appropriate item identity or explicitly reset the draft. Cancellation is cooperative and cannot roll back a save already committed by a service; that service must define its own transaction/idempotency semantics.

## Navigation Patterns

### Type-Safe Navigation with NavigationStack

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

### Programmatic Navigation

```swift
struct ContentView: View {
    @State private var navigationPath = NavigationPath()
    
    var body: some View {
        NavigationStack(path: $navigationPath) {
            List {
                Button("Go to Detail") {
                    navigationPath.append(DetailRoute.item(id: 1))
                }
            }
            .navigationDestination(for: DetailRoute.self) { route in
                switch route {
                case .item(let id):
                    ItemDetailView(id: id)
                }
            }
        }
    }
}

enum DetailRoute: Hashable {
    case item(id: Int)
}
```

### Navigation Ready for State Restoration

This example centralizes route-to-view mapping; it does not persist or restore the path by itself. Add project-specific encoding/storage and invalid-route handling when restoration is required.

```swift
struct ContentView: View {
    @State private var navigationPath = NavigationPath()
    
    var body: some View {
        NavigationStack(path: $navigationPath) {
            RootView()
                .navigationDestination(for: Route.self) { route in
                    destinationView(for: route)
                }
        }
    }
    
    @ViewBuilder
    private func destinationView(for route: Route) -> some View {
        switch route {
        case .profile:
            ProfileView()
        case .settings:
            SettingsView()
        }
    }
}
```

## Presentation Modifiers

### Full Screen Cover

```swift
struct ContentView: View {
    @State private var showFullScreen = false
    
    var body: some View {
        Button("Show Full Screen") {
            showFullScreen = true
        }
        .fullScreenCover(isPresented: $showFullScreen) {
            FullScreenView()
        }
    }
}
```

### Popover

```swift
struct ContentView: View {
    @State private var showPopover = false
    
    var body: some View {
        Button("Show Popover") {
            showPopover = true
        }
        .popover(isPresented: $showPopover) {
            PopoverContentView()
                .presentationCompactAdaptation(.popover)  // Don't adapt to sheet on iPhone
        }
    }
}
```

### Alert with Actions

```swift
struct ContentView: View {
    @State private var showAlert = false
    
    var body: some View {
        Button("Show Alert") {
            showAlert = true
        }
        .alert("Delete Item?", isPresented: $showAlert) {
            Button("Delete", role: .destructive) {
                deleteItem()
            }
            Button("Cancel", role: .cancel) { }
        } message: {
            Text("This action cannot be undone.")
        }
    }
}
```

### Confirmation Dialog

```swift
struct ContentView: View {
    @State private var showDialog = false
    
    var body: some View {
        Button("Show Options") {
            showDialog = true
        }
        .confirmationDialog("Choose an option", isPresented: $showDialog) {
            Button("Option 1") { handleOption1() }
            Button("Option 2") { handleOption2() }
            Button("Cancel", role: .cancel) { }
        }
    }
}
```

## Summary Checklist

- [ ] Use `.sheet(item:)` for model-based sheets
- [ ] Sheet presentation intent is local; business saves use an explicit collaborator/action
- [ ] Use `NavigationStack` with `navigationDestination(for:)` for type-safe navigation
- [ ] Use `NavigationPath` for programmatic navigation
- [ ] Use appropriate presentation modifiers (sheet, fullScreenCover, popover)
- [ ] Alerts and confirmation dialogs use modern API with actions
- [ ] Saving state resets on every outcome; errors stay visible; only confirmed success dismisses
- [ ] Navigation state can be saved/restored when needed
