import { knex } from "../../../db/knex-database-connection.js";

const TABLE_NAME = "password_reset_tokens";

/**
 * Creates a new password reset token in the database
 * @param {object} params - Parameters
 * @param {number} params.userId - The ID of the user
 * @param {string} params.token - The secure random reset token
 * @param {Date} params.expiresAt - The expiration date/time
 * @returns {Promise<number>} The ID of the created password reset token
 */
async function createPasswordResetToken({ userId, token, expiresAt }) {
  const [newToken] = await knex(TABLE_NAME)
    .insert({
      userId,
      token,
      expiresAt,
      created_at: knex.fn.now(),
    })
    .returning("id");

  return newToken.id;
}

/**
 * Finds a valid (unused and not expired) password reset token
 * @param {string} token - The token string to look up
 * @returns {Promise<object|null>} The token record or null
 */
async function findValidPasswordResetToken(token) {
  const resetToken = await knex(TABLE_NAME)
    .where({ token })
    .whereNull("usedAt")
    .where("expiresAt", ">", knex.fn.now())
    .first();

  return resetToken || null;
}

/**
 * Finds a password reset token by token string
 * @param {string} token - The token string
 * @returns {Promise<object|null>} The token record or null
 */
async function findPasswordResetTokenByToken(token) {
  const resetToken = await knex(TABLE_NAME)
    .where({ token })
    .first();

  return resetToken || null;
}

/**
 * Marks a password reset token as used
 * @param {number} tokenId - The ID of the password reset token
 * @returns {Promise<void>}
 */
async function markPasswordResetTokenAsUsed(tokenId) {
  await knex(TABLE_NAME)
    .where({ id: tokenId })
    .update({
      usedAt: knex.fn.now(),
    });
}

export {
  createPasswordResetToken,
  findPasswordResetTokenByToken,
  findValidPasswordResetToken,
  markPasswordResetTokenAsUsed,
};
