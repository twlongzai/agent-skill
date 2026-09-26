# SwiftUI Image Optimization Reference

## AsyncImage Best Practices

### Basic AsyncImage with Phase Handling

```swift
// Good - handles loading and error states
AsyncImage(url: imageURL) { phase in
    switch phase {
    case .empty:
        ProgressView()
    case .success(let image):
        image
            .resizable()
            .aspectRatio(contentMode: .fit)
    case .failure:
        Image(systemName: "photo")
            .foregroundStyle(.secondary)
    @unknown default:
        EmptyView()
    }
}
.frame(width: 200, height: 200)
```

### AsyncImage with Custom Placeholder

```swift
struct ImageView: View {
    let url: URL?
    
    var body: some View {
        AsyncImage(url: url) { phase in
            switch phase {
            case .empty:
                ZStack {
                    Color.gray.opacity(0.2)
                    ProgressView()
                }
            case .success(let image):
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            case .failure:
                ZStack {
                    Color.gray.opacity(0.2)
                    Image(systemName: "exclamationmark.triangle")
                        .foregroundStyle(.secondary)
                }
            @unknown default:
                EmptyView()
            }
        }
        .clipShape(.rect(cornerRadius: 12))
    }
}
```

### AsyncImage with Transition

```swift
AsyncImage(url: imageURL) { phase in
    switch phase {
    case .empty:
        ProgressView()
    case .success(let image):
        image
            .resizable()
            .aspectRatio(contentMode: .fit)
            .transition(.opacity)
    case .failure:
        Image(systemName: "photo")
    @unknown default:
        EmptyView()
    }
}
.animation(.easeInOut, value: imageURL)
```

## Image Decoding and Downsampling (Optional Optimization)

**When you encounter `UIImage(data:)` usage, consider suggesting image downsampling as a potential performance improvement**, especially for large images in lists or grids.

### Current Pattern That Could Be Optimized

```swift
// Decoding at the point of view construction can add work to UI updates.
// Force unwrapping also crashes for invalid image data.
Image(uiImage: UIImage(data: imageData)!)
    .resizable()
    .aspectRatio(contentMode: .fit)
    .frame(width: 200, height: 200)
```

### Suggested Optimization with Explicit Lifecycle

This UIKit example targets iOS 17+. Use the display scale of the actual view environment, include data/size/scale in the task identity, and render invalid data as failure instead of indefinite loading. The actor serializes ImageIO work outside the UI actor. ImageIO’s synchronous operation cannot be interrupted midway; cancellation checks before and after it prevent adopting a cancelled result. No detached task is needed.

```swift
import SwiftUI
import UIKit
import ImageIO

struct ImageRequest: Equatable, Sendable {
    let data: Data
    let targetSize: CGSize
    let scale: CGFloat
}

enum ImageProcessingError: Error {
    case invalidSize
    case invalidData
}

actor ImageProcessor {
    func downsample(_ request: ImageRequest) throws -> CGImage {
        try Task.checkCancellation()
        let maxDimension = max(request.targetSize.width, request.targetSize.height) * request.scale
        guard request.targetSize.width > 0, request.targetSize.height > 0,
              request.scale > 0, maxDimension.isFinite,
              maxDimension < CGFloat(Int.max / 2) else {
            throw ImageProcessingError.invalidSize
        }
        guard let source = CGImageSourceCreateWithData(request.data as CFData, nil) else {
            throw ImageProcessingError.invalidData
        }
        let options: [CFString: Any] = [
            kCGImageSourceThumbnailMaxPixelSize: Int(maxDimension.rounded(.up)),
            kCGImageSourceCreateThumbnailFromImageAlways: true,
            kCGImageSourceCreateThumbnailWithTransform: true,
            kCGImageSourceShouldCache: false,
            kCGImageSourceShouldCacheImmediately: true
        ]
        guard let image = CGImageSourceCreateThumbnailAtIndex(source, 0, options as CFDictionary) else {
            throw ImageProcessingError.invalidData
        }
        try Task.checkCancellation()
        return image
    }
}

struct OptimizedImageView: View {
    private enum Phase {
        case loading
        case success(UIImage)
        case failure
    }

    let imageData: Data
    let targetSize: CGSize
    @Environment(\.displayScale) private var displayScale
    @State private var phase: Phase = .loading
    @State private var processor = ImageProcessor()

    private var request: ImageRequest {
        ImageRequest(data: imageData, targetSize: targetSize, scale: displayScale)
    }

    var body: some View {
        // Capture a single request for both identity and processing.
        let currentRequest = request
        Group {
            switch phase {
            case .loading:
                ProgressView()
            case .success(let image):
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
            case .failure:
                Image(systemName: "exclamationmark.triangle")
                    .accessibilityLabel("Image could not be loaded")
            }
        }
        .task(id: currentRequest) {
            phase = .loading
            do {
                let cgImage = try await processor.downsample(currentRequest)
                try Task.checkCancellation()
                phase = .success(UIImage(cgImage: cgImage, scale: currentRequest.scale, orientation: .up))
            } catch is CancellationError {
                // Disappeared or input changed: the cancelled task must not overwrite the new phase.
            } catch {
                guard !Task.isCancelled else { return }
                phase = .failure
            }
        }
    }
}

// Usage: the actual environment displayScale determines the pixel budget.
OptimizedImageView(imageData: imageData, targetSize: CGSize(width: 200, height: 200))
```

