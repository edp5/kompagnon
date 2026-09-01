import { findUserById } from "../../identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../shared/constants.js";
import { UserHasNoRole } from "../errors.js";
import { acceptFoundJourneyCompanionStatusUsecase } from "./accept-found-journey-companion-status-usecase.js";
import { acceptFoundJourneyPassengerStatusUsecase } from "./accept-found-journey-passenger-status-usecase.js";
import { rejectFoundJourneyCompanionStatusUsecase } from "./reject-found-journey-companion-status-usecase.js";
import { rejectFoundJourneyPassengerStatusUsecase } from "./reject-found-journey-passenger-status-usecase.js";

/**
 * Orchestrating usecase that updates the status of a found journey for an authenticated user.
 * It resolves the user's role and delegates to the appropriate passenger or companion usecase.
 *
 * @param {object} params - The update parameters
 * @param {number} params.userId - The ID of the authenticated user
 * @param {number} params.foundJourneyId - The ID of the found journey
 * @param {boolean} params.updatedStatus - true to accept, false to reject
 * @returns {Promise<void>}
 */
async function updateFoundJourneyStatusUsecase({
  userId,
  foundJourneyId,
  updatedStatus,
}) {
  const user = await findUserById(userId);
  if (!user || !user.role) {
    throw new UserHasNoRole();
  }

  switch (user.role) {
  case USER_ROLE.INVALID:
    if (updatedStatus) {
      await acceptFoundJourneyPassengerStatusUsecase({ userId, foundJourneyId });
    } else {
      await rejectFoundJourneyPassengerStatusUsecase({ userId, foundJourneyId });
    }
    break;
  case USER_ROLE.VALID:
    if (updatedStatus) {
      await acceptFoundJourneyCompanionStatusUsecase({ userId, foundJourneyId });
    } else {
      await rejectFoundJourneyCompanionStatusUsecase({ userId, foundJourneyId });
    }
    break;
  default:
    throw new UserHasNoRole();
  }
}

export { updateFoundJourneyStatusUsecase };
