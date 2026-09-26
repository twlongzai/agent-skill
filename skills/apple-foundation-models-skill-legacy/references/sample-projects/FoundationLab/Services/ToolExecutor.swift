//
//  ToolExecutor.swift
//  FoundationLab
//
//  Created by Rudrank Riyam on 6/29/25.
//

import Foundation
import FoundationModels
import Observation

/// Evidence supplied by the host after checking a tool receipt or app state.
enum ToolActionVerification {
  case confirmed
  case failed(String)
  case notVerified
}

/// A reusable helper class that eliminates code duplication across tool views
/// by providing a standardized pattern for executing tool operations
@MainActor
@Observable
final class ToolExecutor {
  var isRunning = false
  var result: String = ""
  var errorMessage: String?
  var successMessage: String?
  var completionMessage: String?
  private(set) var actionVerified = false

  /// Executes a tool operation with standardized state management
  func execute<T: Tool>(
    tool: T,
    prompt: String,
    successMessage: String? = nil,
    verifyAction: (@MainActor () async throws -> ToolActionVerification)? = nil,
    clearForm: (@MainActor () -> Void)? = nil
  ) async {
    await performExecution(successMessage: successMessage, verifyAction: verifyAction, clearForm: clearForm) {
      let session = LanguageModelSession(tools: [tool])
      let response = try await session.respond(to: Prompt(prompt))
      return response.content
    }
  }

  /// Executes a tool operation using PromptBuilder
  func executeWithPromptBuilder<T: Tool>(
    tool: T,
    successMessage: String? = nil,
    verifyAction: (@MainActor () async throws -> ToolActionVerification)? = nil,
    clearForm: (@MainActor () -> Void)? = nil,
    @PromptBuilder promptBuilder: () -> Prompt
  ) async {
    await performExecution(successMessage: successMessage, verifyAction: verifyAction, clearForm: clearForm) {
      let session = LanguageModelSession(tools: [tool])
      let response = try await session.respond(to: promptBuilder())
      return response.content
    }
  }

  /// Executes a tool operation with a custom session configuration
  func executeWithCustomSession(
    sessionBuilder: () -> LanguageModelSession,
    prompt: String,
    successMessage: String? = nil,
    verifyAction: (@MainActor () async throws -> ToolActionVerification)? = nil,
    clearForm: (@MainActor () -> Void)? = nil
  ) async {
    await performExecution(successMessage: successMessage, verifyAction: verifyAction, clearForm: clearForm) {
      let session = sessionBuilder()
      let response = try await session.respond(to: Prompt(prompt))
      return response.content
    }
  }

  /// Private helper that encapsulates common state management logic
  private func performExecution(
    successMessage: String? = nil,
    verifyAction: (@MainActor () async throws -> ToolActionVerification)? = nil,
    clearForm: (@MainActor () -> Void)? = nil,
    operation: () async throws -> String
  ) async {
    isRunning = true
    defer { isRunning = false }
    errorMessage = nil
    completionMessage = nil
    actionVerified = false
    self.successMessage = nil
    result = ""

    do {
      result = try await operation()

      completionMessage = "Response generated. Tool actions have not been verified."
      // A model response alone is not a receipt for a tool action.
      let verification = try await verifyAction?() ?? .notVerified
      switch verification {
      case .confirmed:
        actionVerified = true
        completionMessage = nil
        self.successMessage = successMessage ?? "Tool action verified."
        clearForm?()
      case .failed(let message):
        errorMessage = message
        completionMessage = nil
      case .notVerified:
        break // Keep the input available for inspection or reconciliation.
      }

    } catch {
      errorMessage = FoundationModelsErrorHandler.handleError(error)
      self.successMessage = nil
      completionMessage = nil
    }
  }

  /// Clears all state
  func clear() {
    isRunning = false
    actionVerified = false
    completionMessage = nil
    result = ""
    errorMessage = nil
    successMessage = nil
  }
}
