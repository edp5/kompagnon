import { findUserById as defaultFindUserById } from "../../identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../shared/constants.js";
import { JOURNEY_TRACKING_STATUS, JOURNEY_TYPE } from "../constants.js";
import { InvalidJourneyStatusTransitionError, JourneyIsNotOfThisUser, JourneyNotFound, UserHasNoRole } from "../errors.js";
import { findJourneyById as defaultFindCompanionJourneyById } from "../repositories/companion-users-repository.js";
import {
  saveTrackingPoint as defaultSaveTrackingPoint,
  updateJourneyTrackingStatus as defaultUpdateJourneyTrackingStatus,
} from "../repositories/journey-tracking-repository.js";
import { findJourneyById as defaultFindPassengerJourneyById } from "../repositories/passenger-users-repository.js";

/**
 * Records a GPS tracking point for a journey in progress.
 * Validates that the journey belongs to the authenticated user and guards against reopening finished journeys.
 * @param {object} params - The use case parameters.
 * @param {number} params.userId - The ID of the authenticated user.
 * @param {number} params.journeyId - The ID of the journey being tracked.
 * @param {number} params.lat - GPS latitude.
 * @param {number} params.lon - GPS longitude.
 * @param {Function} [params.findUserById] - Dependency injection for findUserById.
 * @param {Function} [params.findPassengerJourneyById] - Dependency injection.
 * @param {Function} [params.findCompanionJourneyById] - Dependency injection.
 * @param {Function} [params.updateJourneyTrackingStatus] - Dependency injection.
 * @param {Function} [params.saveTrackingPoint] - Dependency injection.
 * @returns {Promise<object>} The inserted tracking point.
 */
async function addTrackingPointUsecase({
  userId,
  journeyId,
  lat,
  lon,
  findUserById = defaultFindUserById,
  findPassengerJourneyById = defaultFindPassengerJourneyById,
  findCompanionJourneyById = defaultFindCompanionJourneyById,
  updateJourneyTrackingStatus = defaultUpdateJourneyTrackingStatus,
  saveTrackingPoint = defaultSaveTrackingPoint,
}) {
  const user = await findUserById(userId);

  if (!user || (user.role !== USER_ROLE.PASSENGER && user.role !== USER_ROLE.COMPANION)) {
    throw new UserHasNoRole();
  }

  let journey;
  let journeyType;

  if (user.role === USER_ROLE.PASSENGER) {
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

  if (
    journey.trackingStatus === JOURNEY_TRACKING_STATUS.COMPLETED ||
    journey.trackingStatus === JOURNEY_TRACKING_STATUS.CANCELLED
  ) {
    throw new InvalidJourneyStatusTransitionError(
      `Cannot add tracking points to a journey with status "${journey.trackingStatus}"`,
    );
  }

  if (journey.trackingStatus === JOURNEY_TRACKING_STATUS.NOT_STARTED) {
    await updateJourneyTrackingStatus({ journeyId, journeyType, status: JOURNEY_TRACKING_STATUS.IN_PROGRESS });
  }

  return saveTrackingPoint({ journeyId, journeyType, lat, lon, userId });
}

export { addTrackingPointUsecase };
