import { config } from "../../../config.js";
import { MatchingAlgorithmNotConfigured, MatchingAlgorithmRequestFailed } from "../errors.js";

const MATCH_PATH = "/api/match";

/**
 * Roles expected by the kompagnon-algo match route.
 * @readonly
 * @enum {string}
 */
const MATCHING_ROLE = {
  PASSENGER: "passenger",
  COMPANION: "companion",
};

/**
 * Calls the kompagnon-algo match route for a journey that has just been saved.
 * The response is intentionally returned as-is and not exploited yet.
 * @param {object} params - The match parameters.
 * @param {number} params.journeyId - The id of the journey to match.
 * @param {string} params.role - The role of the journey owner (see MATCHING_ROLE).
 * @returns {Promise<object>} The match response from the algorithm API.
 */
async function requestJourneyMatch({ journeyId, role }) {
  if (!config.algorithm.apiUrl) {
    throw new MatchingAlgorithmNotConfigured();
  }

  const matchUrl = new URL(MATCH_PATH, config.algorithm.apiUrl).href;
  const response = await fetch(matchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ journey_id: journeyId, role }),
  });

  if (!response.ok) {
    throw new MatchingAlgorithmRequestFailed(response.status);
  }

  return response.json();
}

export { MATCHING_ROLE, requestJourneyMatch };
