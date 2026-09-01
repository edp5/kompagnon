import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../../logger.js";
import usecases from "../../usecases/index.js";

const updateFoundJourneyStatusSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    foundJourneyId: Joi.number().required().positive().required(),
  }),
  [Segments.BODY]: Joi.object({
    updatedStatus: Joi.bool().required(),
  }),
});

/**
 * Controller to update the found journey status for the authenticated user.
 * It delegates user resolution, role checks, and status updates to the usecase layer.
 *
 * @param {object} req - Express request object containing auth, params, and body
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function for error handling
 * @param {Function} updateFoundJourneyStatus - Usecase to update found journey status (injected for tests)
 * @returns {Promise<*>} The Express response object (204 No Content on success)
 */
async function updateFoundJourneyStatusController(
  req,
  res,
  next,
  updateFoundJourneyStatus = usecases.updateFoundJourneyStatusUsecase,
) {
  const { auth, body, params } = req;
  try {
    await updateFoundJourneyStatus({
      userId: auth.userId,
      foundJourneyId: params.foundJourneyId,
      updatedStatus: body.updatedStatus,
    });
    return res.status(204).send();
  } catch (error) {
    logger.error({ err: error }, "Error updating found journey status");
    return next(error);
  }
}

export { updateFoundJourneyStatusController, updateFoundJourneyStatusSchema };
