import { logger } from "../../../logger.js";
import { findUserById } from "../../identities-access-management/repositories/user-repository.js";
import { NOTIFICATION_TYPE } from "../../notifications/constants.js";
import { createNotificationUsecase } from "../../notifications/usecases/create-notification-usecase.js";
import { NOTIFY_LABEL } from "../constants.js";
import { findJourneyById as findCompanionJourneyById } from "../repositories/companion-users-repository.js";
import { findFoundJourneyByFoundJourneyId } from "../repositories/found-journeys-repository.js";
import { findJourneyById as findPassengerJourneyById } from "../repositories/passenger-users-repository.js";
import { sendMailOnMatchService } from "./send-mail-on-match-service.js";

const MATCH_FOUND_NOTIFICATION_TITLE = "Nouvelle correspondance de trajet";

/**
 * Notifies both users of every new match by email and with an in-app
 * notification, with a link to their own journey details (ref #666) so they
 * can accept or decline. Each match is best-effort: a failure is logged and
 * does not stop the other notifications.
 * @param {object} params - The parameters and repositories.
 * @param {number[]} params.foundJourneyIds - The ids of the newly created matches.
 * @param {Function} params.findFoundJourney - Finds a found journey by id (dependency injection).
 * @param {Function} params.findPassengerJourney - Finds a passenger journey by id (dependency injection).
 * @param {Function} params.findCompanionJourney - Finds a companion journey by id (dependency injection).
 * @param {Function} params.findUser - Finds a user by id (dependency injection).
 * @param {Function} params.sendMailOnMatch - Sends the match email (dependency injection).
 * @param {Function} params.createNotification - Creates the in-app notification (dependency injection).
 * @returns {Promise<void>}
 */
async function notifyJourneyMatchesService({
  foundJourneyIds,
  findFoundJourney = findFoundJourneyByFoundJourneyId,
  findPassengerJourney = findPassengerJourneyById,
  findCompanionJourney = findCompanionJourneyById,
  findUser = findUserById,
  sendMailOnMatch = sendMailOnMatchService,
  createNotification = createNotificationUsecase,
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

      await createNotification({
        userId: passengerUser.id,
        type: NOTIFICATION_TYPE.JOURNEY_MATCH_FOUND,
        title: MATCH_FOUND_NOTIFICATION_TITLE,
        message: `Une correspondance a été trouvée avec ${NOTIFY_LABEL.PASSENGER_LABEL} pour votre trajet.`,
      });
      await createNotification({
        userId: companionUser.id,
        type: NOTIFICATION_TYPE.JOURNEY_MATCH_FOUND,
        title: MATCH_FOUND_NOTIFICATION_TITLE,
        message: `Une correspondance a été trouvée avec ${NOTIFY_LABEL.COMPANION_LABEL} pour votre trajet.`,
      });
    } catch (error) {
      logger.error({ err: error }, "Failed to send match notification email");
    }
  }
}

export { notifyJourneyMatchesService };
