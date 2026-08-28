import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../../logger.js";
import usecases from "../../usecases/index.js";

const markAllNotificationsAsReadControllerSchema = celebrate({
  [Segments.QUERY]: Joi.object({}),
});

/**
 * Controller that marks every notification of the authenticated user as read.
 * @param {object} req - The request object, holding the authenticated user.
 * @param {object} res - The response object used to reply to the client.
 * @param {Function} next - The next middleware in the Express pipeline (error handling).
 * @param {Function} markAllNotificationsAsRead - Use case marking all notifications as read (dependency injection for tests).
 * @returns {Promise<*>} A promise resolving to the response sent to the client.
 */
async function markAllNotificationsAsReadController(req, res, next, markAllNotificationsAsRead = usecases.markAllNotificationsAsReadUsecase) {
  const { auth } = req;
  try {
    await markAllNotificationsAsRead({ userId: auth.userId });
    return res.status(204).send();
  } catch (error) {
    logger.error({ err: error }, "Error marking all notifications as read");
    return next(error);
  }
}

export { markAllNotificationsAsReadController, markAllNotificationsAsReadControllerSchema };
