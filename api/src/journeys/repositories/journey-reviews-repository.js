import { knex } from "../../../db/knex-database-connection.js";

const TABLE_NAME = "journey_reviews";

/**
 * Records a review, or replaces the one this author already left on this
 * journey. Someone is allowed to change their mind about a trip; they are not
 * allowed to weigh on it twice.
 * @param {object} params - The review to store.
 * @param {number} params.foundJourneyId - The journey being reviewed.
 * @param {number} params.authorId - The user writing it.
 * @param {number} params.subjectId - The user it is about.
 * @param {number} params.rating - One to five.
 * @param {string|null} params.comment - What they wanted to add, if anything.
 * @returns {Promise<object>} The stored review.
 */
async function saveReview({ foundJourneyId, authorId, subjectId, rating, comment }) {
  const [review] = await knex(TABLE_NAME)
    .insert({ foundJourneyId, authorId, subjectId, rating, comment })
    .onConflict(["foundJourneyId", "authorId"])
    .merge({ rating, comment, subjectId, updated_at: knex.fn.now() })
    .returning(["id", "foundJourneyId", "authorId", "subjectId", "rating", "comment", "created_at", "updated_at"]);
  return review;
}

/**
 * The review this author left on this journey, if any.
 * @param {object} params - The lookup parameters.
 * @param {number} params.foundJourneyId - The journey.
 * @param {number} params.authorId - The user who would have written it.
 * @returns {Promise<object|undefined>} The review, or undefined.
 */
async function findReviewByAuthor({ foundJourneyId, authorId }) {
  return knex(TABLE_NAME).where({ foundJourneyId, authorId }).first();
}

/**
 * How a user has been rated across every journey they travelled.
 * @param {number} userId - The user being rated.
 * @returns {Promise<{ average: number|null, count: number }>} Their standing.
 */
async function findReputationOfUser(userId) {
  const [row] = await knex(TABLE_NAME)
    .where({ subjectId: userId })
    .select(knex.raw("avg(rating)::float as average"), knex.raw("count(*)::int as count"));

  return {
    // Rounded to one decimal: a reputation is a signal, not a measurement, and
    // 4.3 says as much as 4.2857142857 while being readable out loud.
    average: row.average === null ? null : Math.round(row.average * 10) / 10,
    count: row.count,
  };
}

export { findReputationOfUser, findReviewByAuthor, saveReview };
