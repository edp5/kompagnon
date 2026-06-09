import { findJourneyById } from "../repositories/companion-users-repository.js";
import { getJourneyUsecase } from "./get-journey-usecase.js";

/**
 * Retrieve a companion journey owned by the given user.
 * @param {object} params - The lookup parameters.
 * @param {number} params.journeyId - The id of the companion journey to retrieve.
 * @param {number} params.userId - The id of the user requesting the journey.
 * @returns {Promise<object|null>} The journey when found and owned by the user, otherwise null.
 */
async function getCompanionJourneyUsecase({ journeyId, userId }) {
  return await getJourneyUsecase(findJourneyById, { journeyId, userId });
}

export { getCompanionJourneyUsecase };
