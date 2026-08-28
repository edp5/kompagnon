import { markAllNotificationsAsReadByUserId } from "../repositories/notifications-repository.js";

/**
 * Marks every notification belonging to a user as read.
 * @param {object} params - The parameters.
 * @param {number} params.userId - The id of the user.
 * @returns {Promise<void>}
 */
async function markAllNotificationsAsReadUsecase({ userId }) {
  await markAllNotificationsAsReadByUserId(userId);
}

export { markAllNotificationsAsReadUsecase };
