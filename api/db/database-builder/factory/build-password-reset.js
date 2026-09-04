import { hashResetToken } from "../../../src/identities-access-management/repositories/password-reset-token-repository.js";
import { knex } from "../../knex-database-connection.js";

const TABLE_NAME = "password_reset_tokens";

async function buildPasswordReset({
  userId,
  token = null,
  expiresAt = null,
  usedAt = null,
  createdAt = knex.fn.now(),
} = {}) {
  if (!token) {
    token = crypto.randomUUID();
  }
  const [values] = await knex(TABLE_NAME).insert({
    userId,
    token: hashResetToken(token),
    expiresAt,
    usedAt,
    created_at: createdAt,
  }).returning("*");
  return values;
}

export { buildPasswordReset };
