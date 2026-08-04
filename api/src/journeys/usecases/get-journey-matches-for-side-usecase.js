import { JOURNEY_STATUS } from "../../shared/constants.js";
import { getJourneyUsecase } from "./get-journey-usecase.js";

/**
 * Retrieve the matches of a journey owned by the user, for one side (passenger
 * or companion). Returns null when the journey does not exist or is not owned by
 * the user. Matches where either side has declined are filtered out (the card
 * must not be shown once declined).
 * @param {object} params - The lookup parameters and repositories.
 * @param {Function} params.findJourneyById - Finds the owned journey (ownership check).
 * @param {Function} params.findMatches - Finds the raw matches for the journey id.
 * @param {string} params.myStatusKey - Key of the requesting user's status (passengerStatus/companionStatus).
 * @param {string} params.otherStatusKey - Key of the other user's status.
 * @param {number} params.journeyId - The id of the journey.
 * @param {number} params.userId - The id of the requesting user.
 * @returns {Promise<object[]|null>} The matches, or null when the journey is not the user's.
 */
async function getJourneyMatchesForSideUsecase({ findJourneyById, findMatches, myStatusKey, otherStatusKey, journeyId, userId }) {
  const journey = await getJourneyUsecase(findJourneyById, { journeyId, userId });
  if (!journey) {
    return null;
  }

  const matches = await findMatches(journeyId);

  return matches
    .filter((match) => match[myStatusKey] !== JOURNEY_STATUS.REJECTED && match[otherStatusKey] !== JOURNEY_STATUS.REJECTED)
    .map((match) => ({
      foundJourneyId: match.foundJourneyId,
      user: {
        firstname: match.firstname,
        lastname: match.lastname,
      },
      journey: {
        departureAddress: match.departureAddress,
        arrivalAddress: match.arrivalAddress,
        departureTime: match.departureTime,
        arrivalTime: match.arrivalTime,
      },
      myStatus: match[myStatusKey],
      otherStatus: match[otherStatusKey],
    }));
}

export { getJourneyMatchesForSideUsecase };
