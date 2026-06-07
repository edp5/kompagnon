import { JOURNEY_STATUS } from "../../shared/constants.js";
import { JourneyIsNotOfThisUser, JourneyNotFound } from "../errors.js";
import {
  findFoundJourneyByFoundJourneyId,
  updateFoundJourneyPassengerStatusByFoundJourneyId,
} from "../repositories/found-journeys-repository.js";
import { findJourneyById } from "../repositories/passenger-users-repository.js";
import { checkFoundJourneyStatus } from "../utils/check-found-journey-status.js";
import { updateFoundJourneyStatusUsecase } from "./update-found-journey-status-usecase.js";

/**
 * Update the status of a passenger found journey
 * @param {object} param0 - Params data
 * @param {number} param0.userId - The id of user
 * @param {number} param0.foundJourneyId - The id of found journey
 * @returns {Promise<void>}
 */
async function acceptFoundJourneyPassengerStatusUsecase({
  userId,
  foundJourneyId,
}) {
  const foundJourney = await findFoundJourneyByFoundJourneyId(foundJourneyId);
  if (!foundJourney) {
    throw new JourneyNotFound();
  }
  const journey = await findJourneyById(foundJourney.passengerJourneyId);
  if (journey.userId === userId) {
    checkFoundJourneyStatus({ oupdatedStatus: foundJourney.passengerStatus, updatedStatus: JOURNEY_STATUS.ACCEPTED });
    await updateFoundJourneyStatusUsecase({ updateRepository: updateFoundJourneyPassengerStatusByFoundJourneyId, foundJourneyId, updatedStatus: JOURNEY_STATUS.ACCEPTED });
  } else {
    throw new JourneyIsNotOfThisUser();
  }
}

export { acceptFoundJourneyPassengerStatusUsecase };
