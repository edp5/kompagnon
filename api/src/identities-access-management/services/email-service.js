import nodemailer from "nodemailer";

import { config } from "../../../config.js";
import { logger } from "../../../logger.js";

/**
 * Creates a nodemailer transporter based on configuration
 * @returns {Promise<nodemailer.Transporter>}
 */
async function createTransporter() {
  const { email } = config;

  if (!email.enabled) {
    logger.info("Email service is disabled");
    return null;
  }

  const transporter = nodemailer.createTransporter({
    service: email.service,
    port: email.port,
    secure: email.secure,
    auth: {
      user: email.auth.user,
      pass: email.auth.pass,
    },
  });

  // Verify connection configuration
  try {
    await transporter.verify();
    logger.info("Email transporter verified successfully");
  } catch (error) {
    logger.error("Email transporter verification failed", error);
    throw new Error("Email configuration is invalid");
  }

  return transporter;
}

/**
 * Sends an activation email to a user
 * @param {string} email - User's email address
 * @param {string} activationToken - Token for account activation
 * @returns {Promise<void>}
 */
async function sendActivationEmail(email, activationToken) {
  try {
    const transporter = await createTransporter();

    if (!transporter) {
      logger.info("Email service disabled, skipping activation email");
      return;
    }

    const activationUrl = `${config.baseUrl}activate?token=${activationToken}`;

    const mailOptions = {
      from: config.email.auth.user,
      to: email,
      subject: "Activate your Kompagnon account",
      html: `
        <h2>Welcome to Kompagnon!</h2>
        <p>Thank you for registering. Please click the link below to activate your account:</p>
        <a href="${activationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Activate Account</a>
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p>${activationUrl}</p>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    logger.info(`Activation email sent to ${email}`, { messageId: result.messageId });
  } catch (error) {
    logger.error(`Failed to send activation email to ${email}`, error);
    throw new Error("Failed to send activation email");
  }
}

export { sendActivationEmail };
