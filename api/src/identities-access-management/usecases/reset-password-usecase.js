import { InvalidOrExpiredPasswordResetTokenError } from "../errors.js";
import {
  findValidPasswordResetToken,
  markPasswordResetTokenAsUsed,
} from "../repositories/password-reset-token-repository.js";
import { updateUserData } from "../repositories/user-repository.js";
import { generatePassword } from "../services/password-service.js";

/**
 * Resets a user's password using a valid reset token.
 * @param {object} params - Parameters
 * @param {string} params.token - The password reset token
 * @param {string} params.password - The new password
 * @returns {Promise<{ message: string }>} Resolves with status message
 */
async function resetPasswordUsecase({
  token,
  password,
}) {
  const resetToken = await findValidPasswordResetToken(token);

  if (!resetToken) {
    throw new InvalidOrExpiredPasswordResetTokenError();
  }

  const hashedPassword = await generatePassword(password);

  await updateUserData({
    userId: resetToken.userId,
    data: {
      hashedPassword,
    },
  });

  await markPasswordResetTokenAsUsed(resetToken.id);

  return {
    message: "Password reset successful.",
  };
}

export { resetPasswordUsecase };
