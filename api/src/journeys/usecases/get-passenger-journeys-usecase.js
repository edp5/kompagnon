import { findJourneysByUserId } from "../repositories/passenger-users-repository.js";
import { getJourneysUsecase } from "./get-journeys-usecase.js";

/**
 * Retrieve all passenger journeys belonging to a specific user.
 * @param {object} params - The lookup parameters.
 * @param {number} params.userId - The id of the passenger user.
 * @returns {Promise<Array>} The list of passenger journeys.
 */
async function getPassengerJourneysUsecase({ userId }) {
  return await getJourneysUsecase(findJourneysByUserId, { userId });
}

export { getPassengerJourneysUsecase };
