import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../logger.js";
import { decodedToken } from "../services/token-service.js";
import usecases from "../usecases/index.js";

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
 * @param {Function} activateUserUsecase - Function to activate user by ID
 * @param {Function} decodedTokenService - Function to decode JWT token
 * @returns {Promise<*>} - Express response
 */
async function activateUserController(
  req,
  res,
  next,
  activateUserUsecase = usecases.activateUserUsecase,
  decodedTokenService = decodedToken,
) {
  try {
    const token = req.headers.authorization.split(" ")[1];

    const decodedData = decodedTokenService(token);
    const userId = decodedData.userId;

    await activateUserUsecase(userId);

    return res.status(201).send();
  } catch (error) {
    logger.error({ err: error }, "Error during user activation");
    next(error);
  }
}

export { activateUserController, activateUserSchema };

