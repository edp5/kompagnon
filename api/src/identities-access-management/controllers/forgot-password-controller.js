import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../logger.js";
import usecases from "../usecases/index.js";

const forgotPasswordSchema = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().required().email(),
  }),
});

/**
 * Forgot Password Controller
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {Function} requestResetUsecase - Usecase to handle forgot password request
 * @returns {Promise<*>} Returns a promise that resolves to the response
 */
async function forgotPasswordController(
  req,
  res,
  next,
  requestResetUsecase = usecases.requestPasswordResetUsecase,
) {
  try {
    const { email } = req.body;
    const result = await requestResetUsecase({ email });
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    logger.error({ err: error }, "Error in forgotPasswordController");
    next(error);
  }
}

export { forgotPasswordController, forgotPasswordSchema };
