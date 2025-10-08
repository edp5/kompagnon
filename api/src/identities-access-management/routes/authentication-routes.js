import express from "express";

import { activateUserController } from "../controllers/index.js";
import { registerUserController, registerUserSchema } from "../controllers/register-user-controller.js";

const authenticationRoutes = express.Router();

/**
 * @swagger
 * /api/authentication/register:
 *   post:
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
 * /api/authentication/activate:
 *   get:
 *     summary: Activate a user account
 *     description: Activates a user account using the token sent by email
 *     parameters:
 *       - in: query
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Activation token sent by email
 *     responses:
 *       201:
 *         description: User activated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User activated successfully
 *       400:
 *         description: Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid or expired token
 *       401:
 *         description: User not found or already active
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: User not found or already active
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
authenticationRoutes.get("/api/authentication/activate", activateUserController);

export default authenticationRoutes;
