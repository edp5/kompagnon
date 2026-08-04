import { findUserById } from "../../identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../shared/constants.js";
import { JourneyNotFound, UserHasNoRole } from "../errors.js";
import { getCompanionJourneyMatchesUsecase } from "./get-companion-journey-matches-usecase.js";
import { getPassengerJourneyMatchesUsecase } from "./get-passenger-journey-matches-usecase.js";

/**
 * Retrieve the matches of a journey owned by the authenticated user. The user is
 * resolved from the repository here (never in the controller): its role decides
 * whether the journey is looked up on the passenger or companion side. Throws
 * JourneyNotFound when the journey does not exist or is not the user's, and
 * UserHasNoRole when the user has no passenger/companion role.
 * @param {object} params - The lookup parameters.
 * @param {number} params.userId - The id of the authenticated user.
 * @param {number} params.journeyId - The id of the journey.
 * @returns {Promise<object[]>} The matches of the journey.
 */
async function getJourneyMatchesUsecase({ userId, journeyId }) {
  const user = await findUserById(userId);

  let matches;
  if (user.role === USER_ROLE.INVALID) {
    matches = await getPassengerJourneyMatchesUsecase({ journeyId, userId });
  } else if (user.role === USER_ROLE.VALID) {
    matches = await getCompanionJourneyMatchesUsecase({ journeyId, userId });
  } else {
    throw new UserHasNoRole();
  }

  if (matches === null) {
    throw new JourneyNotFound();
  }

  return matches;
}

export { getJourneyMatchesUsecase };
