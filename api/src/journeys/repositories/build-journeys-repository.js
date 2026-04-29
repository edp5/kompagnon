import { knex } from "../../../db/knex-database-connection.js";

function buildJourneysRepository(tableName) {
  /**
   * Saves a journey.
   * @param {object} params - Journey details
   * @param {number} params.userId - ID of the user associated with the journey
   * @param {string} params.departureTime - Departure time of the journey
   * @param {string} params.arrivalTime - Arrival time of the journey
   * @param {string} params.departureAddress - Departure address of the journey
   * @param {string} params.arrivalAddress - Arrival address of the journey
   * @param {number} params.departureLon - Longitude of the departure location (optional)
   * @param {number} params.departureLat - Latitude of the departure location (optional)
   * @param {number} params.arrivalLon - Longitude of the arrival location (optional)
   * @param {number} params.arrivalLat - Latitude of the arrival location (optional)
   * @returns {Promise<*>} - The ID of the saved journey
   */
  async function saveJourney({ userId, departureTime, arrivalTime, departureAddress, arrivalAddress, departureLon = null, departureLat = null, arrivalLon = null, arrivalLat = null }) {
    const [{ id }] = await knex(tableName).insert({
      userId,
      departureTime,
      arrivalTime,
      departureAddress,
      arrivalAddress,
      departureLon,
      departureLat,
      arrivalLon,
      arrivalLat,
    }).returning("id");
    return id;
  }

  /**
   * Finds a journey by its ID.
   * @param {number} journeyId - ID of the journey to find
   * @returns {Promise<*>} - The journey record if found, otherwise null
   */
  async function findJourneyById(journeyId) {
    const journey = await knex(tableName).where({ id: journeyId }).first();
    return journey || null;
  }

  /**
   * Finds all journeys associated with a specific user ID.
   * @param {number} userId - ID of the user whose journeys to find
   * @returns {Promise<*>} - An array of journey records associated with the user ID
   */
  async function findJourneysByUserId(userId) {
    const journeys = await knex(tableName).where({ userId });
    return journeys;
  }

  /**
   * Removes a journey by its ID.
   * @param {number} journeyId - ID of the journey to remove
   * @returns {Promise<*>} - The number of records deleted (should be 1 if successful, 0 if no record found)
   */
  async function removeJourneyByJourneyId(journeyId) {
    return await knex(tableName).where({ id: journeyId }).del();
  }

  return { findJourneyById, findJourneysByUserId, removeJourneyByJourneyId, saveJourney };
}

export { buildJourneysRepository };
