import { generatePassword } from "../../../src/identities-access-management/services/password-service.js";
import { DEFAULT_USER_TYPE } from "../../../src/shared/constants.js";
import { knex } from "../../knex-database-connection.js";
async function buildUser({ firstname = "John", lastname = "Doe", email = "john.doe@example.net", birthday = "01/01/1970", created_at = new Date(), updated_at = new Date(), isActive = true, isChecked = true, hashedPassword = null, userType = DEFAULT_USER_TYPE, lastLoggedAt = null } = {}) {
  if (!hashedPassword) {
    hashedPassword = await generatePassword("password");
  }
  const [values] = await knex("users").insert({
    firstname,
    lastname,
    email,
    birthday,
    created_at,
    updated_at,
    isActive,
    isChecked,
    hashedPassword,
    userType,
    lastLoggedAt,
  }).returning("*");
  return values;
}

export { buildUser };
