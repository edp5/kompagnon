import express from "express";

import { authMiddleware } from "../../shared/infrastructure/middlewares/auth-middleware.js";
import { getUserProfileController } from "../controllers/get-user-profile-controller.js";
import { setTrustedContactController, setTrustedContactSchema } from "../controllers/set-trusted-contact-controller.js";

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
 *                     trustedContact:
 *                       type: object
 *                       nullable: true
 *                       description: The person to reach if a journey goes wrong. Null when the user has not set one.
 *                       properties:
 *                         name:
 *                           type: string
 *                           example: Camille
 *                         phoneNumber:
 *                           type: string
 *                           example: "0612345678"
 *       404:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
usersRoutes.get("/api/users/profile", authMiddleware, getUserProfileController);

/**
 * @swagger
 * /api/users/trusted-contact:
 *   put:
 *     tags:
 *       - Users
 *     summary: Set or clear the trusted contact
 *     description: |
 *       Records the person the user wants reached if a journey goes wrong. It
 *       lives on the account rather than on the device so it survives a
 *       reinstall. Sending no phone number clears it, which is how a user takes
 *       back the permission to have that person called about them.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 nullable: true
 *                 example: Camille
 *               phoneNumber:
 *                 type: string
 *                 nullable: true
 *                 example: "0612345678"
 *     responses:
 *       200:
 *         description: The contact as it now stands, or null once cleared
 *       400:
 *         description: The phone number is not a French mobile number
 *       401:
 *         description: Unauthorized
 */
usersRoutes.put("/api/users/trusted-contact", authMiddleware, setTrustedContactSchema, setTrustedContactController);

export default usersRoutes;
