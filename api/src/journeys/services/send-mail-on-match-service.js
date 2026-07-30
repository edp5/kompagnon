import { config } from "../../../config.js";
import { createMailBodyService } from "../../shared/services/emails/create-mail-body-service.js";
import { sendMailService } from "../../shared/services/emails/send-mail-service.js";
import { MAIL_MATCH_SUBJECT } from "../constants.js";

const JOURNEY_PATH = "journeys/";

/**
 * Sends a "match found" email to a user, with a link to their journey details
 * where they can accept or decline the match.
 * @param {object} params - The email parameters.
 * @param {string} params.firstname - The recipient's first name.
 * @param {string} params.lastname - The recipient's last name.
 * @param {string} params.email - The recipient's email.
 * @param {number} params.journeyId - The id of the recipient's journey to link to.
 * @param {string} params.matchLabel - How the matched person is described (e.g. "un accompagnateur").
 * @param {Function} params.createMailBody - Mail body builder (dependency injection for tests).
 * @param {Function} params.sendMail - Mail sender (dependency injection for tests).
 * @returns {Promise<void>}
 */
async function sendMailOnMatchService({ firstname, lastname, email, journeyId, matchLabel, createMailBody = createMailBodyService, sendMail = sendMailService }) {
  const body = await createMailBody("match-found", {
    firstname,
    lastname,
    matchLabel,
    journeyLink: `${config.baseUrl}${JOURNEY_PATH}${journeyId}`,
  });
  await sendMail({
    to: email,
    subject: MAIL_MATCH_SUBJECT,
    html: body,
  });
}

export { sendMailOnMatchService };
