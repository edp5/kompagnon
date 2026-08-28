import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../../logger.js";
import usecases from "../../usecases/index.js";

const getNotificationsControllerSchema = celebrate({
  [Segments.QUERY]: Joi.object({}),
});

/**
 * Controller that returns the notifications belonging to the authenticated user, most recent first.
 * @param {object} req - The request object, holding the authenticated user.
 * @param {object} res - The response object used to reply to the client.
 * @param {Function} next - The next middleware in the Express pipeline (error handling).
 * @param {Function} getNotifications - Use case fetching the user's notifications (dependency injection for tests).
 * @returns {Promise<*>} A promise resolving to the response sent to the client.
 */
async function getNotificationsController(req, res, next, getNotifications = usecases.getNotificationsUsecase) {
  const { auth } = req;
  try {
    const notifications = await getNotifications({ userId: auth.userId });
    return res.status(200).json({ data: notifications });
  } catch (error) {
    logger.error({ err: error }, "Error during notifications listing");
    return next(error);
  }
}

export { getNotificationsController, getNotificationsControllerSchema };
