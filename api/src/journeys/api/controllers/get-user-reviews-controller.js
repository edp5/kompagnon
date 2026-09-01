import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../../logger.js";
import usecases from "../../usecases/index.js";

const getUserReviewsSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    userId: Joi.number().integer().positive().required(),
  }),
  [Segments.QUERY]: Joi.object({
    limit: Joi.number().integer().min(1).max(100).default(10).optional(),
    offset: Joi.number().integer().min(0).default(0).optional(),
  }),
});

/**
 * Controller to fetch reviews and rating statistics of a user
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {Function} getUserReviews - Usecase to get user reviews
 * @returns {Promise<*>} Returns a promise that resolves to the response
 */
async function getUserReviewsController(
  req,
  res,
  next,
  getUserReviews = usecases.getUserReviewsUsecase,
) {
  try {
    const userId = Number(req.params.userId);
    const limit = Number(req.query.limit) || 10;
    const offset = Number(req.query.offset) || 0;

    const result = await getUserReviews({
      userId,
      limit,
      offset,
    });

    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    logger.error({ err: error }, "Error in getUserReviewsController");
    next(error);
  }
}

export { getUserReviewsController, getUserReviewsSchema };