### Reusable Image Downsampling Helper

`ImageProcessor` is the reusable helper in the example. Inject/share it when that lifetime fits the feature. It does not cache results. For repeated images, evaluate a bounded cache keyed by image identity and pixel dimensions; account for invalidation and memory cost. A stable asset/version ID can replace full Data comparison in task identity for large payloads, provided it changes whenever the image changes.

For older targets, use equivalent lifecycle state and cancellation-aware loading with APIs supported by the project. Do not assume that cancelling a view task cancels a separate `Task.detached`; a detached worker needs explicit cancellation ownership.

### When to Suggest This Optimization

Mention this optimization when you see `UIImage(data:)` usage, particularly in:
- Scrollable content (List, ScrollView with LazyVStack/LazyHStack)
- Grid layouts with many images
- Image galleries or carousels
- Any scenario where large images are displayed at smaller sizes

**Don't automatically apply it**—present it as an optional improvement for performance-sensitive scenarios.

## SF Symbols

### Using SF Symbols

```swift
// Basic symbol
Image(systemName: "star.fill")
    .foregroundStyle(.yellow)

// With rendering mode
Image(systemName: "heart.fill")
    .symbolRenderingMode(.multicolor)

// With variable color
Image(systemName: "speaker.wave.3.fill")
    .symbolRenderingMode(.hierarchical)
    .foregroundStyle(.blue)

// Animated symbols (iOS 17+)
Image(systemName: "antenna.radiowaves.left.and.right")
    .symbolEffect(.variableColor)
```

### SF Symbol Variants

```swift
// Circle variant
Image(systemName: "star.circle.fill")

// Square variant
Image(systemName: "star.square.fill")

// With badge
Image(systemName: "folder.badge.plus")
```

## Image Rendering

### ImageRenderer for Snapshots

```swift
// Render SwiftUI view to UIImage
let renderer = ImageRenderer(content: myView)
renderer.scale = displayScale  // Read @Environment(\.displayScale) in the owning view

if let uiImage = renderer.uiImage {
    // Use the image (save, share, etc.)
}

// Render to CGImage
if let cgImage = renderer.cgImage {
    // Use CGImage
}
```

### Rendering with Custom Size

```swift
let renderer = ImageRenderer(content: myView)
renderer.proposedSize = ProposedViewSize(width: 400, height: 300)

if let uiImage = renderer.uiImage {
    // Image rendered at 400x300 points
}
```

## Summary Checklist

- [ ] Use `AsyncImage` with proper phase handling
- [ ] Handle loading, success, and failure; input changes restart relevant work and cancelled results are ignored
- [ ] Consider downsampling for `UIImage(data:)` in performance-sensitive scenarios
- [ ] Decode and downsample images off the main thread
- [ ] Use target pixel dimensions based on the actual display scale
- [ ] Consider image caching for frequently accessed images
- [ ] Use SF Symbols with appropriate rendering modes
- [ ] Use `ImageRenderer` for rendering SwiftUI views to images

**Performance Note**: Image downsampling is an optional optimization. Only suggest it when you encounter `UIImage(data:)` usage in performance-sensitive contexts like scrollable lists or grids.
