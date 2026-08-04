import { config } from "../../../config.js";
import { logger } from "../../../logger.js";
import { requestJourneyMatch } from "../infrastructure/matching-algorithm-api.js";

/**
 * Calls the matching algorithm for a journey that has just been saved. The call
 * is skipped when disabled (ALGORITHM_ENABLED=false) and is best-effort: a
 * failure is logged but never breaks the journey recording. When the algorithm
 * returns new matches, both users of each match are notified by email (ref #667).
 * @param {object} params - The match parameters.
 * @param {number} params.journeyId - The id of the journey to match.
 * @param {string} params.role - The role of the journey owner (passenger or companion).
 * @param {Function} params.matchRequester - The matching API client, injected for testing.
 * @returns {Promise<void>} - Resolves when the matching algorithm has been called and notifications sent, or when the call is skipped or fails.
 */
async function callMatchingAlgorithmService({ journeyId, role, matchRequester = requestJourneyMatch }) {
  if (!config.algorithm.enabled) {
    return;
  }
  try {
    await matchRequester({ journeyId, role });
  } catch (error) {
    logger.error({ err: error }, "Matching algorithm call failed");
    return null;
  }
}

export { callMatchingAlgorithmService };
