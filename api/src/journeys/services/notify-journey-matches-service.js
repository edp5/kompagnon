import { logger } from "../../../logger.js";
import { findUserById } from "../../identities-access-management/repositories/user-repository.js";
import { NOTIFY_LABEL } from "../constants.js";
import { findJourneyById as findCompanionJourneyById } from "../repositories/companion-users-repository.js";
import { findFoundJourneyByFoundJourneyId } from "../repositories/found-journeys-repository.js";
import { findJourneyById as findPassengerJourneyById } from "../repositories/passenger-users-repository.js";
import { sendMailOnMatchService } from "./send-mail-on-match-service.js";

/**
 * Notifies both users of every new match by email, with a link to their own
 * journey details (ref #666) so they can accept or decline. Each match and email notification
 * is best-effort: a failure is logged and does not stop the other notifications.
 * @param {object} params - The parameters and repositories.
 * @param {number[]} params.foundJourneyIds - The ids of the newly created matches.
 * @param {Function} [params.findFoundJourney] - Finds a found journey by id (dependency injection).
 * @param {Function} [params.findPassengerJourney] - Finds a passenger journey by id (dependency injection).
 * @param {Function} [params.findCompanionJourney] - Finds a companion journey by id (dependency injection).
 * @param {Function} [params.findUser] - Finds a user by id (dependency injection).
 * @param {Function} [params.sendMailOnMatch] - Sends the match email (dependency injection).
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
        logger.warn({ foundJourneyId }, "Found journey not found when sending match notifications");
        continue;
      }

      const [passengerJourney, companionJourney] = await Promise.all([
        findPassengerJourney(foundJourney.passengerJourneyId),
        findCompanionJourney(foundJourney.companionJourneyId),
      ]);
      if (!passengerJourney || !companionJourney) {
        logger.warn(
          {
            foundJourneyId,
            passengerJourneyId: foundJourney.passengerJourneyId,
            companionJourneyId: foundJourney.companionJourneyId,
          },
          "Associated journey not found when sending match notifications",
        );
        continue;
      }

      const [passengerUser, companionUser] = await Promise.all([
        findUser(passengerJourney.userId),
        findUser(companionJourney.userId),
      ]);
      if (!passengerUser || !companionUser) {
        logger.warn(
          {
            foundJourneyId,
            passengerUserId: passengerJourney.userId,
            companionUserId: companionJourney.userId,
          },
          "Associated user not found when sending match notifications",
        );
        continue;
      }

      const emailResults = await Promise.allSettled([
        sendMailOnMatch({
          firstname: passengerUser.firstname,
          lastname: passengerUser.lastname,
          email: passengerUser.email,
          journeyId: passengerJourney.id,
          matchLabel: NOTIFY_LABEL.PASSENGER_LABEL,
        }),
        sendMailOnMatch({
          firstname: companionUser.firstname,
          lastname: companionUser.lastname,
          email: companionUser.email,
          journeyId: companionJourney.id,
          matchLabel: NOTIFY_LABEL.COMPANION_LABEL,
        }),
      ]);

      for (const result of emailResults) {
        if (result.status === "rejected") {
          logger.error({ err: result.reason }, "Failed to send match notification email");
        }
      }
    } catch (error) {
      logger.error({ err: error }, "Failed to process match notification");
    }
  }
}

export { notifyJourneyMatchesService };
