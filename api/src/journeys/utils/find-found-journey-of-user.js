import { JourneyIsNotOfThisUser, JourneyNotFound } from "../errors.js";
import { findJourneyById as findCompanionJourneyById } from "../repositories/companion-users-repository.js";
import { findFoundJourneyByFoundJourneyId } from "../repositories/found-journeys-repository.js";
import { findJourneyById as findPassengerJourneyById } from "../repositories/passenger-users-repository.js";

/**
 * Returns the found journey only when the user is one of its two participants.
 * Anything shared between the pair (their conversation, their positions) must go
 * through this check.
 * @param {object} params - The lookup parameters.
 * @param {number} params.foundJourneyId - The id of the found journey.
 * @param {number} params.userId - The id of the user asking.
 * @throws {JourneyNotFound} When the found journey does not exist.
 * @throws {JourneyIsNotOfThisUser} When the user is not part of it.
 * @returns {Promise<object>} The found journey.
 */
async function findFoundJourneyOfUser({ foundJourneyId, userId }) {
  const foundJourney = await findFoundJourneyByFoundJourneyId(foundJourneyId);
  if (!foundJourney) {
    throw new JourneyNotFound();
  }

  const [passengerJourney, companionJourney] = await Promise.all([
    findPassengerJourneyById(foundJourney.passengerJourneyId),
    findCompanionJourneyById(foundJourney.companionJourneyId),
  ]);

  const isParticipant =
    passengerJourney?.userId === userId || companionJourney?.userId === userId;
  if (!isParticipant) {
    throw new JourneyIsNotOfThisUser();
  }

  return foundJourney;
}

export { findFoundJourneyOfUser };
