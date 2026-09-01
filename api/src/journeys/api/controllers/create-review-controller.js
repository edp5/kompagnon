import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../../logger.js";
import usecases from "../../usecases/index.js";

const createReviewSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    foundJourneyId: Joi.number().integer().positive().required(),
  }),
  [Segments.BODY]: Joi.object({
    rating: Joi.number().integer().min(1).max(5).required(),
    comment: Joi.string().max(1000).allow("", null).optional(),
  }),
});

/**
 * Controller to create a review for a completed found journey
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {Function} createReview - Usecase to create a review
 * @returns {Promise<*>} Returns a promise that resolves to the response
 */
async function createReviewController(
  req,
  res,
  next,
  createReview = usecases.createReviewUsecase,
) {
  try {
    const foundJourneyId = Number(req.params.foundJourneyId);
    const authorId = Number(req.auth.userId);
    const { rating, comment } = req.body;

    const review = await createReview({
      foundJourneyId,
      authorId,
      rating,
      comment,
    });

    return res.status(201).json({
      data: review,
    });
  } catch (error) {
    logger.error({ err: error }, "Error in createReviewController");
    next(error);
  }
}

export { createReviewController, createReviewSchema };
