import { findUserById as defaultFindUserById } from "../../identities-access-management/repositories/user-repository.js";
import { JOURNEY_STATUS, USER_ROLE } from "../../shared/constants.js";
import { JOURNEY_TRACKING_STATUS, JOURNEY_TYPE } from "../constants.js";
import {
  InvalidJourneyStatusTransitionError,
  JourneyIsNotOfThisUser,
  JourneyNotFound,
  UserHasNoRole,
} from "../errors.js";
import { findJourneyById as defaultFindCompanionJourneyById } from "../repositories/companion-users-repository.js";
import {
  findAcceptedFoundJourneysByJourneyId as defaultFindAcceptedFoundJourneys,
  updateFoundJourneyStatuses as defaultUpdateFoundJourneyStatuses,
} from "../repositories/found-journeys-repository.js";
import { updateJourneyTrackingStatus as defaultUpdateJourneyTrackingStatus } from "../repositories/journey-tracking-repository.js";
import { findJourneyById as defaultFindPassengerJourneyById } from "../repositories/passenger-users-repository.js";

/**
 * Allowed status transitions to prevent invalid state changes.
 * @type {Record<string, string[]>}
 */
const ALLOWED_TRANSITIONS = {
  [JOURNEY_TRACKING_STATUS.NOT_STARTED]: [
    JOURNEY_TRACKING_STATUS.IN_PROGRESS,
    JOURNEY_TRACKING_STATUS.CANCELLED,
  ],
  [JOURNEY_TRACKING_STATUS.IN_PROGRESS]: [
    JOURNEY_TRACKING_STATUS.COMPLETED,
    JOURNEY_TRACKING_STATUS.CANCELLED,
  ],
  [JOURNEY_TRACKING_STATUS.COMPLETED]: [],
  [JOURNEY_TRACKING_STATUS.CANCELLED]: [],
};

/**
 * Updates the tracking status of a journey.
 * Validates ownership, role, and that the status transition is valid.
 * Also synchronizes confirmed matches when completing or cancelling.
 * @param {object} params - The use case parameters.
 * @param {number} params.userId - The ID of the authenticated user.
 * @param {number} params.journeyId - The ID of the journey.
 * @param {string} params.status - The new tracking status (not_started | in_progress | completed | cancelled).
 * @param {Function} [params.findUserById] - Dependency injection.
 * @param {Function} [params.findPassengerJourneyById] - Dependency injection.
 * @param {Function} [params.findCompanionJourneyById] - Dependency injection.
 * @param {Function} [params.updateJourneyTrackingStatus] - Dependency injection.
 * @param {Function} [params.findAcceptedFoundJourneys] - Dependency injection.
 * @param {Function} [params.updateFoundJourneyStatuses] - Dependency injection.
 * @returns {Promise<void>}
 */
async function updateJourneyStatusUsecase({
  userId,
  journeyId,
  status,
  findUserById = defaultFindUserById,
  findPassengerJourneyById = defaultFindPassengerJourneyById,
  findCompanionJourneyById = defaultFindCompanionJourneyById,
  updateJourneyTrackingStatus = defaultUpdateJourneyTrackingStatus,
  findAcceptedFoundJourneys = defaultFindAcceptedFoundJourneys,
  updateFoundJourneyStatuses = defaultUpdateFoundJourneyStatuses,
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

  const allowedNext = ALLOWED_TRANSITIONS[journey.trackingStatus] ?? [];
  if (!allowedNext.includes(status)) {
    throw new InvalidJourneyStatusTransitionError(
      `Invalid status transition from "${journey.trackingStatus}" to "${status}"`,
    );
  }

  await updateJourneyTrackingStatus({ journeyId, journeyType, status });

  // Sync found journeys when transitioning to completed or cancelled
  if (status === JOURNEY_TRACKING_STATUS.COMPLETED) {
    const acceptedMatches = await findAcceptedFoundJourneys({ journeyId, journeyType });
    for (const match of acceptedMatches) {
      await updateFoundJourneyStatuses({
        foundJourneyId: match.id,
        passengerStatus: JOURNEY_STATUS.COMPLETED,
        companionStatus: JOURNEY_STATUS.COMPLETED,
      });
    }
  } else if (status === JOURNEY_TRACKING_STATUS.CANCELLED) {
    const acceptedMatches = await findAcceptedFoundJourneys({ journeyId, journeyType });
    for (const match of acceptedMatches) {
      await updateFoundJourneyStatuses({
        foundJourneyId: match.id,
        passengerStatus: JOURNEY_STATUS.CANCELLED,
        companionStatus: JOURNEY_STATUS.CANCELLED,
      });
    }
  }
}

export { updateJourneyStatusUsecase };
