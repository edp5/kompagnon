import { DomainError } from "../shared/domain/models/domain-error.js";

const ERRORS = {
  AUTHENTICATION: {
    INVALID_CREDENTIALS: "Invalid credentials",
  },
  USER: {
    NOT_FOUND_OR_ALREADY_ACTIVE: "User not found or already active",
  },
  INTERNAL_SERVER_ERROR: "Internal server error",
};

const MESSAGE = {
  USER_ACTIVATED_SUCCESSFULLY: "User activated successfully",
};

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

export default ERRORS;
export { MESSAGE, UserIsAlreadyActive, UserNotFoundError };
