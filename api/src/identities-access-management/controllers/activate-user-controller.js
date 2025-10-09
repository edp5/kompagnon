import { logger } from "../../../logger.js";
import { activateUserById, findUserById } from "../repositories/user-repository.js";
import { decodedToken } from "../services/token-service.js";

/**
 * Controller to activate a user account
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} findUserByIdRepository - Function to find user by ID
 * @param {Function} activateUserByIdRepository - Function to activate user by ID
 * @param {Function} decodedTokenService - Function to decode JWT token
 * @returns {Promise<void>}
 */
async function _activateUserController(
  req,
  res,
  findUserByIdRepository,
  activateUserByIdRepository,
  decodedTokenService,
) {
  try {
    const token = req.query.token;

    if (!token) {
      logger.warn("Activation attempt without token");
      return res.status(400).json({ error: "Token is required" });
    }

    // Decode and verify token
    let decodedData;
    try {
      decodedData = decodedTokenService(token);
    } catch (error) {
      logger.warn("Invalid token provided for activation", { error: error.message });
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const userId = decodedData.userId;

    // Find user by ID
    const user = await findUserByIdRepository(userId);

    if (!user) {
      logger.warn("Activation attempt for non-existent user", { userId });
      return res.status(401).json({ error: "User not found or already active" });
    }

    // Check if user is already active
    if (user.isActive) {
      logger.info("Activation attempt for already active user", { userId });
      return res.status(401).json({ error: "User not found or already active" });
    }

    // Activate the user
    await activateUserByIdRepository(userId);

    logger.info("User activated successfully", { userId });
    return res.status(201).json({ message: "User activated successfully" });
  } catch (error) {
    logger.error("Error during user activation", { error });
    return res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Wrapper function to use default dependencies for production
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @returns {Promise<void>}
 */
async function activateUserController(req, res) {
  return _activateUserController(req, res, findUserById, activateUserById, decodedToken);
}

export default activateUserController;
export { _activateUserController };

