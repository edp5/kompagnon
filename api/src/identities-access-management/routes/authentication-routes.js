import express from "express";

import { activateUserController, activateUserSchema } from "../controllers/activate-user-controller.js";
import { authenticateUserController, authenticateUserSchema } from "../controllers/authenticate-user-controller.js";
import { registerUserController, registerUserSchema } from "../controllers/register-user-controller.js";

const authenticationRoutes = express.Router();

/**
 * @swagger
 * /api/authentication/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new user
 *     description: Register a new user with email, firstname, lastname, password, birthday, and userType.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.net
 *               firstname:
 *                 type: string
 *                 example: John
 *               lastname:
 *                 type: string
 *                 example: Doe
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *               birthday:
 *                 type: string
 *                 example: 01/01/2001
 *               userType:
 *                 type: string
 *                 enum: [admin, user, moderator]
 *                 example: user
 *     responses:
 *       201:
 *         description: User registered successfully
 *       500:
 *         description: Internal server error
 */

authenticationRoutes.post("/api/authentication/register", registerUserSchema, registerUserController);

/**
 * @swagger
 * /api/authentication/authenticate:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Authenticate a user
 *     description: Authenticate a user with email and password, returning userId and JWT token upon success.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john.doe@example.net
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       200:
 *         description: Authentication successful with userId and JWT token
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
 *                     token:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid credentials
 *       500:
 *         description: Internal server error
 */
authenticationRoutes.post("/api/authentication/authenticate", authenticateUserSchema, authenticateUserController);

/**
 * @swagger
 * /api/authentication/activate:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Activate a user account
 *     description: Activates a user account using the token sent by email
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: User activated successfully
 *       404:
 *         description: User not found
 *       409:
 *         description: User is already active
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Internal server error
 */
authenticationRoutes.get("/api/authentication/activate", activateUserSchema, activateUserController);

export default authenticationRoutes;
