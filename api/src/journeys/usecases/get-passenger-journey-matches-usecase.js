import { findMatchesByPassengerJourneyId } from "../repositories/found-journeys-repository.js";
import { findJourneyById } from "../repositories/passenger-users-repository.js";
import { getJourneyMatchesForSideUsecase } from "./get-journey-matches-for-side-usecase.js";

/**
 * Retrieve the matches of a passenger journey owned by the user.
 * @param {object} params - The lookup parameters.
 * @param {number} params.journeyId - The id of the passenger journey.
 * @param {number} params.userId - The id of the requesting user.
 * @returns {Promise<object[]|null>} The matches, or null when the journey is not the user's.
 */
async function getPassengerJourneyMatchesUsecase({ journeyId, userId }) {
  return getJourneyMatchesForSideUsecase({
    findJourneyById,
    findMatches: findMatchesByPassengerJourneyId,
    myStatusKey: "passengerStatus",
    otherStatusKey: "companionStatus",
    journeyId,
    userId,
  });
}

export { getPassengerJourneyMatchesUsecase };
