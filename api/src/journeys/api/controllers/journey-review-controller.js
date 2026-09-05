import { celebrate, Joi, Segments } from "celebrate";

import usecases from "../../usecases/index.js";

const reviewJourneySchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    foundJourneyId: Joi.number().integer().positive().required(),
  }),
  [Segments.BODY]: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(1000).allow(null, ""),
  }),
});

const getMyJourneyReviewSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    foundJourneyId: Joi.number().integer().positive().required(),
  }),
});

/**
 * Controller recording what a user thought of a journey they travelled.
 * @param {object} req - The request, holding the user, the journey and the review.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware, used for error handling.
 * @param {Function} reviewJourney - Use case recording the review (dependency injection for tests).
 * @returns {Promise<*>} The response sent to the client.
 */
async function reviewJourneyController(req, res, next, reviewJourney = usecases.reviewJourneyUsecase) {
  const { auth, params, body } = req;
  try {
    const review = await reviewJourney({
      foundJourneyId: Number(params.foundJourneyId),
      userId: auth.userId,
      rating: body.rating,
      comment: body.comment || null,
    });
    return res.status(201).json({ data: { rating: review.rating, comment: review.comment } });
  } catch (error) {
    return next(error);
  }
}

/**
 * Controller returning the review the user already left on a journey.
 * @param {object} req - The request, holding the user and the journey.
 * @param {object} res - The response object.
 * @param {Function} next - The next middleware, used for error handling.
 * @param {Function} getMyJourneyReview - Use case reading the review (dependency injection for tests).
 * @returns {Promise<*>} The response sent to the client.
 */
async function getMyJourneyReviewController(req, res, next, getMyJourneyReview = usecases.getMyJourneyReviewUsecase) {
  const { auth, params } = req;
  try {
    const review = await getMyJourneyReview({
      foundJourneyId: Number(params.foundJourneyId),
      userId: auth.userId,
    });
    return res.status(200).json({ data: review });
  } catch (error) {
    return next(error);
  }
}

export { getMyJourneyReviewController, getMyJourneyReviewSchema, reviewJourneyController, reviewJourneySchema };
