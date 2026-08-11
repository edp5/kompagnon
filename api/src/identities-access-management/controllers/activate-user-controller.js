import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../logger.js";
import { decodedToken } from "../services/token-service.js";
import usecases from "../usecases/index.js";

// French phone number, lenient: optional +33/0033/0 prefix then 9 digits,
// separators (spaces, dots, dashes) tolerated. e.g. 0612345678, +33 6 12 34 56 78.
const FRENCH_PHONE_PATTERN = /^(?:(?:\+|00)33[\s.-]?|0)[1-9](?:[\s.-]?\d{2}){4}$/;

const activateUserSchema = celebrate({
  [Segments.HEADERS]: Joi.object({
    authorization: Joi.string().pattern(/^Bearer .+$/).required(),
  }).unknown(),
  [Segments.BODY]: Joi.object({
    phoneNumber: Joi.string().pattern(FRENCH_PHONE_PATTERN).required(),
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
    const { phoneNumber } = req.body;

    const decodedData = decodedTokenService(token);
    const userId = decodedData.userId;

    await activateUserUsecase(userId, phoneNumber);

    return res.status(201).send();
  } catch (error) {
    logger.error({ err: error }, "Error during user activation");
    next(error);
  }
}

export { activateUserController, activateUserSchema };
