import express from "express";

import { getUserReviewsController, getUserReviewsSchema } from "../../journeys/api/controllers/get-user-reviews-controller.js";
import { authMiddleware } from "../../shared/infrastructure/middlewares/auth-middleware.js";
import { getUserProfileController } from "../controllers/get-user-profile-controller.js";

const usersRoutes = express.Router();

/**
 * @swagger
 * /api/users/profile:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get authenticated user profile
 *     description: Returns profile information for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: integer
 *                       example: 1
 *                     firstname:
 *                       type: string
 *                       example: John
 *                     lastname:
 *                       type: string
 *                       example: Doe
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: john.doe@example.net
 *                     birthday:
 *                       type: string
 *                       format: date
 *                       example: 1990-05-15
 *       404:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
usersRoutes.get("/api/users/profile", authMiddleware, getUserProfileController);

/**
 * @swagger
 * /api/users/{userId}/reviews:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get public reviews and average rating score of a user
 *     description: Returns the average star rating, total review count, and list of reviews received by the user.
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of reviews to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Offset for pagination
 *     responses:
 *       200:
 *         description: User reviews retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     averageRating:
 *                       type: number
 *                       example: 4.8
 *                     reviewCount:
 *                       type: integer
 *                       example: 12
 *                     reviews:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: integer
 *                           rating:
 *                             type: integer
 *                           comment:
 *                             type: string
 *                           created_at:
 *                             type: string
 *                             format: date-time
 *                           authorFirstname:
 *                             type: string
 *                           authorLastname:
 *                             type: string
 *       400:
 *         description: Validation error on parameters
 *       500:
 *         description: Internal server error
 */
usersRoutes.get(
  "/api/users/:userId/reviews",
  getUserReviewsSchema,
  getUserReviewsController,
);

export default usersRoutes;

