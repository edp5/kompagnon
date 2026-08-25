import { findUserById } from "../../identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../shared/constants.js";
import { JOURNEY_TYPE } from "../constants.js";
import { JourneyIsNotOfThisUser, JourneyNotFound } from "../errors.js";
import { findJourneyById as findCompanionJourneyById } from "../repositories/companion-users-repository.js";
import { findTrackingPointsByJourneyId } from "../repositories/journey-tracking-repository.js";
import { findJourneyById as findPassengerJourneyById } from "../repositories/passenger-users-repository.js";

/**
 * Retrieves all GPS tracking points for a journey owned by the authenticated user.
 * @param {object} params - The use case parameters.
 * @param {number} params.userId - The ID of the authenticated user.
 * @param {number} params.journeyId - The ID of the journey.
 * @returns {Promise<object[]>} The list of tracking points ordered chronologically.
 */
async function getTrackingPointsUsecase({ userId, journeyId }) {
  const user = await findUserById(userId);

  let journey;
  let journeyType;

  if (user.role === USER_ROLE.INVALID) {
    journey = await findPassengerJourneyById(journeyId);
    journeyType = JOURNEY_TYPE.PASSENGER;
  } else {
    journey = await findCompanionJourneyById(journeyId);
    journeyType = JOURNEY_TYPE.COMPANION;
  }

  if (!journey) {
    throw new JourneyNotFound();
  }

  if (journey.userId !== userId) {
    throw new JourneyIsNotOfThisUser();
  }

  return findTrackingPointsByJourneyId(journeyId, journeyType);
}

export { getTrackingPointsUsecase };
