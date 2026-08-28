import express from "express";

import { authMiddleware } from "../../../shared/infrastructure/middlewares/auth-middleware.js";
import {
  deleteNotificationController,
  deleteNotificationControllerSchema,
} from "../controllers/delete-notification-controller.js";
import {
  getNotificationsController,
  getNotificationsControllerSchema,
} from "../controllers/get-notifications-controller.js";
import {
  markAllNotificationsAsReadController,
  markAllNotificationsAsReadControllerSchema,
} from "../controllers/mark-all-notifications-as-read-controller.js";
import {
  markNotificationAsReadController,
  markNotificationAsReadControllerSchema,
} from "../controllers/mark-notification-as-read-controller.js";

const notificationsRoutes = express.Router();

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: List the notifications of the authenticated user
 *     description: Returns every notification belonging to the authenticated user, most recent first.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                       type:
 *                         type: string
 *                         example: journey_match_found
 *                       title:
 *                         type: string
 *                       message:
 *                         type: string
 *                       isRead:
 *                         type: boolean
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
notificationsRoutes.get("/api/notifications", authMiddleware, getNotificationsControllerSchema, getNotificationsController);

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     tags:
 *       - Notifications
 *     summary: Mark all notifications as read
 *     description: Marks every notification of the authenticated user as read.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: All notifications marked as read
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
notificationsRoutes.patch(
  "/api/notifications/read-all",
  authMiddleware,
  markAllNotificationsAsReadControllerSchema,
  markAllNotificationsAsReadController,
);

/**
 * @swagger
 * /api/notifications/{notificationId}/read:
 *   patch:
 *     tags:
 *       - Notifications
 *     summary: Mark a notification as read
 *     description: Marks a single notification as read for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The id of the notification to mark as read.
 *     responses:
 *       204:
 *         description: Notification marked as read
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Notification does not belong to the authenticated user
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
notificationsRoutes.patch(
  "/api/notifications/:notificationId/read",
  authMiddleware,
  markNotificationAsReadControllerSchema,
  markNotificationAsReadController,
);

/**
 * @swagger
 * /api/notifications/{notificationId}:
 *   delete:
 *     tags:
 *       - Notifications
 *     summary: Delete a notification
 *     description: Deletes a single notification belonging to the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: notificationId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The id of the notification to delete.
 *     responses:
 *       204:
 *         description: Notification deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Notification does not belong to the authenticated user
 *       404:
 *         description: Notification not found
 *       500:
 *         description: Internal server error
 */
notificationsRoutes.delete(
  "/api/notifications/:notificationId",
  authMiddleware,
  deleteNotificationControllerSchema,
  deleteNotificationController,
);

export default notificationsRoutes;
