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
 * @param {Function} [params.findValidToken] - Function to lookup valid token
 * @param {Function} [params.markUsed] - Function to mark token as consumed
 * @param {Function} [params.hashPassword] - Function to hash the new password
 * @param {Function} [params.updatePassword] - Function to update user in DB
 * @returns {Promise<{ message: string }>} Resolves with status message
 */
async function resetPasswordUsecase({
  token,
  password,
  findValidToken = findValidPasswordResetToken,
  markUsed = markPasswordResetTokenAsUsed,
  hashPassword = generatePassword,
  updatePassword = updateUserData,
}) {
  const resetToken = await findValidToken(token);

  if (!resetToken) {
    throw new InvalidOrExpiredPasswordResetTokenError();
  }

  const hashedPassword = await hashPassword(password);

  await updatePassword({
    userId: resetToken.userId,
    data: {
      hashedPassword,
    },
  });

  await markUsed(resetToken.id);

  return {
    message: "Password reset successful.",
  };
}

export { resetPasswordUsecase };
