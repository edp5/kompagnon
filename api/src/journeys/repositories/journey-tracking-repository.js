import { knex } from "../../../db/knex-database-connection.js";
import { JOURNEY_TRACKING_STATUS } from "../constants.js";

const TABLE_NAME = "journey_tracking";

/**
 * Inserts a GPS tracking point for a journey.
 * @param {object} params - The tracking point details.
 * @param {number} params.journeyId - The ID of the journey being tracked.
 * @param {string} params.journeyType - The type of journey ("passenger" or "companion").
 * @param {number} params.lat - GPS latitude.
 * @param {number} params.lon - GPS longitude.
 * @returns {Promise<object>} The inserted tracking point.
 */
async function saveTrackingPoint({ journeyId, journeyType, lat, lon }) {
  const [values] = await knex(TABLE_NAME)
    .insert({ journeyId, journeyType, lat, lon, recorded_at: new Date() })
    .returning("*");
  return values;
}

/**
 * Retrieves all GPS tracking points for a given journey, ordered chronologically.
 * @param {number} journeyId - The ID of the journey.
 * @param {string} journeyType - The type of journey ("passenger" or "companion").
 * @returns {Promise<object[]>} The list of tracking points.
 */
async function findTrackingPointsByJourneyId(journeyId, journeyType) {
  return knex(TABLE_NAME)
    .where({ journeyId, journeyType })
    .orderBy("recorded_at", "asc");
}

/**
 * Updates the trackingStatus of a journey (passenger or companion).
 * @param {object} params - The update parameters.
 * @param {number} params.journeyId - The ID of the journey to update.
 * @param {string} params.journeyType - The type of journey ("passenger" or "companion").
 * @param {string} params.status - The new tracking status (not_started | in_progress | completed).
 * @returns {Promise<void>}
 */
async function updateJourneyTrackingStatus({ journeyId, journeyType, status }) {
  const tableName = journeyType === "companion" ? "companion_journeys" : "passenger_journeys";
  await knex(tableName).where({ id: journeyId }).update({ trackingStatus: status });
}

/**
 * Finds the last recorded tracking point for a journey.
 * @param {number} journeyId - The ID of the journey.
 * @param {string} journeyType - The type of journey ("passenger" or "companion").
 * @returns {Promise<object|null>} The last tracking point, or null if none.
 */
async function findLastTrackingPoint(journeyId, journeyType) {
  const point = await knex(TABLE_NAME)
    .where({ journeyId, journeyType })
    .orderBy("recorded_at", "desc")
    .first();
  return point || null;
}

export {
  findLastTrackingPoint,
  findTrackingPointsByJourneyId,
  saveTrackingPoint,
  updateJourneyTrackingStatus,
  JOURNEY_TRACKING_STATUS,
};
