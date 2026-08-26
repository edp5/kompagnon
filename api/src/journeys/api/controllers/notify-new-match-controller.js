import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../../logger.js";
import { notifyJourneyMatchesService } from "../../services/notify-journey-matches-service.js";

const notifyNewMatchControllerSchema = celebrate({
  [Segments.BODY]: Joi.object({
    data: Joi.array().items(Joi.number().required()).required(),
  }),
});

/**
 * Controller to notify new matches for journeys.
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {Function} notifyService - Service function to notify journey matches (default: notifyJourneyMatchesService)
 * @returns {Promise<*>} - Express response
 */
async function notifyNewMatchController(req, res, next, notifyService = notifyJourneyMatchesService) {
  try {
    const { data } = req.body;
    await notifyService({ foundJourneyIds: data });
    return res.status(200).send();
  } catch (error) {
    logger.warn({ err: error }, "Error notifying new match");
    next(error);
  }
}

export { notifyNewMatchController, notifyNewMatchControllerSchema };
