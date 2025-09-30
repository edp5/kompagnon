import { knex } from "../../../db/knex-database-connection.js";
import { logger } from "../../../logger.js";
import { DEFAULT_USER_TYPE } from "../../shared/constants.js";

/**
 * Creates a new user in the database
 * @param {Object} params - User creation parameters
 * @param {string} params.firstName - User's first name
 * @param {string} params.lastName - User's last name
 * @param {string} params.email - User's email address
 * @param {string} params.birthday - User's birthday (YYYY-MM-DD format)
 * @param {string} params.hashedPassword - User's hashed password
 * @param {string} params.userType - Type of user (from USER_TYPES constants)
 * @returns {Promise<number>} The ID of the created user
 * @throws {Error} If user creation fails
 */
async function createNewUser({ firstName, lastName, email, birthday, hashedPassword, userType = DEFAULT_USER_TYPE }) {
  try {
    logger.info("Creating new user", { email, userType });

    const [newUser] = await knex("users")
      .insert({
        firstname: firstName.trim(),
        lastname: lastName.trim(),
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

    logger.info("User created successfully", { userId: newUser.id, email });
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
    logger.info("Activating user", { userId });

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

    logger.info("User activated successfully", { userId });
  } catch (error) {
    logger.error("Failed to activate user", { error, userId });
    throw error;
  }
}

/**
 * Finds a user by email
 * @param {string} email - User's email address
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function findByEmail(email) {
  try {
    const user = await knex("users")
      .where({ email: email.trim().toLowerCase() })
      .first();

    return user || null;
  } catch (error) {
    logger.error("Failed to find user by email", { error, email });
    throw error;
  }
}

/**
 * Finds a user by ID
 * @param {number} userId - User's ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function findById(userId) {
  try {
    const user = await knex("users")
      .where({ id: userId })
      .first();

    return user || null;
  } catch (error) {
    logger.error("Failed to find user by ID", { error, userId });
    throw error;
  }
}

// Export functions directly
export { activateUserById, createNewUser, findByEmail, findById };
