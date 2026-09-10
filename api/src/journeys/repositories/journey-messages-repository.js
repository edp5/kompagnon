import { knex } from "../../../db/knex-database-connection.js";

const TABLE_NAME = "journey_messages";

/**
 * Stores a message written by one of the two users of a found journey.
 * @param {object} params - The message to store.
 * @param {number} params.foundJourneyId - The found journey the message belongs to.
 * @param {number} params.senderId - The id of the user writing the message.
 * @param {string} params.body - The message itself.
 * @returns {Promise<object>} The stored message.
 */
async function createMessage({ foundJourneyId, senderId, body }) {
  const [message] = await knex(TABLE_NAME)
    .insert({ foundJourneyId, senderId, body })
    .returning(["id", "foundJourneyId", "senderId", "body", "created_at"]);
  return message;
}

/**
 * Lists the conversation of a found journey, oldest first, with the author's name.
 * @param {number} foundJourneyId - The id of the found journey.
 * @returns {Promise<object[]>} The messages of the conversation.
 */
async function findMessagesByFoundJourneyId(foundJourneyId) {
  return knex(TABLE_NAME)
    .join("users", `${TABLE_NAME}.senderId`, "users.id")
    .where(`${TABLE_NAME}.foundJourneyId`, foundJourneyId)
    .orderBy(`${TABLE_NAME}.created_at`, "asc")
    .select(
      `${TABLE_NAME}.id`,
      `${TABLE_NAME}.senderId`,
      `${TABLE_NAME}.body`,
      `${TABLE_NAME}.created_at`,
      "users.firstname",
      "users.lastname",
    );
}

export { createMessage, findMessagesByFoundJourneyId };
