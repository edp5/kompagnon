import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../logger.js";
import { USER_ROLE } from "../../shared/constants.js";
import { decodedToken } from "../services/token-service.js";
import usecases from "../usecases/index.js";

const activateUserSchema = celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().pattern(/^Bearer .+$/).required(),
  }).unknown(),
  [Segments.BODY]: Joi.object({
    phoneNumber: Joi.string().pattern(/^0[67]\d{8}$/).required(),
    role: Joi.string().valid(USER_ROLE.COMPANION, USER_ROLE.PASSENGER).required(),
  }),
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
    const { phoneNumber, role } = req.body;

    await activateUserUsecase({ userId, phoneNumber, role });

    return res.status(201).send();
  } catch (error) {
    logger.error({ err: error }, "Error during user activation");
    next(error);
  }
}

export { activateUserController, activateUserSchema };

