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
 * Finds the matches of a passenger journey: the companion side of every
 * found journey referencing it, with the companion journey info and the
 * companion user's name.
 * @param {number} passengerJourneyId - The id of the passenger journey.
 * @returns {Promise<object[]>} The matches (found journey id, statuses, other user, other journey).
 */
async function findMatchesByPassengerJourneyId(passengerJourneyId) {
  return knex(TABLE_NAME)
    .join("companion_journeys", "found_journeys.companionJourneyId", "companion_journeys.id")
    .join("users", "companion_journeys.userId", "users.id")
    .where("found_journeys.passengerJourneyId", passengerJourneyId)
    .select(
      "found_journeys.id as foundJourneyId",
      "found_journeys.passengerStatus",
      "found_journeys.companionStatus",
      "users.firstname",
      "users.lastname",
      "users.phoneNumber",
      "companion_journeys.departureAddress",
      "companion_journeys.arrivalAddress",
      "companion_journeys.departureTime",
      "companion_journeys.arrivalTime",
      "companion_journeys.departureLat",
      "companion_journeys.departureLon",
      "companion_journeys.arrivalLat",
      "companion_journeys.arrivalLon",
    );
}

/**
 * Finds the matches of a companion journey: the passenger side of every
 * found journey referencing it, with the passenger journey info and the
 * passenger user's name.
 * @param {number} companionJourneyId - The id of the companion journey.
 * @returns {Promise<object[]>} The matches (found journey id, statuses, other user, other journey).
 */
async function findMatchesByCompanionJourneyId(companionJourneyId) {
  return knex(TABLE_NAME)
    .join("passenger_journeys", "found_journeys.passengerJourneyId", "passenger_journeys.id")
    .join("users", "passenger_journeys.userId", "users.id")
    .where("found_journeys.companionJourneyId", companionJourneyId)
    .select(
      "found_journeys.id as foundJourneyId",
      "found_journeys.passengerStatus",
      "found_journeys.companionStatus",
      "users.firstname",
      "users.lastname",
      "users.phoneNumber",
      "passenger_journeys.departureAddress",
      "passenger_journeys.arrivalAddress",
      "passenger_journeys.departureTime",
      "passenger_journeys.arrivalTime",
      "passenger_journeys.departureLat",
      "passenger_journeys.departureLon",
      "passenger_journeys.arrivalLat",
      "passenger_journeys.arrivalLon",
    );
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

/**
 * Finds all accepted found journeys linked to a journey ID.
 * @param {object} params - The lookup parameters.
 * @param {number} params.journeyId - The ID of the passenger or companion journey.
 * @param {string} params.journeyType - The type of journey ("passenger" or "companion").
 * @returns {Promise<object[]>} The list of accepted found journeys.
 */
async function findAcceptedFoundJourneysByJourneyId({ journeyId, journeyType }) {
  const column = journeyType === "passenger" ? "passengerJourneyId" : "companionJourneyId";
  return knex(TABLE_NAME)
    .where({ [column]: journeyId })
    .andWhere({ passengerStatus: "accepted", companionStatus: "accepted" });
}

/**
 * Updates both passenger and companion statuses on a found journey.
 * @param {object} params - The update parameters.
 * @param {number} params.foundJourneyId - The found journey ID.
 * @param {string} [params.passengerStatus] - The new passenger status.
 * @param {string} [params.companionStatus] - The new companion status.
 */
async function updateFoundJourneyStatuses({ foundJourneyId, passengerStatus, companionStatus }) {
  const knexCon = DomainTransaction.getConnection();
  const updateData = {};
  if (passengerStatus !== undefined) updateData.passengerStatus = passengerStatus;
  if (companionStatus !== undefined) updateData.companionStatus = companionStatus;
  if (Object.keys(updateData).length > 0) {
    await knexCon(TABLE_NAME).where({ id: foundJourneyId }).update(updateData);
  }
}

export {
  findAcceptedFoundJourneysByJourneyId,
  findFoundJourneyByFoundJourneyId,
  findMatchesByCompanionJourneyId,
  findMatchesByPassengerJourneyId,
  updateFoundJourneyCompanionStatusByFoundJourneyId,
  updateFoundJourneyPassengerStatusByFoundJourneyId,
  updateFoundJourneyStatuses,
};
