import { celebrate, Joi, Segments } from "celebrate";

import usecases from "../../usecases/index.js";

const createJourneyShareSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    foundJourneyId: Joi.number().integer().positive().required(),
  }),
});

const getSharedJourneySchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    token: Joi.string().hex().length(48).required(),
  }),
});

/**
 * Controller creating a link that lets someone follow a journey.
 * @param {object} req - The request, holding the user and the journey id.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware, used for error handling.
 * @param {Function} createShare - Use case creating the share (dependency injection for tests).
 * @returns {Promise<*>} The response sent to the client.
 */
async function createJourneyShareController(
  req,
  res,
  next,
  createShare = usecases.createJourneyShareUsecase,
) {
  const { auth, params } = req;
  try {
    const share = await createShare({
      foundJourneyId: Number(params.foundJourneyId),
      userId: auth.userId,
    });
    return res.status(201).json({ data: share });
  } catch (error) {
    return next(error);
  }
}

/**
 * Controller reading a journey from a share link. This route is public on
 * purpose: whoever receives the link has no account.
 * @param {object} req - The request, holding the share token.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware, used for error handling.
 * @param {Function} getSharedJourney - Use case reading the shared journey (dependency injection for tests).
 * @returns {Promise<*>} The response sent to the client.
 */
async function getSharedJourneyController(
  req,
  res,
  next,
  getSharedJourney = usecases.getSharedJourneyUsecase,
) {
  const { params } = req;
  try {
    const shared = await getSharedJourney({ token: params.token });
    return res.status(200).json({ data: shared });
  } catch (error) {
    return next(error);
  }
}

export {
  createJourneyShareController,
  createJourneyShareSchema,
  getSharedJourneyController,
  getSharedJourneySchema,
};
