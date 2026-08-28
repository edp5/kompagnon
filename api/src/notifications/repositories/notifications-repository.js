import { knex } from "../../../db/knex-database-connection.js";

const TABLE_NAME = "notifications";

/**
 * Saves a new notification for a user.
 * @param {object} params - Notification details.
 * @param {number} params.userId - ID of the user the notification is for.
 * @param {string} params.type - The notification type (see NOTIFICATION_TYPE).
 * @param {string} params.title - The notification title.
 * @param {string} params.message - The notification message.
 * @returns {Promise<*>} - The ID of the saved notification.
 */
async function saveNotification({ userId, type, title, message }) {
  const [{ id }] = await knex(TABLE_NAME).insert({ userId, type, title, message }).returning("id");
  return id;
}

/**
 * Finds all notifications belonging to a user, most recent first.
 * @param {number} userId - ID of the user.
 * @returns {Promise<Array>} - The user's notifications.
 */
async function findNotificationsByUserId(userId) {
  return await knex(TABLE_NAME).where({ userId }).orderBy("created_at", "desc");
}

/**
 * Finds a notification by its ID.
 * @param {number} notificationId - ID of the notification to find.
 * @returns {Promise<*>} - The notification record if found, otherwise null.
 */
async function findNotificationById(notificationId) {
  const notification = await knex(TABLE_NAME).where({ id: notificationId }).first();
  return notification || null;
}

/**
 * Marks a single notification as read.
 * @param {number} notificationId - ID of the notification to update.
 * @returns {Promise<*>} - The number of updated records.
 */
async function markNotificationAsReadByNotificationId(notificationId) {
  return await knex(TABLE_NAME).where({ id: notificationId }).update({ isRead: true, updated_at: new Date() });
}

/**
 * Marks every notification of a user as read.
 * @param {number} userId - ID of the user.
 * @returns {Promise<*>} - The number of updated records.
 */
async function markAllNotificationsAsReadByUserId(userId) {
  return await knex(TABLE_NAME).where({ userId, isRead: false }).update({ isRead: true, updated_at: new Date() });
}

/**
 * Removes a notification by its ID.
 * @param {number} notificationId - ID of the notification to remove.
 * @returns {Promise<*>} - The number of records deleted.
 */
async function removeNotificationByNotificationId(notificationId) {
  return await knex(TABLE_NAME).where({ id: notificationId }).del();
}

export {
  findNotificationById,
  findNotificationsByUserId,
  markAllNotificationsAsReadByUserId,
  markNotificationAsReadByNotificationId,
  removeNotificationByNotificationId,
  saveNotification,
};
