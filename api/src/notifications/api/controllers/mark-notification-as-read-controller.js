import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../../logger.js";
import usecases from "../../usecases/index.js";

const markNotificationAsReadControllerSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    notificationId: Joi.number().integer().positive().required(),
  }),
});

/**
 * Controller that marks a single notification as read for the authenticated user.
 * @param {object} req - The request object, holding the authenticated user and the notificationId param.
 * @param {object} res - The response object used to reply to the client.
 * @param {Function} next - The next middleware in the Express pipeline (error handling).
 * @param {Function} markNotificationAsRead - Use case marking the notification as read (dependency injection for tests).
 * @returns {Promise<*>} A promise resolving to the response sent to the client.
 */
async function markNotificationAsReadController(req, res, next, markNotificationAsRead = usecases.markNotificationAsReadUsecase) {
  const { auth, params } = req;
  try {
    await markNotificationAsRead({ userId: auth.userId, notificationId: Number(params.notificationId) });
    return res.status(204).send();
  } catch (error) {
    logger.error({ err: error }, "Error marking notification as read");
    return next(error);
  }
}

export { markNotificationAsReadController, markNotificationAsReadControllerSchema };
