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
    .map((match) => {
      const confirmed = match[myStatusKey] === JOURNEY_STATUS.ACCEPTED && match[otherStatusKey] === JOURNEY_STATUS.ACCEPTED;

      return {
        foundJourneyId: match.foundJourneyId,
        user: {
          firstname: match.firstname,
          lastname: match.lastname,
          phoneNumber: confirmed ? match.phoneNumber : null,
        },
        journey: {
          departureAddress: match.departureAddress,
          arrivalAddress: match.arrivalAddress,
          departureTime: match.departureTime,
          arrivalTime: match.arrivalTime,
          departureLat: match.departureLat,
          departureLon: match.departureLon,
          arrivalLat: match.arrivalLat,
          arrivalLon: match.arrivalLon,
        },
        // Both users read the same code and say it out loud when they meet. It
        // only exists once both accepted, so it never leaks to someone who was
        // merely suggested as a match.
        meetingCode: confirmed ? match.meetingCode : null,
        myStatus: match[myStatusKey],
        otherStatus: match[otherStatusKey],
      };
    });
}

export { getJourneyMatchesForSideUsecase };
