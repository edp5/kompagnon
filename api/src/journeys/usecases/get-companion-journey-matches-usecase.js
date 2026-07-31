import { findJourneyById } from "../repositories/companion-users-repository.js";
import { findMatchesByCompanionJourneyId } from "../repositories/found-journeys-repository.js";
import { getJourneyMatchesForSideUsecase } from "./get-journey-matches-for-side-usecase.js";

/**
 * Retrieve the matches of a companion journey owned by the user.
 * @param {object} params - The lookup parameters.
 * @param {number} params.journeyId - The id of the companion journey.
 * @param {number} params.userId - The id of the requesting user.
 * @returns {Promise<object[]|null>} The matches, or null when the journey is not the user's.
 */
async function getCompanionJourneyMatchesUsecase({ journeyId, userId }) {
  return getJourneyMatchesForSideUsecase({
    findJourneyById,
    findMatches: findMatchesByCompanionJourneyId,
    myStatusKey: "companionStatus",
    otherStatusKey: "passengerStatus",
    journeyId,
    userId,
  });
}

export { getCompanionJourneyMatchesUsecase };
