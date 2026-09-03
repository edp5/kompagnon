import { findUserById as defaultFindUserById } from "../../identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../shared/constants.js";
import { JOURNEY_TYPE } from "../constants.js";
import { JourneyIsNotOfThisUser, JourneyNotFound, UserHasNoRole } from "../errors.js";
import { findJourneyById as defaultFindCompanionJourneyById } from "../repositories/companion-users-repository.js";
import {
  findAcceptedFoundJourneysByJourneyId as defaultFindAcceptedFoundJourneys,
} from "../repositories/found-journeys-repository.js";
import { findTrackingPointsByJourneyId as defaultFindTrackingPoints } from "../repositories/journey-tracking-repository.js";
import { findJourneyById as defaultFindPassengerJourneyById } from "../repositories/passenger-users-repository.js";

/**
 * Retrieves all GPS tracking points for a journey.
 * Allows access to the journey owner or a confirmed partner.
 * @param {object} params - The use case parameters.
 * @param {number} params.userId - The ID of the authenticated user.
 * @param {number} params.journeyId - The ID of the journey.
 * @param {Function} [params.findUserById] - Dependency injection.
 * @param {Function} [params.findPassengerJourneyById] - Dependency injection.
 * @param {Function} [params.findCompanionJourneyById] - Dependency injection.
 * @param {Function} [params.findAcceptedFoundJourneys] - Dependency injection.
 * @param {Function} [params.findTrackingPoints] - Dependency injection.
 * @returns {Promise<object[]>} The list of tracking points ordered chronologically.
 */
async function getTrackingPointsUsecase({
  userId,
  journeyId,
  findUserById = defaultFindUserById,
  findPassengerJourneyById = defaultFindPassengerJourneyById,
  findCompanionJourneyById = defaultFindCompanionJourneyById,
  findAcceptedFoundJourneys = defaultFindAcceptedFoundJourneys,
  findTrackingPoints = defaultFindTrackingPoints,
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
    // Check if the user is a confirmed match partner on this journey
    const acceptedMatches = await findAcceptedFoundJourneys({ journeyId, journeyType });
    const isPartner = acceptedMatches.some((m) => m.userId === userId);
    if (!isPartner) {
      throw new JourneyIsNotOfThisUser();
    }
  }

  return findTrackingPoints(journeyId, journeyType);
}

export { getTrackingPointsUsecase };
