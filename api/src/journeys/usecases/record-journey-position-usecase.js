import { savePosition } from "../repositories/journey-positions-repository.js";
import { findFoundJourneyOfUser } from "../utils/find-found-journey-of-user.js";

/**
 * Records where one of the two users of a journey currently is, so the other
 * one (and anyone holding a share link) can follow along.
 * @param {object} params - The reported position.
 * @param {number} params.foundJourneyId - The journey being followed.
 * @param {number} params.userId - The user reporting their position.
 * @param {number} params.lat - Latitude.
 * @param {number} params.lon - Longitude.
 * @returns {Promise<object>} The stored position.
 */
async function recordJourneyPositionUsecase({ foundJourneyId, userId, lat, lon }) {
  await findFoundJourneyOfUser({ foundJourneyId, userId });
  return savePosition({ foundJourneyId, userId, lat, lon });
}

export { recordJourneyPositionUsecase };
