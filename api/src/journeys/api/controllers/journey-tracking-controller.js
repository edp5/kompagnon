import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../../logger.js";
import { JOURNEY_TRACKING_STATUS } from "../../constants.js";
import usecases from "../../usecases/index.js";

// ─── Validation schemas ───────────────────────────────────────────────────────

const journeyIdParamSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    journeyId: Joi.number().integer().positive().required(),
  }),
});

const addTrackingPointSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    journeyId: Joi.number().integer().positive().required(),
  }),
  [Segments.BODY]: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lon: Joi.number().min(-180).max(180).required(),
  }),
});

const updateJourneyStatusSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    journeyId: Joi.number().integer().positive().required(),
  }),
  [Segments.BODY]: Joi.object({
    status: Joi.string()
      .valid(
        JOURNEY_TRACKING_STATUS.NOT_STARTED,
        JOURNEY_TRACKING_STATUS.IN_PROGRESS,
        JOURNEY_TRACKING_STATUS.COMPLETED,
      )
      .required(),
  }),
});

// ─── Controllers ─────────────────────────────────────────────────────────────

/**
 * Records a GPS tracking point for a journey.
 * @param {object} req - The request object, containing auth, params (journeyId), and body (lat, lon).
 * @param {object} res - The response object.
 * @param {Function} next - Express error handler.
 * @param {Function} addTrackingPoint - Use case (injectable for tests).
 * @returns {Promise<*>} A promise resolving to the Express response sent to the client.
 */
async function addTrackingPointController(
  req,
  res,
  next,
  addTrackingPoint = usecases.addTrackingPointUsecase,
) {
  const { auth, params, body } = req;
  try {
    const point = await addTrackingPoint({
      userId: auth.userId,
      journeyId: Number(params.journeyId),
      lat: body.lat,
      lon: body.lon,
    });
    return res.status(201).json({ data: point });
  } catch (error) {
    logger.error({ err: error }, "Error recording tracking point");
    return next(error);
  }
}

/**
 * Returns all GPS tracking points for a journey.
 * @param {object} req - The request object, containing auth and params (journeyId).
 * @param {object} res - The response object.
 * @param {Function} next - Express error handler.
 * @param {Function} getTrackingPoints - Use case (injectable for tests).
 * @returns {Promise<*>} A promise resolving to the Express response sent to the client.
 */
async function getTrackingPointsController(
  req,
  res,
  next,
  getTrackingPoints = usecases.getTrackingPointsUsecase,
) {
  const { auth, params } = req;
  try {
    const points = await getTrackingPoints({
      userId: auth.userId,
      journeyId: Number(params.journeyId),
    });
    return res.status(200).json({ data: points });
  } catch (error) {
    logger.error({ err: error }, "Error fetching tracking points");
    return next(error);
  }
}

/**
 * Updates the tracking status of a journey (not_started → in_progress → completed).
 * @param {object} req - The request object, containing auth, params (journeyId), and body (status).
 * @param {object} res - The response object.
 * @param {Function} next - Express error handler.
 * @param {Function} updateJourneyStatus - Use case (injectable for tests).
 * @returns {Promise<*>} A promise resolving to the Express response sent to the client.
 */
async function updateJourneyStatusController(
  req,
  res,
  next,
  updateJourneyStatus = usecases.updateJourneyStatusUsecase,
) {
  const { auth, params, body } = req;
  try {
    await updateJourneyStatus({
      userId: auth.userId,
      journeyId: Number(params.journeyId),
      status: body.status,
    });
    return res.status(204).send();
  } catch (error) {
    logger.error({ err: error }, "Error updating journey status");
    return next(error);
  }
}

export {
  addTrackingPointController,
  addTrackingPointSchema,
  getTrackingPointsController,
  journeyIdParamSchema,
  updateJourneyStatusController,
  updateJourneyStatusSchema,
};
