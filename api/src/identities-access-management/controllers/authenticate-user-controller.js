import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../logger.js";
import usecases from "../usecases/index.js";

const authenticateUserSchema = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

/**
 * Authenticate User Controller
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {Function} authenticateUsecase - Usecase function to authenticate user with credentials
 * @returns {Promise<*>} - Returns a promise that resolves to the response
 */
async function authenticateUserController(
  req, res, next,
  authenticateUsecase = usecases.authenticateUserWithCredentialsUsecase,
) {
  try {
    const { email, password } = req.body;
    const authenticator = await authenticateUsecase({ email, password });
    return res.status(200).json({
      data: authenticator,
    });
  } catch (error) {
    logger.error({ err: error }, "Error in authenticateUserController");
    next(error);
  }
}

export { authenticateUserController, authenticateUserSchema };
