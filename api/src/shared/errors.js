import { DomainError } from "./domain/models/domain-error.js";

/**
 * Throw when authentication is required
 */
class AuthenticationRequiredError extends DomainError {
  constructor() {
    super("Authentication is required", 401);
  }
}

/**
 * Throw when token format is invalid
 */
class InvalidTokenFormatError extends DomainError {
  constructor() {
    super("Invalid token format", 401);
  }
}

/**
 * Throw when invalid token payload
 */
class InvalidTokenPayloadError extends DomainError {
  constructor() {
    super("Invalid token payload", 401);
  }
}

export { AuthenticationRequiredError, InvalidTokenFormatError, InvalidTokenPayloadError };
