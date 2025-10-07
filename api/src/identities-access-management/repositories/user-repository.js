import { knex } from "../../../db/knex-database-connection.js";
import { logger } from "../../../logger.js";

/**
 * Creates a new user in the database
 * @param {object} params - User creation parameters
 * @param {string} params.firstname - User's first name
 * @param {string} params.lastname - User's last name
 * @param {string} params.email - User's email address
 * @param {string} params.birthday - User's birthday (YYYY-MM-DD format)
 * @param {string} params.hashedPassword - User's hashed password
 * @param {string} params.userType - Type of user (from USER_TYPES constants)
 * @returns {Promise<number>} The ID of the created user
 * @throws {Error} If user creation fails
 */
async function createNewUser({ firstname, lastname, email, birthday, hashedPassword, userType }) {
  try {
    const [newUser] = await knex("users")
      .insert({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim().toLowerCase(),
        birthday,
        hashedPassword,
        userType,
        isActive: false, // User starts inactive until activation
        isChecked: false,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      })
      .returning("id");

    return newUser.id;
  } catch (error) {
    logger.error("Failed to create user", { error, email });
    throw error;
  }
}

/**
 * Activates a user by setting isActive to true
 * @param {number} userId - The ID of the user to activate
 * @returns {Promise<void>}
 * @throws {Error} If user is not found or activation fails
 */
async function activateUserById(userId) {
  try {
    const updatedRows = await knex("users")
      .where({ id: userId })
      .update({
        isActive: true,
        updated_at: knex.fn.now(),
      });

    if (updatedRows === 0) {
      const error = new Error(`User with ID ${userId} not found`);
      logger.error("User activation failed - user not found", { userId });
      throw error;
    }
  } catch (error) {
    logger.error("Failed to activate user", { error, userId });
    throw error;
  }
}

export { activateUserById, createNewUser };
