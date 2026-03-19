import { logger } from "../../../../logger.js";
import { findUserById } from "../../../identities-access-management/repositories/user-repository.js";
import { decodedToken } from "../../../identities-access-management/services/token-service.js";

/**
 * Authentication middleware that verifies the JWT token and fetches user data.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Promise<void>}
 */
export async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Authentication required" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Invalid token format" });
    }

    let decoded;
    try {
      decoded = decodedToken(token);
    } catch (error) {
      // The decodedToken service already throws an error with proper messaging
      return res.status(401).json({ message: error.message });
    }

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: "User account is inactive" });
    }

    // Attach user information to request
    req.auth = {
      userId: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      userType: user.userType,
    };

    next();
  } catch (error) {
    logger.error(`Error in authMiddleware: ${error}`);
    return res.status(500).json({ message: "Internal server error during authentication" });
  }
}
