import { config } from "../../../config.js";
import { createMailBodyService } from "../../shared/services/emails/create-mail-body-service.js";
import { sendMailService } from "../../shared/services/emails/send-mail-service.js";

const ACTIVATE_PATH = "authentication/activate?token=";
const MAIL_SUBJECT = "Activer votre compte Kompagnon";

async function sendMailToActivateUserService({ firstname, lastname, email, token, createMailBody = createMailBodyService, sendMail = sendMailService }) {
  const body = await createMailBody("account-activation", {
    firstname,
    lastname,
    activationLink: _getUrlToActivateAccount(token),
  });
  await sendMail({
    to: email,
    subject: MAIL_SUBJECT,
    html: body,
  });
}

function _getUrlToActivateAccount(token) {
  return `${config.baseUrl}${ACTIVATE_PATH}${token}`;
}

export { sendMailToActivateUserService };
