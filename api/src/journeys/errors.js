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
 * Throw when the journey is not of this user
 */
class JourneyIsNotOfThisUser extends DomainError {
  constructor() {
    super("Journey is not of this user", 403);
  }
}

/**
 * Throw when the journey is already accepted
 */
class AlreadyAccepted extends DomainError {
  constructor() {
    super("Journey is already accepted", 400);
  }
}

/**
 * Throw when journey is already rejected
 */
class AlreadyRejected extends DomainError {
  constructor() {
    super("Journey is already rejected", 400);
  }
}

/**
 * Throw when journey is already cancelled
 */
class AlreadyCancelled extends DomainError {
  constructor() {
    super("Journey is already cancelled", 400);
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

export { AlreadyAccepted, AlreadyCancelled, AlreadyRejected, JourneyIsNotOfThisUser, JourneyNotFound, UserHasNoRole };
