import { config } from "../../../config.js";
import { createMailBodyService } from "../../shared/services/emails/create-mail-body-service.js";
import { sendMailService } from "../../shared/services/emails/send-mail-service.js";

const RESET_PASSWORD_PATH = "authentication/reset-password?token=";
const MAIL_SUBJECT = "Réinitialisation de votre mot de passe Kompagnon";

async function sendMailToResetPasswordService({
  firstname,
  lastname,
  email,
  token,
  createMailBody = createMailBodyService,
  sendMail = sendMailService,
}) {
  const body = await createMailBody("reset-password", {
    firstname,
    lastname,
    resetLink: _getUrlToResetPassword(token),
  });
  await sendMail({
    to: email,
    subject: MAIL_SUBJECT,
    html: body,
  });
}

function _getUrlToResetPassword(token) {
  return `${config.baseUrl}${RESET_PASSWORD_PATH}${token}`;
}

export { sendMailToResetPasswordService };
