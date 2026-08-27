import express from "express";

import { authMiddleware } from "../../../shared/infrastructure/middlewares/auth-middleware.js";
import { checkMatchApiKey } from "../../infrastructure/middlewares/check-match-api-key.js";
import { getJourneyController, getJourneyControllerSchema } from "../controllers/get-journey-controller.js";
import { getJourneyMatchesController, getJourneyMatchesControllerSchema } from "../controllers/get-journey-matches-controller.js";
import { getJourneysController, getJourneysControllerSchema } from "../controllers/get-journeys-controller.js";
import {
  addTrackingPointController,
  addTrackingPointSchema,
  getTrackingPointsController,
  journeyIdParamSchema,
  updateJourneyStatusController,
  updateJourneyStatusSchema as updateJourneyTrackingStatusSchema,
} from "../controllers/journey-tracking-controller.js";
import {
  notifyNewMatchController,
  notifyNewMatchControllerSchema,
} from "../controllers/notify-new-match-controller.js";
import { recordJourneyController, recordJourneyControllerSchema } from "../controllers/record-journey-controller.js";
import {
  updateFoundJourneyStatusController,
  updateFoundJourneyStatusSchema,
} from "../controllers/update-found-journey-status-controller.js";

const journeysRoutes = express.Router();

/**
 * @swagger
 * /api/journeys:
 *   post:
 *     tags:
 *       - Journeys
 *     summary: Record a new journey
 *     description: Records a journey for the authenticated user as a passenger or companion depending on the user role.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - departureAddress
 *               - arrivalAddress
 *               - departureLat
 *               - departureLon
 *               - arrivalLat
 *               - arrivalLon
 *               - departureTime
 *               - arrivalTime
 *             properties:
 *               departureAddress:
 *                 type: string
 *                 example: 10 Rue de Rivoli, Paris
 *               arrivalAddress:
 *                 type: string
 *                 example: 5 Avenue Anatole France, Paris
 *               departureLat:
 *                 type: number
 *                 example: 48.8566
 *               departureLon:
 *                 type: number
 *                 example: 2.3522
 *               arrivalLat:
 *                 type: number
 *                 example: 48.8584
 *               arrivalLon:
 *                 type: number
 *                 example: 2.2945
 *               departureTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-05-16T08:30:00.000Z
 *               arrivalTime:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-05-16T09:00:00.000Z
 *     responses:
 *       201:
 *         description: Journey recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *               data :
 *                 type: object
 *                 properties:
 *                   journeyId:
 *                     type: string
 *                     example: 123e4567-e89b-12d3-a456-426614174000
 *       400:
 *         description: Invalid user role or invalid request body
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
journeysRoutes.post("/api/journeys", authMiddleware, recordJourneyControllerSchema, recordJourneyController);

/**
 * @swagger
 * /api/journeys:
 *   get:
 *     tags:
 *       - Journeys
 *     summary: List all journeys of the authenticated user
 *     description: Returns all journeys (passenger or companion) belonging to the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of journeys
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
 *                       departureAddress:
 *                         type: string
 *                       arrivalAddress:
 *                         type: string
 *                       departureTime:
 *                         type: string
 *                         format: date-time
 *                       arrivalTime:
 *                         type: string
 *                         format: date-time
 *                       isMatched:
 *                         type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User has no role
 *       500:
 *         description: Internal server error
 */
journeysRoutes.get("/api/journeys", authMiddleware, getJourneysControllerSchema, getJourneysController);

/**
 * @swagger
 * /api/journeys/{journeyId}:
 *   get:
 *     tags:
 *       - Journeys
 *     summary: Get a journey's information
 *     description: Returns the information of a journey belonging to the authenticated user. The journey is read from the passenger or companion table depending on the user role.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: journeyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The id of the journey to retrieve.
 *     responses:
 *       200:
 *         description: Journey found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 12
 *                     userId:
 *                       type: integer
 *                       example: 3
 *                     departureAddress:
 *                       type: string
 *                       example: 10 Rue de Rivoli, Paris
 *                     arrivalAddress:
 *                       type: string
 *                       example: 5 Avenue Anatole France, Paris
 *                     departureLat:
 *                       type: number
 *                       example: 48.8566
 *                     departureLon:
 *                       type: number
 *                       example: 2.3522
 *                     arrivalLat:
 *                       type: number
 *                       example: 48.8584
 *                     arrivalLon:
 *                       type: number
 *                       example: 2.2945
 *                     departureTime:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-05-16T08:30:00.000Z
 *                     arrivalTime:
 *                       type: string
 *                       format: date-time
 *                       example: 2026-05-16T09:00:00.000Z
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: Journey not found or not owned by the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Journey not found
 *       500:
 *         description: Internal server error
 */
journeysRoutes.get(
  "/api/journeys/:journeyId",
  authMiddleware,
  getJourneyControllerSchema,
  getJourneyController,
);

