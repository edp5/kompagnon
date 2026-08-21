import { findUserById } from "../../identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../shared/constants.js";
import { JOURNEY_TRACKING_STATUS, JOURNEY_TYPE } from "../constants.js";
import { JourneyIsNotOfThisUser, JourneyNotFound } from "../errors.js";
import { findJourneyById as findCompanionJourneyById } from "../repositories/companion-users-repository.js";
import { updateJourneyTrackingStatus } from "../repositories/journey-tracking-repository.js";
import { findJourneyById as findPassengerJourneyById } from "../repositories/passenger-users-repository.js";

/**
 * Allowed status transitions to prevent invalid state changes.
 * @type {Record<string, string[]>}
 */
const ALLOWED_TRANSITIONS = {
  [JOURNEY_TRACKING_STATUS.NOT_STARTED]: [JOURNEY_TRACKING_STATUS.IN_PROGRESS],
  [JOURNEY_TRACKING_STATUS.IN_PROGRESS]: [JOURNEY_TRACKING_STATUS.COMPLETED],
  [JOURNEY_TRACKING_STATUS.COMPLETED]: [],
};

/**
 * Updates the tracking status of a journey.
 * Validates ownership, role, and that the status transition is valid.
 * @param {object} params - The use case parameters.
 * @param {number} params.userId - The ID of the authenticated user.
 * @param {number} params.journeyId - The ID of the journey.
 * @param {string} params.status - The new tracking status (not_started | in_progress | completed).
 * @returns {Promise<void>}
 */
async function updateJourneyStatusUsecase({ userId, journeyId, status }) {
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

  const allowedNext = ALLOWED_TRANSITIONS[journey.trackingStatus] ?? [];
  if (!allowedNext.includes(status)) {
    const err = new Error(`Invalid status transition from "${journey.trackingStatus}" to "${status}"`);
    err.statusCode = 400;
    throw err;
  }

  await updateJourneyTrackingStatus({ journeyId, journeyType, status });
}

export { updateJourneyStatusUsecase };
