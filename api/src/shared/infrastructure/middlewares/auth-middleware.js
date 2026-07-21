import { logger } from "../../../../logger.js";
import { UserNotFoundError } from "../../../identities-access-management/errors.js";
import { findUserById } from "../../../identities-access-management/repositories/user-repository.js";
import { decodedToken } from "../../../identities-access-management/services/token-service.js";
import { AuthenticationRequiredError, InvalidTokenFormatError, InvalidTokenPayloadError } from "../../errors.js";

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
      throw new AuthenticationRequiredError();
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      throw new InvalidTokenFormatError();
    }

    const decoded = decodedToken(token);

    if (!decoded || !decoded.userId) {
      throw new InvalidTokenPayloadError();
    }

    const user = await findUserById(decoded.userId);

    if (!user || !user.isActive) {
      throw new UserNotFoundError();
    }

    req.auth = {
      userId: user.id,
      userType: user.userType,
    };

    next();
  } catch (error) {
    logger.error({ err: error }, "Error in authMiddleware");
    next(error);
  }
}
