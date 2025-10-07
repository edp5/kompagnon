import express from "express";

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

export default authenticationRoutes;
