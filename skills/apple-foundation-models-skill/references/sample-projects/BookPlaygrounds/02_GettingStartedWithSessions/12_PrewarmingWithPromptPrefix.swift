import FoundationModels
import Playgrounds

@MainActor
final class PrefixPrewarmingExample {
    private let session = LanguageModelSession(instructions: "You are a helpful writing assistant.")
    private let prefix = "The user is asking about: "

    func userBeganComposing() {
        // Use an earlier UI event with at least one second of natural lead time.
        // The submitted prompt must start with this exact prefix for cache reuse.
        session.prewarm(promptPrefix: Prompt(prefix))
    }

    func userSubmitted(_ topic: String) async throws -> String {
        let response = try await session.respond(to: Prompt(prefix + topic))
        return response.content
    }
}

#Playground {
    let example = PrefixPrewarmingExample()
    // Wire composing and submit events separately, as in the basic example.
    // Do not sleep or delay submission for a cache; a speedup is not guaranteed.
    _ = example
}
