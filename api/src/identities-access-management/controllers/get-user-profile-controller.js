import { logger } from "../../../logger.js";
import ERRORS from "../errors.js";
import { findUserById } from "../repositories/user-repository.js";

/**
 * Return authenticated user's profile.
 * Requires authMiddleware to populate req.auth.userId.
 * @param {object} req - Express request containing the authenticated user id on req.auth.
 * @param {object} res - Express response used to return profile payload or an error.
 * @param {Function} next - Express next middleware function.
 * @param {Function} findUserProfileByIdRepository - Function to fetch the profile by authenticated user id.
 * @returns {Promise<object>} HTTP response with user profile data or internal server error.
 */
async function getUserProfileController(req, res, next, findUserProfileByIdRepository = findUserById) {
  try {
    const { userId } = req.auth;

    if (!userId) {
      logger.error("Error in getUserProfileController: missing authenticated user id");
      return res.status(500).json({ message: ERRORS.INTERNAL_SERVER_ERROR });
    }

    const userProfile = await findUserProfileByIdRepository(userId);

    if (!userProfile) {
      return res.status(401).json({ message: "User not found" });
    }

    return res.status(200).json({
      data: {
        userId: userProfile.id,
        firstname: userProfile.firstname,
        lastname: userProfile.lastname,
        email: userProfile.email,
        birthday: userProfile.birthday,
        genre: userProfile.genre,
        role: userProfile.role,
        disabilities: userProfile.disabilities,
      },
    });
  } catch (error) {
    logger.error(`Error in getUserProfileController: ${error}`);
    return res.status(500).json({ message: ERRORS.INTERNAL_SERVER_ERROR });
  }
}

export { getUserProfileController };
