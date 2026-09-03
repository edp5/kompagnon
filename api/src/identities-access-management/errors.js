import { DomainError } from "../shared/domain/models/domain-error.js";

/**
 *  Throw when the user is not found in the database
 */
class UserNotFoundError extends DomainError {
  constructor() {
    super("User not found", 404);
  }
}

/**
 * Throw when the user is already active and an activation attempt is made
 */
class UserIsAlreadyActive extends DomainError {
  constructor() {
    super("User is already active", 409);
  }
}

/**
 * Throw when invalid credentials
 */
class InvalidCredentialsError extends DomainError {
  constructor() {
    super("Invalid credentials", 401);
  }
}

/**
 * Throw when the phone number is already used
 */
class PhoneNumberAlreadyUsedError extends DomainError {
  constructor() {
    super("Phone number is already used", 409);
  }
}

/**
 * Throw when the password reset token is invalid or expired
 */
class InvalidOrExpiredPasswordResetTokenError extends DomainError {
  constructor() {
    super("Invalid or expired password reset token", 400);
  }
}

export {
  InvalidCredentialsError,
  InvalidOrExpiredPasswordResetTokenError,
  PhoneNumberAlreadyUsedError,
  UserIsAlreadyActive,
  UserNotFoundError,
};

