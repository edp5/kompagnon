import nodemailer from "nodemailer";

import { config } from "../../../../config.js";
import { logger } from ".././../../../logger.js";

const { email } = config;

/**
 * Send an email using nodemailer
 * @param req: { to: string, subject?: string, text?: string, html?: string }
 * @returns {Promise<*|{info: string, data: {from: string, to: *, subject}}>}
 */
async function sendMailService(req) {
  if (!req.to) {
    throw new Error("Recipient email address is required");
  }

  const mailOptions = {
    from: email.auth.user,
    to: req.to,
    subject: req.subject || "No Subject",
  };

  if (req.text && !req.html) {
    mailOptions.text = req.text;
  } else if (req.html) {
    mailOptions.html = req.html;
  } else {
    throw new Error("Email content is required");
  }

  if (!email.enabled) {
    logger.info(`Email disabled. Mail not sent. Mail info: ${JSON.stringify(mailOptions)}`);
    return {
      info: "Email sending disabled",
      data: mailOptions,
    };
  }
  let transporter, testAccount;

  if (email.testAccount) {
    testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } else {
    transporter = nodemailer.createTransport({
      service: email.service,
      port: email.port,
      secure: email.secure,
      auth: email.auth,
    });
  }

  try {
    const info = await transporter.sendMail(mailOptions);
    if (email.testAccount) {
      logger.info(`Email available on ${nodemailer.getTestMessageUrl(info)}`);
    }
    return info;
  } catch (error) {
    logger.error(`Error sending email: ${error}`);
    throw error;
  }
}

export { sendMailService };
