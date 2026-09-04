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

/**
 * Throw when the matching algorithm url is not configured
 */
class MatchingAlgorithmNotConfigured extends DomainError {
  constructor() {
    super("Matching algorithm api url is not configured", 500);
  }
}

/**
 * Throw when the matching algorithm answers with a non-ok status
 */
class MatchingAlgorithmRequestFailed extends DomainError {
  constructor(status) {
    super(`Matching algorithm request failed with status ${status}`, 502);
  }
}

/**
 * Throw when the api key to notify found journey is invalid
 */
class InvalidNotifyApiKeyError extends DomainError {
  constructor() {
    super("Invalid notify api key", 403);
  }
}

/**
 * Throw when a found journey is not found
 */
class FoundJourneyNotFound extends DomainError {
  constructor() {
    super("Found journey not found", 404);
  }
}

/**
 * Throw when trying to review a journey that is not completed
 */
class JourneyNotCompletedError extends DomainError {
  constructor() {
    super("Journey is not completed", 400);
  }
}

/**
 * Throw when a user attempts an action on a journey they did not participate in
 */
class UserNotParticipantError extends DomainError {
  constructor() {
    super("User is not a participant of this journey", 403);
  }
}

/**
 * Throw when a review has already been submitted for a journey by the user
 */
class ReviewAlreadySubmittedError extends DomainError {
  constructor() {
    super("Review already submitted for this journey", 409);
  }
}

/**
 * Throw when rating is invalid
 */
class InvalidRatingError extends DomainError {
  constructor() {
    super("Rating must be an integer between 1 and 5", 400);
  }
}

export {
  AlreadyAccepted,
  AlreadyCancelled,
  AlreadyRejected,
  FoundJourneyNotFound,
  InvalidNotifyApiKeyError,
  InvalidRatingError,
  JourneyIsNotOfThisUser,
  JourneyNotCompletedError,
  JourneyNotFound,
  MatchingAlgorithmNotConfigured,
  MatchingAlgorithmRequestFailed,
  ReviewAlreadySubmittedError,
  UserHasNoRole,
  UserNotParticipantError,
};

