import { celebrate, Joi, Segments } from "celebrate";

import usecases from "../../usecases/index.js";

const journeyPositionParams = Joi.object({
  foundJourneyId: Joi.number().integer().positive().required(),
});

const recordJourneyPositionSchema = celebrate({
  [Segments.PARAMS]: journeyPositionParams,
  [Segments.BODY]: Joi.object({
    lat: Joi.number().min(-90).max(90).required(),
    lon: Joi.number().min(-180).max(180).required(),
  }),
});

const getJourneyPositionsSchema = celebrate({
  [Segments.PARAMS]: journeyPositionParams,
});

/**
 * Controller recording where the authenticated user currently is.
 * @param {object} req - The request, holding the user, the journey id and the position.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware, used for error handling.
 * @param {Function} recordPosition - Use case storing the position (dependency injection for tests).
 * @returns {Promise<*>} The response sent to the client.
 */
async function recordJourneyPositionController(
  req,
  res,
  next,
  recordPosition = usecases.recordJourneyPositionUsecase,
) {
  const { auth, body, params } = req;
  try {
    await recordPosition({
      foundJourneyId: Number(params.foundJourneyId),
      userId: auth.userId,
      lat: body.lat,
      lon: body.lon,
    });
    return res.status(201).send();
  } catch (error) {
    return next(error);
  }
}

/**
 * Controller returning where each user of the journey currently is.
 * @param {object} req - The request, holding the user and the journey id.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware, used for error handling.
 * @param {Function} getPositions - Use case reading the positions (dependency injection for tests).
 * @returns {Promise<*>} The response sent to the client.
 */
async function getJourneyPositionsController(
  req,
  res,
  next,
  getPositions = usecases.getJourneyPositionsUsecase,
) {
  const { auth, params } = req;
  try {
    const positions = await getPositions({
      foundJourneyId: Number(params.foundJourneyId),
      userId: auth.userId,
    });
    return res.status(200).json({ data: positions });
  } catch (error) {
    return next(error);
  }
}

export {
  getJourneyPositionsController,
  getJourneyPositionsSchema,
  recordJourneyPositionController,
  recordJourneyPositionSchema,
};
