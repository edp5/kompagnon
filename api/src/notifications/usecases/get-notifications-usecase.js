import { findNotificationsByUserId } from "../repositories/notifications-repository.js";

/**
 * Retrieves all notifications belonging to a user, most recent first.
 * @param {object} params - The lookup parameters.
 * @param {number} params.userId - The id of the user.
 * @returns {Promise<Array>} The list of notifications.
 */
async function getNotificationsUsecase({ userId }) {
  return await findNotificationsByUserId(userId);
}

export { getNotificationsUsecase };
