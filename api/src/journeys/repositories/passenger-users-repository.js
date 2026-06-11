import { knex } from "../../../db/knex-database-connection.js";
import { buildJourneysRepository } from "./build-journeys-repository.js";

const TABLE_NAME = "passenger_journeys";
const { findJourneyById, removeJourneyByJourneyId, saveJourney } = buildJourneysRepository(TABLE_NAME);

/**
 * Finds all passenger journeys belonging to a user, enriched with match status.
 * A journey is considered matched when a corresponding found_journeys row exists.
 * @param {number} userId - ID of the user.
 * @returns {Promise<Array>} Array of passenger journeys with an `isMatched` boolean.
 */
async function findJourneysByUserId(userId) {
  const rows = await knex(TABLE_NAME)
    .where({ [`${TABLE_NAME}.userId`]: userId })
    .select(
      `${TABLE_NAME}.*`,
      knex.raw(`
        EXISTS (
          SELECT 1 FROM found_journeys 
          WHERE found_journeys."passengerJourneyId" = ${TABLE_NAME}.id
        ) AS "isMatched"
      `),
    );
  return rows;
}

export { findJourneyById, findJourneysByUserId, removeJourneyByJourneyId, saveJourney };
