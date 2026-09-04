import {
  findReviewsByUserId,
  getAverageRatingAndCountByUserId,
} from "../repositories/reviews-repository.js";

/**
 * Retrieves reviews and statistics for a given user
 * @param {object} params - Parameters
 * @param {number} params.userId - Target user ID
 * @param {number} [params.limit=10] - Limit of reviews
 * @param {number} [params.offset=0] - Offset of reviews
 * @param {Function} [params.findReviews] - Function to query reviews
 * @param {Function} [params.getStats] - Function to query stats
 * @returns {Promise<{ averageRating: number, reviewCount: number, reviews: object[] }>} Resolves with averageRating, reviewCount, and list of reviews
 */
async function getUserReviewsUsecase({
  userId,
  limit = 10,
  offset = 0,
  findReviews = findReviewsByUserId,
  getStats = getAverageRatingAndCountByUserId,
}) {
  const [reviews, stats] = await Promise.all([
    findReviews(userId, { limit, offset }),
    getStats(userId),
  ]);

  return {
    averageRating: stats.averageRating,
    reviewCount: stats.reviewCount,
    reviews,
  };
}

export { getUserReviewsUsecase };
