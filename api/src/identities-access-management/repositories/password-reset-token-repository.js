import crypto from "node:crypto";

import { knex } from "../../../db/knex-database-connection.js";

const TABLE_NAME = "password_reset_tokens";

/**
 * Hashes a reset token before it touches the database. The raw token is only
 * ever sent to the user by email; the database stores its SHA-256 hash so that
 * a database leak cannot be replayed to reset accounts.
 * @param {string} token - The raw reset token.
 * @returns {string} The SHA-256 hash of the token (hex).
 */
function hashResetToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Creates a new password reset token in the database. The token is stored hashed.
 * @param {object} params - Parameters
 * @param {number} params.userId - The ID of the user
 * @param {string} params.token - The secure random reset token (raw)
 * @param {Date} params.expiresAt - The expiration date/time
 * @returns {Promise<number>} The ID of the created password reset token
 */
async function createPasswordResetToken({ userId, token, expiresAt }) {
  const [newToken] = await knex(TABLE_NAME)
    .insert({
      userId,
      token: hashResetToken(token),
      expiresAt,
      created_at: knex.fn.now(),
    })
    .returning("id");

  return newToken.id;
}

/**
 * Finds a valid (unused and not expired) password reset token
 * @param {string} token - The raw token string to look up
 * @returns {Promise<object|null>} The token record or null
 */
async function findValidPasswordResetToken(token) {
  const resetToken = await knex(TABLE_NAME)
    .where({ token: hashResetToken(token) })
    .whereNull("usedAt")
    .where("expiresAt", ">", knex.fn.now())
    .first();

  return resetToken || null;
}

/**
 * Finds a password reset token by token string
 * @param {string} token - The raw token string
 * @returns {Promise<object|null>} The token record or null
 */
async function findPasswordResetTokenByToken(token) {
  const resetToken = await knex(TABLE_NAME)
    .where({ token: hashResetToken(token) })
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
  hashResetToken,
  markPasswordResetTokenAsUsed,
};
