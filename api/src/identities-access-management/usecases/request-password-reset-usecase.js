import crypto from "node:crypto";

import { createPasswordResetToken } from "../repositories/password-reset-token-repository.js";
import { findUserByEmail } from "../repositories/user-repository.js";
import { sendMailToResetPasswordService } from "../services/send-mail-to-reset-password-service.js";

const TOKEN_EXPIRATION_MS = 60 * 60 * 1000; // 1 hour

/**
 * Handles requesting a password reset.
 * Always resolves without throwing user existence errors to prevent account enumeration.
 * @param {object} params - Parameters
 * @param {string} params.email - User email address
 * @param {Function} [params.findUser] - Repository function to find user by email
 * @param {Function} [params.createToken] - Repository function to create reset token
 * @param {Function} [params.sendMail] - Service function to send reset email
 * @returns {Promise<{ message: string }>} Resolves with status message
 */
async function requestPasswordResetUsecase({
  email,
  findUser = findUserByEmail,
  createToken = createPasswordResetToken,
  sendMail = sendMailToResetPasswordService,
}) {
  const normalizedEmail = email.trim().toLowerCase();
  const user = await findUser(normalizedEmail);

  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION_MS);

    await createToken({
      userId: user.id,
      token,
      expiresAt,
    });

    await sendMail({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      token,
    });
  }

  return {
    message: "If your email address is registered, you will receive a password reset link.",
  };
}

export { requestPasswordResetUsecase };
