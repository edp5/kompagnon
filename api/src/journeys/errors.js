import { DomainError } from "../shared/domain/models/domain-error.js";

/**
 * Throw when a journey is not found
 */
class JourneyNotFound extends DomainError {
  constructor() {
    super("Journey not found", 404);
  }
}

/**
 * Throw when user has no role
 */
class UserHasNoRole extends DomainError {
  constructor() {
    super("User has no role", 403);
  }
}

export { JourneyNotFound, UserHasNoRole };
