import { knex } from "../../../db/knex-database-connection.js";

const TABLE_NAME = "journey_positions";

/**
 * Appends a position reported by one of the two users of a found journey.
 * @param {object} params - The position to store.
 * @param {number} params.foundJourneyId - The journey being followed.
 * @param {number} params.userId - The user reporting their position.
 * @param {number} params.lat - Latitude.
 * @param {number} params.lon - Longitude.
 * @returns {Promise<object>} The stored position.
 */
async function savePosition({ foundJourneyId, userId, lat, lon }) {
  const [position] = await knex(TABLE_NAME)
    .insert({ foundJourneyId, userId, lat, lon })
    .returning(["id", "foundJourneyId", "userId", "lat", "lon", "recorded_at"]);
  return position;
}

/**
 * Returns the most recent position of each user following a journey. Only the
 * latest one is exposed: the point of the feature is where someone is now, not
 * a trail of everywhere they have been.
 * @param {number} foundJourneyId - The journey being followed.
 * @returns {Promise<object[]>} One position per user, most recent first.
 */
async function findLatestPositionsByFoundJourneyId(foundJourneyId) {
  return knex(TABLE_NAME)
    .join("users", `${TABLE_NAME}.userId`, "users.id")
    .where(`${TABLE_NAME}.foundJourneyId`, foundJourneyId)
    .distinctOn(`${TABLE_NAME}.userId`)
    .orderBy([
      { column: `${TABLE_NAME}.userId` },
      { column: `${TABLE_NAME}.recorded_at`, order: "desc" },
    ])
    .select(
      `${TABLE_NAME}.userId`,
      `${TABLE_NAME}.lat`,
      `${TABLE_NAME}.lon`,
      `${TABLE_NAME}.recorded_at`,
      "users.firstname",
    );
}

export { findLatestPositionsByFoundJourneyId, savePosition };
