import { knex } from "../../../db/knex-database-connection.js";
import { DomainTransaction } from "../../shared/infrastructure/DomainTransaction.js";

const TABLE_NAME = "found_journeys";

/**
 * Finds a found journey by its ID.
 * @param {number} foundJourneyId - The ID of the found journey to retrieve.
 * @returns {Promise<object | null>} The found journey object if found, or null if not found.
 */
async function findFoundJourneyByFoundJourneyId(foundJourneyId) {
  const foundJourney = await knex(TABLE_NAME).where({ id: foundJourneyId }).first();
  return foundJourney || null;
}

/**
 * Updates the passenger status of a found journey by its ID.
 * @param {object} param0 - An object containing the found journey ID and the new passenger status.
 * @param {number} param0.foundJourneyId - The ID of the found journey to update.
 * @param {string} param0.status - The new passenger status to set for the found journey.
 */
async function updateFoundJourneyPassengerStatusByFoundJourneyId({ foundJourneyId, status }) {
  const knexCon = DomainTransaction.getConnection();
  await knexCon(TABLE_NAME).where({ id: foundJourneyId }).update({ passengerStatus: status });
}

/**
 * Updates the companion status of a found journey by its ID.
 * @param {object} param0 - The parameters for updating the companion status of a found journey.
 * @param {number} param0.foundJourneyId - The ID of the found journey to update.
 * @param {string} param0.status - The new companion status to set for the found journey.
 */
async function updateFoundJourneyCompanionStatusByFoundJourneyId({ foundJourneyId, status }) {
  const knexCon = DomainTransaction.getConnection();
  await knexCon(TABLE_NAME).where({ id: foundJourneyId }).update({ companionStatus: status });
}


export { findFoundJourneyByFoundJourneyId, updateFoundJourneyCompanionStatusByFoundJourneyId, updateFoundJourneyPassengerStatusByFoundJourneyId };
