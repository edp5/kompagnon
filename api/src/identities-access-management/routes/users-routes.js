import express from "express";

import { authMiddleware } from "../../shared/infrastructure/middlewares/auth-middleware.js";
import { getUserProfileController } from "../controllers/get-user-profile-controller.js";

const usersRoutes = express.Router();

/**
 * @swagger
 * /api/authentication/profile:
 *   get:
 *     summary: Get the authenticated user's profile
 *     description: Returns the profile information for the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /api/authentication/profile:
 *   get:
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
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
usersRoutes.get("/api/users/profile", authMiddleware, getUserProfileController);

export default usersRoutes;
