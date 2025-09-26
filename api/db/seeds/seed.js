import { logger } from "../../logger.js";
import { users } from "./data/users.js";

/**
 * Knex seed function that seeds the database with sample data
 * @param {import('knex').Knex} knex - The Knex instance
 * @returns {Promise<void>}
 */
// eslint-disable-next-line no-unused-vars
async function seed(knex) {
  logger.info("Starting database seeding...");

  try {
    logger.info("Seeding users...");
    const createdUsers = await users();
    logger.info(`Successfully created ${createdUsers.length} users`);

    logger.info("Database seeding completed successfully");
  } catch (error) {
    logger.error("Error during database seeding:", error);
    throw error;
  }
}

export { seed };