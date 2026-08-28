import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../../logger.js";
import usecases from "../../usecases/index.js";

const deleteNotificationControllerSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    notificationId: Joi.number().integer().positive().required(),
  }),
});

/**
 * Controller that deletes a single notification belonging to the authenticated user.
 * @param {object} req - The request object, holding the authenticated user and the notificationId param.
 * @param {object} res - The response object used to reply to the client.
 * @param {Function} next - The next middleware in the Express pipeline (error handling).
 * @param {Function} deleteNotification - Use case deleting the notification (dependency injection for tests).
 * @returns {Promise<*>} A promise resolving to the response sent to the client.
 */
async function deleteNotificationController(req, res, next, deleteNotification = usecases.deleteNotificationUsecase) {
  const { auth, params } = req;
  try {
    await deleteNotification({ userId: auth.userId, notificationId: Number(params.notificationId) });
    return res.status(204).send();
  } catch (error) {
    logger.error({ err: error }, "Error deleting notification");
    return next(error);
  }
}

export { deleteNotificationController, deleteNotificationControllerSchema };
