import { knex } from "../../../db/knex-database-connection.js";

const TABLE_NAME = "reviews";

/**
 * Saves a new review in the database
 * @param {object} params - Review parameters
 * @param {number} params.foundJourneyId - The found journey ID
 * @param {number} params.authorId - The ID of the author
 * @param {number} params.targetUserId - The ID of the user being reviewed
 * @param {number} params.rating - The rating (1-5)
 * @param {string} [params.comment] - Optional comment
 * @returns {Promise<object>} The created review
 */
async function saveReview({ foundJourneyId, authorId, targetUserId, rating, comment = null }) {
  const [createdReview] = await knex(TABLE_NAME)
    .insert({
      foundJourneyId,
      authorId,
      targetUserId,
      rating,
      comment: comment ? comment.trim() : null,
      created_at: knex.fn.now(),
      updated_at: knex.fn.now(),
    })
    .returning("*");

  return createdReview;
}

/**
 * Finds reviews targeting a specific user with author details
 * @param {number} userId - The user ID being reviewed
 * @param {object} [options] - Pagination options
 * @param {number} [options.limit=10] - Number of reviews to return
 * @param {number} [options.offset=0] - Offset for pagination
 * @returns {Promise<object[]>} List of reviews with author details
 */
async function findReviewsByUserId(userId, { limit = 10, offset = 0 } = {}) {
  return knex(TABLE_NAME)
    .join("users", "reviews.authorId", "users.id")
    .where("reviews.targetUserId", userId)
    .select(
      "reviews.id",
      "reviews.foundJourneyId",
      "reviews.authorId",
      "reviews.targetUserId",
      "reviews.rating",
      "reviews.comment",
      "reviews.created_at",
      "users.firstname as authorFirstname",
      "users.lastname as authorLastname",
    )
    .orderBy("reviews.created_at", "desc")
    .limit(limit)
    .offset(offset);
}

/**
 * Calculates the average rating and review count for a user
 * @param {number} userId - The user ID
 * @returns {Promise<{ averageRating: number, reviewCount: number }>} Calculated stats with average and count
 */
async function getAverageRatingAndCountByUserId(userId) {
  const result = await knex(TABLE_NAME)
    .where({ targetUserId: userId })
    .count("id as count")
    .avg("rating as average")
    .first();

  const count = Number(result?.count || 0);
  const rawAvg = result?.average ? parseFloat(result.average) : 0;
  const averageRating = count > 0 ? Math.round(rawAvg * 10) / 10 : 0;

  return {
    averageRating,
    reviewCount: count,
  };
}

/**
 * Checks if a user has already reviewed a found journey
 * @param {object} params - Parameters
 * @param {number} params.foundJourneyId - The found journey ID
 * @param {number} params.authorId - The author user ID
 * @returns {Promise<boolean>} Resolves to true if reviewed, false otherwise
 */
async function hasUserReviewedFoundJourney({ foundJourneyId, authorId }) {
  const existing = await knex(TABLE_NAME)
    .where({ foundJourneyId, authorId })
    .first();

  return Boolean(existing);
}

/**
 * Finds a found journey with companion and passenger user information
 * @param {number} foundJourneyId - Found journey ID
 * @returns {Promise<object|null>} Found journey object with participants or null
 */
async function findFoundJourneyWithParticipants(foundJourneyId) {
  const foundJourney = await knex("found_journeys")
    .join("companion_journeys", "found_journeys.companionJourneyId", "companion_journeys.id")
    .join("passenger_journeys", "found_journeys.passengerJourneyId", "passenger_journeys.id")
    .where("found_journeys.id", foundJourneyId)
    .select(
      "found_journeys.id",
      "found_journeys.companionJourneyId",
      "found_journeys.passengerJourneyId",
      "found_journeys.companionStatus",
      "found_journeys.passengerStatus",
      "companion_journeys.userId as companionUserId",
      "passenger_journeys.userId as passengerUserId",
    )
    .first();

  return foundJourney || null;
}

export {
  findFoundJourneyWithParticipants,
  findReviewsByUserId,
  getAverageRatingAndCountByUserId,
  hasUserReviewedFoundJourney,
  saveReview,
};
