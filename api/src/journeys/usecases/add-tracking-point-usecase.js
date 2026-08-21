import { findUserById } from "../../identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../shared/constants.js";
import { JOURNEY_TRACKING_STATUS, JOURNEY_TYPE } from "../constants.js";
import { JourneyIsNotOfThisUser, JourneyNotFound } from "../errors.js";
import { findJourneyById as findCompanionJourneyById } from "../repositories/companion-users-repository.js";
import { saveTrackingPoint, updateJourneyTrackingStatus } from "../repositories/journey-tracking-repository.js";
import { findJourneyById as findPassengerJourneyById } from "../repositories/passenger-users-repository.js";

/**
 * Records a GPS tracking point for a journey in progress.
 * Validates that the journey belongs to the authenticated user and that tracking is active.
 * @param {object} params - The use case parameters.
 * @param {number} params.userId - The ID of the authenticated user.
 * @param {number} params.journeyId - The ID of the journey being tracked.
 * @param {number} params.lat - GPS latitude.
 * @param {number} params.lon - GPS longitude.
 * @returns {Promise<object>} The inserted tracking point.
 */
async function addTrackingPointUsecase({ userId, journeyId, lat, lon }) {
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

  if (journey.trackingStatus !== JOURNEY_TRACKING_STATUS.IN_PROGRESS) {
    // Auto-start tracking if not already in progress
    await updateJourneyTrackingStatus({ journeyId, journeyType, status: JOURNEY_TRACKING_STATUS.IN_PROGRESS });
  }

  return saveTrackingPoint({ journeyId, journeyType, lat, lon });
}

export { addTrackingPointUsecase };
