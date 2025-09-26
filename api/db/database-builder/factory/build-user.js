import { knex } from "../../knex-database-connection.js";

/**
 * Build a user record in the database
 * @param {Object} userAttributes - User attributes to insert
 * @param {string} userAttributes.firstname - User's first name
 * @param {string} userAttributes.lastname - User's last name
 * @param {string|null} [userAttributes.email] - User's email (optional)
 * @param {string|Date} userAttributes.birthday - User's birthday
 * @param {boolean} [userAttributes.isActive=false] - Whether user is active
 * @param {boolean} [userAttributes.isChecked=false] - Whether user is checked
 * @returns {Promise<Object>} The created user record
 */
async function buildUser(userAttributes = {}) {
  const userDefaults = {
    isActive: false,
    isChecked: false,
  };

  const userToCreate = { ...userDefaults, ...userAttributes };

  const [createdUser] = await knex("users").insert(userToCreate).returning("*");
  return createdUser;
}

export { buildUser };