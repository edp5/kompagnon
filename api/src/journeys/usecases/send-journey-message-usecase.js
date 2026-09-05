import { createMessage } from "../repositories/journey-messages-repository.js";
import { findFoundJourneyOfUser } from "../utils/find-found-journey-of-user.js";

/**
 * Adds a message to the conversation of a found journey. Only the two users of
 * that journey may write in it.
 * @param {object} params - The message to send.
 * @param {number} params.foundJourneyId - The found journey to write in.
 * @param {number} params.userId - The id of the author.
 * @param {string} params.body - The message itself.
 * @returns {Promise<object>} The stored message.
 */
async function sendJourneyMessageUsecase({ foundJourneyId, userId, body }) {
  await findFoundJourneyOfUser({ foundJourneyId, userId });
  return createMessage({ foundJourneyId, senderId: userId, body });
}

export { sendJourneyMessageUsecase };
