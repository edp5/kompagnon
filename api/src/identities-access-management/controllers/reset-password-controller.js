import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../logger.js";
import usecases from "../usecases/index.js";

const resetPasswordSchema = celebrate({
  [Segments.BODY]: Joi.object({
    token: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

/**
 * Reset Password Controller
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {Function} resetUsecase - Usecase to handle password reset
 * @returns {Promise<*>} Returns a promise that resolves to the response
 */
async function resetPasswordController(
  req,
  res,
  next,
  resetUsecase = usecases.resetPasswordUsecase,
) {
  try {
    const { token, password } = req.body;
    const result = await resetUsecase({ token, password });
    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    logger.error({ err: error }, "Error in resetPasswordController");
    next(error);
  }
}

export { resetPasswordController, resetPasswordSchema };
