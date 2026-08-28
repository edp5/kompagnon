import { DomainError } from "../shared/domain/models/domain-error.js";

/**
 * Throw when a notification is not found
 */
class NotificationNotFound extends DomainError {
  constructor() {
    super("Notification not found", 404);
  }
}

/**
 * Throw when the notification is not of this user
 */
class NotificationIsNotOfThisUser extends DomainError {
  constructor() {
    super("Notification is not of this user", 403);
  }
}

export { NotificationIsNotOfThisUser, NotificationNotFound };
