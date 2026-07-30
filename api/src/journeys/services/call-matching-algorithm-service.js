import { config } from "../../../config.js";
import { logger } from "../../../logger.js";
import { requestJourneyMatch } from "../infrastructure/matching-algorithm-api.js";
import { notifyJourneyMatchesService } from "./notify-journey-matches-service.js";

/**
 * Calls the matching algorithm for a journey that has just been saved. The call
 * is skipped when disabled (ALGORITHM_ENABLED=false) and is best-effort: a
 * failure is logged but never breaks the journey recording. When the algorithm
 * returns new matches, both users of each match are notified by email (ref #667).
 * @param {object} params - The match parameters.
 * @param {number} params.journeyId - The id of the journey to match.
 * @param {string} params.role - The role of the journey owner (passenger or companion).
 * @param {Function} matchRequester - The matching API client, injected for testing.
 * @param {Function} notifyMatches - Notifies both users of each match, injected for testing.
 * @returns {Promise<object|undefined>} The match response, or undefined when skipped or failed.
 */
async function callMatchingAlgorithmService({ journeyId, role }, matchRequester = requestJourneyMatch, notifyMatches = notifyJourneyMatchesService) {
  if (!config.algorithm.enabled) {
    return undefined;
  }

  try {
    const result = await matchRequester({ journeyId, role });
    if (result?.found_journey_ids?.length) {
      await notifyMatches({ foundJourneyIds: result.found_journey_ids });
    }
    return result;
  } catch (error) {
    logger.error({ err: error }, "Matching algorithm call failed");
    return undefined;
  }
}

export { callMatchingAlgorithmService };
