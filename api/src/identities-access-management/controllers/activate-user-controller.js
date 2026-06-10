import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../logger.js";
import ERRORS, { MESSAGE } from "../errors.js";
import { activateUserById, findUserById } from "../repositories/user-repository.js";
import { decodedToken } from "../services/token-service.js";

const activateUserSchema = celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().pattern(/^Bearer .+$/).required(),
  }).unknown(),
});

/**
 * Activate User Controller
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {Function} findUserByIdRepository - Function to find user by ID
 * @param {Function} activateUserByIdRepository - Function to activate user by ID
 * @param {Function} decodedTokenService - Function to decode JWT token
 * @returns {Promise<*>} - Express response
 */
async function activateUserController(
  req,
  res,
  next,
  findUserByIdRepository = findUserById,
  activateUserByIdRepository = activateUserById,
  decodedTokenService = decodedToken,
) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedData = decodedTokenService(token);
    const userId = decodedData.userId;

    const user = await findUserByIdRepository(userId);

    if (!user) {
      logger.warn(`Activation attempt for non-existent user ${userId}`);
      return res.status(401).json({ error: ERRORS.USER.NOT_FOUND_OR_ALREADY_ACTIVE });
    }

    if (user.isActive) {
      logger.info("Activation attempt for already active user", { userId });
      return res.status(401).json({ error: ERRORS.USER.NOT_FOUND_OR_ALREADY_ACTIVE });
    }

    await activateUserByIdRepository(userId);

    return res.status(201).json({ message: MESSAGE.USER_ACTIVATED_SUCCESSFULLY });
  } catch (error) {
    logger.error({ err: error }, "Error during user activation");
    return res.status(500).json({ error: ERRORS.INTERNAL_SERVER_ERROR });
  }
}

export { activateUserController, activateUserSchema };

