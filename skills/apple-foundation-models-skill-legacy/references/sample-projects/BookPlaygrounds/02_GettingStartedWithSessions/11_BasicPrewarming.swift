import FoundationModels
import Playgrounds

// Connect these methods to separate UI events in the host app.
@MainActor
final class PrewarmingExample {
    private let session = LanguageModelSession()

    func userBeganComposing() {
        // Call only when a request is likely and the interaction naturally gives
        // at least one second of lead time. Do not delay submission to prewarm.
        session.prewarm()
    }

    func userSubmitted(_ text: String) async throws -> String {
        let response = try await session.respond(to: text)
        return response.content
    }
}

#Playground {
    let example = PrewarmingExample()
    // The host's composing event calls example.userBeganComposing().
    // Its later submit event awaits example.userSubmitted(text).
    // Loading and a latency improvement are not guaranteed; measure on device.
    _ = example
}