/**
 * @swagger
 * /api/journeys/found/{foundJourneyId}:
 *   put:
 *     tags:
 *       - Journeys
 *     summary: Update found journey status
 *     description: Updates the status of a found journey for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: foundJourneyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the found journey to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - updatedStatus
 *             properties:
 *               updatedStatus:
 *                 type: boolean
 *     responses:
 *       204:
 *         description: Found journey status updated successfully
 *       400:
 *         description: Validation failed
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Found journey not found
 *       500:
 *         description: Internal server error
 */
journeysRoutes.put(
  "/api/journeys/found/:foundJourneyId",
  authMiddleware,
  updateFoundJourneyStatusSchema,
  updateFoundJourneyStatusController,
);

/**
 * @swagger
 * /api/journeys/{journeyId}/matches:
 *   get:
 *     tags:
 *       - Journeys
 *     summary: Get the matches of a journey
 *     description: Returns the matches of a journey owned by the authenticated user, with the other user's name, their journey and both statuses. Matches declined by either side are excluded.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: journeyId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The id of the journey whose matches to retrieve.
 *     responses:
 *       200:
 *         description: List of matches
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
 *                       foundJourneyId:
 *                         type: integer
 *                         example: 3
 *                       user:
 *                         type: object
 *                         properties:
 *                           firstname:
 *                             type: string
 *                             example: Adrien
 *                           lastname:
 *                             type: string
 *                             example: Le Guen
 *                       journey:
 *                         type: object
 *                         properties:
 *                           departureAddress:
 *                             type: string
 *                           arrivalAddress:
 *                             type: string
 *                           departureTime:
 *                             type: string
 *                             format: date-time
 *                           arrivalTime:
 *                             type: string
 *                             format: date-time
 *                       myStatus:
 *                         type: string
 *                         example: waiting
 *                       otherStatus:
 *                         type: string
 *                         example: accepted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Journey not found or not owned by the user
 *       500:
 *         description: Internal server error
 */
journeysRoutes.get(
  "/api/journeys/:journeyId/matches",
  authMiddleware,
  getJourneyMatchesControllerSchema,
  getJourneyMatchesController,
);

/**
 * @swagger
 * /api/journeys/{journeyId}/tracking:
 *   post:
 *     tags:
 *       - Journeys
 *     summary: Record a GPS tracking point for a journey
 *     description: Saves the current GPS position of the user for a journey in progress. Automatically sets the journey status to in_progress if not already started.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: journeyId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - lat
 *               - lon
 *             properties:
 *               lat:
 *                 type: number
 *                 example: 48.8566
 *               lon:
 *                 type: number
 *                 example: 2.3522
 *     responses:
 *       201:
 *         description: Tracking point recorded
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Journey does not belong to user
 *       404:
 *         description: Journey not found
 *       500:
 *         description: Internal server error
 */
journeysRoutes.post(
  "/api/journeys/:journeyId/tracking",
  authMiddleware,
  addTrackingPointSchema,
  addTrackingPointController,
);

/**
 * @swagger
 * /api/journeys/{journeyId}/tracking:
 *   get:
 *     tags:
 *       - Journeys
 *     summary: Get GPS tracking points for a journey
 *     description: Returns all recorded GPS positions for a journey in chronological order.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: journeyId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of tracking points
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Journey does not belong to user
 *       404:
 *         description: Journey not found
 *       500:
 *         description: Internal server error
 */
journeysRoutes.get(
  "/api/journeys/:journeyId/tracking",
  authMiddleware,
  journeyIdParamSchema,
  getTrackingPointsController,
);

/**
 * @swagger
 * /api/journeys/{journeyId}/status:
 *   patch:
 *     tags:
 *       - Journeys
 *     summary: Update the tracking status of a journey
 *     description: Transitions the journey tracking status. Valid transitions are not_started → in_progress → completed.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: journeyId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [not_started, in_progress, completed]
 *     responses:
 *       204:
 *         description: Status updated
 *       400:
 *         description: Invalid status transition
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Journey does not belong to user
 *       404:
 *         description: Journey not found
 *       500:
 *         description: Internal server error
 */
journeysRoutes.patch(
  "/api/journeys/:journeyId/status",
  authMiddleware,
  updateJourneyTrackingStatusSchema,
  updateJourneyStatusController,
);

/**
 * @swagger
 * /api/journeys/match:
 *   post:
 *     tags:
 *       - Journeys
 *     summary: Notify users that a new match is found
 *     description: This endpoint must be called by the algorithm to notify users by email that a new match has been found.
 *     security:
 *       - apiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - data
 *             properties:
 *               data:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: Match notification sent successfully
 *       403:
 *         description: Api key is invalid.
 */
journeysRoutes.post("/api/journeys/match", checkMatchApiKey, notifyNewMatchControllerSchema, notifyNewMatchController);

export default journeysRoutes;
