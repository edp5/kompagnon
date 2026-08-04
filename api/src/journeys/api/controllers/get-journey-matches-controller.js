import { celebrate, Joi, Segments } from "celebrate";

import usecases from "../../usecases/index.js";

const getJourneyMatchesControllerSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    journeyId: Joi.number().integer().positive().required(),
  }),
});

/**
 * Controller that returns the matches of a journey owned by the authenticated
 * user. The use case resolves the user, its role and the journey ownership; the
 * controller only forwards the request and any domain error (JourneyNotFound,
 * UserHasNoRole) to the error handler.
 * @param {object} req - The request object, holding the authenticated user and the journeyId param.
 * @param {object} res - The response object used to reply to the client.
 * @param {Function} next - The next middleware in the Express pipeline (error handling).
 * @param {Function} getJourneyMatches - Use case fetching the journey matches (dependency injection for tests).
 * @returns {Promise<*>} A promise resolving to the response sent to the client.
 */
async function getJourneyMatchesController(req, res, next, getJourneyMatches = usecases.getJourneyMatchesUsecase) {
  const { auth, params } = req;
  try {
    const matches = await getJourneyMatches({ userId: auth.userId, journeyId: Number(params.journeyId) });
    return res.status(200).json({ data: matches });
  } catch (error) {
    return next(error);
  }
}

export { getJourneyMatchesController, getJourneyMatchesControllerSchema };
