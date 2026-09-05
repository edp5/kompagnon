import { findLatestPositionsByFoundJourneyId } from "../repositories/journey-positions-repository.js";
import { findFoundJourneyOfUser } from "../utils/find-found-journey-of-user.js";

/**
 * Returns where each user of a journey currently is. Each position says whether
 * it is the caller's own, so the client can tell the two markers apart.
 * @param {object} params - The lookup parameters.
 * @param {number} params.foundJourneyId - The journey being followed.
 * @param {number} params.userId - The user asking.
 * @returns {Promise<object[]>} The latest position of each user.
 */
async function getJourneyPositionsUsecase({ foundJourneyId, userId }) {
  await findFoundJourneyOfUser({ foundJourneyId, userId });

  const positions = await findLatestPositionsByFoundJourneyId(foundJourneyId);

  return positions.map((position) => ({
    lat: position.lat,
    lon: position.lon,
    recordedAt: position.recorded_at,
    mine: position.userId === userId,
    firstname: position.firstname,
  }));
}

export { getJourneyPositionsUsecase };
