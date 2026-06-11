import { findJourneysByUserId } from "../repositories/companion-users-repository.js";
import { getJourneysUsecase } from "./get-journeys-usecase.js";

/**
 * Retrieve all companion journeys belonging to a specific user.
 * @param {object} params - The lookup parameters.
 * @param {number} params.userId - The id of the companion user.
 * @returns {Promise<Array>} The list of companion journeys.
 */
async function getCompanionJourneysUsecase({ userId }) {
  return await getJourneysUsecase(findJourneysByUserId, { userId });
}

export { getCompanionJourneysUsecase };
