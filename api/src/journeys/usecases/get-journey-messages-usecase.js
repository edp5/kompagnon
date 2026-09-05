import { findMessagesByFoundJourneyId } from "../repositories/journey-messages-repository.js";
import { findFoundJourneyOfUser } from "../utils/find-found-journey-of-user.js";

/**
 * Reads the conversation of a found journey, oldest message first. Each message
 * says whether it was written by the user asking, so the client can lay the
 * conversation out without knowing the other user's id.
 * @param {object} params - The lookup parameters.
 * @param {number} params.foundJourneyId - The found journey to read.
 * @param {number} params.userId - The id of the user asking.
 * @returns {Promise<object[]>} The messages of the conversation.
 */
async function getJourneyMessagesUsecase({ foundJourneyId, userId }) {
  await findFoundJourneyOfUser({ foundJourneyId, userId });

  const messages = await findMessagesByFoundJourneyId(foundJourneyId);

  return messages.map((message) => ({
    id: message.id,
    body: message.body,
    sentAt: message.created_at,
    mine: message.senderId === userId,
    author: { firstname: message.firstname, lastname: message.lastname },
  }));
}

export { getJourneyMessagesUsecase };
