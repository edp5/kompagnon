import { logger } from "../../../logger.js";
import usecases from "../usecases/index.js";

/**
 * Return authenticated user's profile.
 * Requires authMiddleware to populate req.auth.userId.
 * @param {object} req - Express request containing the authenticated user id on req.auth.
 * @param {object} res - Express response used to return profile payload or an error.
 * @param {Function} next - Express next middleware function.
 * @param {Function} getUserDataUsecase - Function to fetch the profile by authenticated user id.
 * @returns {Promise<object>} HTTP response with user profile data or internal server error.
 */
async function getUserProfileController(req, res, next, getUserDataUsecase = usecases.getUserDataUsecase) {
  try {
    const { userId } = req.auth;

    const userProfile = await getUserDataUsecase(userId);

    return res.status(200).json({
      data: userProfile,
    });
  } catch (error) {
    logger.error({ err: error }, "Error in getUserProfileController.");
    next(error);
  }
}

export { getUserProfileController };
