import { knex } from "../../../db/knex-database-connection.js";

const TABLE_NAME = "journey_shares";

/**
 * Stores a share link for a journey.
 * @param {object} params - The share to store.
 * @param {number} params.foundJourneyId - The journey being shared.
 * @param {number} params.createdBy - The user sharing it.
 * @param {string} params.token - The secret identifying the link.
 * @param {Date} params.expiresAt - When the link stops working.
 * @returns {Promise<object>} The stored share.
 */
async function createShare({ foundJourneyId, createdBy, token, expiresAt }) {
  const [share] = await knex(TABLE_NAME)
    .insert({ foundJourneyId, createdBy, token, expiresAt })
    .returning(["id", "foundJourneyId", "token", "expiresAt"]);
  return share;
}

/**
 * Finds a share by its token, whether or not it is still valid; the caller
 * decides what to do with an expired or revoked one.
 * @param {string} token - The secret from the link.
 * @returns {Promise<object|null>} The share, or null when the token is unknown.
 */
async function findShareByToken(token) {
  const share = await knex(TABLE_NAME).where({ token }).first();
  return share ?? null;
}

export { createShare, findShareByToken };
