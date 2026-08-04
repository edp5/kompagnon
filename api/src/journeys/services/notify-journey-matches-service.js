import { logger } from "../../../logger.js";
import { findUserById } from "../../identities-access-management/repositories/user-repository.js";
import { NOTIFY_LABEL } from "../constants.js";
import { findJourneyById as findCompanionJourneyById } from "../repositories/companion-users-repository.js";
import { findFoundJourneyByFoundJourneyId } from "../repositories/found-journeys-repository.js";
import { findJourneyById as findPassengerJourneyById } from "../repositories/passenger-users-repository.js";
import { sendMailOnMatchService } from "./send-mail-on-match-service.js";

/**
 * Notifies both users of every new match by email, with a link to their own
 * journey details (ref #666) so they can accept or decline. Each match is
 * best-effort: a failure is logged and does not stop the other notifications.
 * @param {object} params - The parameters and repositories.
 * @param {number[]} params.foundJourneyIds - The ids of the newly created matches.
 * @param {Function} params.findFoundJourney - Finds a found journey by id (dependency injection).
 * @param {Function} params.findPassengerJourney - Finds a passenger journey by id (dependency injection).
 * @param {Function} params.findCompanionJourney - Finds a companion journey by id (dependency injection).
 * @param {Function} params.findUser - Finds a user by id (dependency injection).
 * @param {Function} params.sendMailOnMatch - Sends the match email (dependency injection).
 * @returns {Promise<void>}
 */
async function notifyJourneyMatchesService({
  foundJourneyIds,
  findFoundJourney = findFoundJourneyByFoundJourneyId,
  findPassengerJourney = findPassengerJourneyById,
  findCompanionJourney = findCompanionJourneyById,
  findUser = findUserById,
  sendMailOnMatch = sendMailOnMatchService,
}) {
  for (const foundJourneyId of foundJourneyIds) {
    try {
      const foundJourney = await findFoundJourney(foundJourneyId);
      if (!foundJourney) {
        continue;
      }

      const passengerJourney = await findPassengerJourney(foundJourney.passengerJourneyId);
      const companionJourney = await findCompanionJourney(foundJourney.companionJourneyId);
      if (!passengerJourney || !companionJourney) {
        continue;
      }

      const passengerUser = await findUser(passengerJourney.userId);
      const companionUser = await findUser(companionJourney.userId);

      await sendMailOnMatch({
        firstname: passengerUser.firstname,
        lastname: passengerUser.lastname,
        email: passengerUser.email,
        journeyId: passengerJourney.id,
        matchLabel: NOTIFY_LABEL.PASSENGER_LABEL,
      });
      await sendMailOnMatch({
        firstname: companionUser.firstname,
        lastname: companionUser.lastname,
        email: companionUser.email,
        journeyId: companionJourney.id,
        matchLabel: NOTIFY_LABEL.COMPANION_LABEL,
      });
    } catch (error) {
      logger.error({ err: error }, "Failed to send match notification email");
    }
  }
}

export { notifyJourneyMatchesService };
