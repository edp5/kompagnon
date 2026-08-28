import { NotificationIsNotOfThisUser, NotificationNotFound } from "../errors.js";
import { findNotificationById, markNotificationAsReadByNotificationId } from "../repositories/notifications-repository.js";

/**
 * Marks a single notification as read, ensuring it belongs to the requesting user.
 * @param {object} params - The parameters.
 * @param {number} params.userId - The id of the user marking the notification as read.
 * @param {number} params.notificationId - The id of the notification to mark as read.
 * @returns {Promise<void>}
 */
async function markNotificationAsReadUsecase({ userId, notificationId }) {
  const notification = await findNotificationById(notificationId);
  if (!notification) {
    throw new NotificationNotFound();
  }
  if (notification.userId !== userId) {
    throw new NotificationIsNotOfThisUser();
  }
  await markNotificationAsReadByNotificationId(notificationId);
}

export { markNotificationAsReadUsecase };
