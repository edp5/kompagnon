import { knex as configuredKnex } from "../../../db/knex-database-connection.js";
import { logger } from "../../../logger.js";

const TABLE_NAME = "users";

/**
 * Creates a new user in the database
 * @param {Object} userData - User data to create
 * @param {string} userData.firstname - User's first name
 * @param {string} userData.lastname - User's last name
 * @param {string} userData.email - User's email address
 * @param {string} userData.birthday - User's birthday (YYYY-MM-DD format)
 * @param {string} userData.password - Hashed password
 * @returns {Promise<Object>} Created user object
 */
async function createUser(userData) {
  try {
    const { firstname, lastname, email, birthday, password } = userData;
    
    const [user] = await configuredKnex(TABLE_NAME)
      .insert({
        firstname,
        lastname,
        email,
        birthday,
        password,
        isActive: false, // User starts inactive until email activation
        isChecked: false,
        created_at: configuredKnex.fn.now(),
        updated_at: configuredKnex.fn.now(),
      })
      .returning("*");

    logger.info(`User created successfully with ID: ${user.id}`);
    return user;
  } catch (error) {
    logger.error("Failed to create user", error);
    
    // Handle unique constraint violation (duplicate email)
    if (error.code === "23505" && error.constraint === "users_email_unique") {
      throw new Error("Email already exists");
    }
    
    throw new Error("Failed to create user");
  }
}

/**
 * Finds a user by email
 * @param {string} email - User's email address
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function findUserByEmail(email) {
  try {
    const user = await configuredKnex(TABLE_NAME)
      .where({ email })
      .first();

    return user || null;
  } catch (error) {
    logger.error(`Failed to find user by email: ${email}`, error);
    throw new Error("Database error while finding user");
  }
}

/**
 * Finds a user by ID
 * @param {number} id - User's ID
 * @returns {Promise<Object|null>} User object or null if not found
 */
async function findUserById(id) {
  try {
    const user = await configuredKnex(TABLE_NAME)
      .where({ id })
      .first();

    return user || null;
  } catch (error) {
    logger.error(`Failed to find user by ID: ${id}`, error);
    throw new Error("Database error while finding user");
  }
}

/**
 * Activates a user account
 * @param {number} userId - User's ID
 * @returns {Promise<Object>} Updated user object
 */
async function activateUser(userId) {
  try {
    const [user] = await configuredKnex(TABLE_NAME)
      .where({ id: userId })
      .update({
        isActive: true,
        updated_at: configuredKnex.fn.now(),
      })
      .returning("*");

    if (!user) {
      throw new Error("User not found");
    }

    logger.info(`User activated successfully with ID: ${userId}`);
    return user;
  } catch (error) {
    logger.error(`Failed to activate user with ID: ${userId}`, error);
    throw new Error("Failed to activate user");
  }
}

export { activateUser, createUser, findUserByEmail, findUserById };
