import { NotificationIsNotOfThisUser, NotificationNotFound } from "../errors.js";
import { findNotificationById, removeNotificationByNotificationId } from "../repositories/notifications-repository.js";

/**
 * Deletes a single notification, ensuring it belongs to the requesting user.
 * @param {object} params - The parameters.
 * @param {number} params.userId - The id of the user deleting the notification.
 * @param {number} params.notificationId - The id of the notification to delete.
 * @returns {Promise<void>}
 */
async function deleteNotificationUsecase({ userId, notificationId }) {
  const notification = await findNotificationById(notificationId);
  if (!notification) {
    throw new NotificationNotFound();
  }
  if (notification.userId !== userId) {
    throw new NotificationIsNotOfThisUser();
  }
  await removeNotificationByNotificationId(notificationId);
}

export { deleteNotificationUsecase };
