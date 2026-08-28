import { saveNotification } from "../repositories/notifications-repository.js";

/**
 * Creates and stores a new notification for a user.
 * @param {object} params - Notification details.
 * @param {number} params.userId - The id of the user the notification is for.
 * @param {string} params.type - The notification type (see NOTIFICATION_TYPE).
 * @param {string} params.title - The notification title.
 * @param {string} params.message - The notification message.
 * @returns {Promise<*>} The id of the created notification.
 */
async function createNotificationUsecase({ userId, type, title, message }) {
  return await saveNotification({ userId, type, title, message });
}

export { createNotificationUsecase };
