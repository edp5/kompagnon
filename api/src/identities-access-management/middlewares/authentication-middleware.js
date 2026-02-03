import ERRORS from "../errors.js";
import { findUserById } from "../repositories/user-repository.js";
import { decodedToken } from "../services/token-service.js";
import { logger } from "../../../logger.js";

/**
 * Authentication Middleware
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {Function} decodedTokenService - Function to decode token
 * @param {Function} findUserRepository - Function to find user by ID
 * @returns {Promise<*>} - Returns a promise that resolves to the response or calls next()
 */
async function authenticationMiddleware(
  req,
  res,
  next,
  decodedTokenService = decodedToken,
  findUserRepository = findUserById,
) {
  try {
    const token = req.headers.authorisation;

    if (!token) {
      return res.status(401).json({ message: ERRORS.TOKEN.REQUIRED });
    }

    let decoded;
    try {
      decoded = decodedTokenService(token);
    } catch (error) {
      return res
        .status(401)
        .json({ message: error.message || ERRORS.TOKEN.INVALID_TOKEN });
    }

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: ERRORS.TOKEN.INVALID_TOKEN });
    }

    const user = await findUserRepository(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: ERRORS.TOKEN.INVALID_TOKEN });
    }

    req.auth = {
      firstName: user.firstname,
      lastName: user.lastname,
      userId: user.id,
    };

    next();
  } catch (error) {
    logger.error(`Error in authenticationMiddleware: ${error}`);
    return res.status(401).json({ message: ERRORS.INTERNAL_SERVER_ERROR });
  }
}

export { authenticationMiddleware };
