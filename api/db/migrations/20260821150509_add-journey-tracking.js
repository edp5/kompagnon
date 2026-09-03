import { JOURNEY_TRACKING_STATUS } from "../../src/journeys/constants.js";

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  // Add tracking status column to passenger_journeys
  await knex.schema.alterTable("passenger_journeys", (table) => {
    table
      .string("trackingStatus")
      .notNullable()
      .defaultTo(JOURNEY_TRACKING_STATUS.NOT_STARTED)
      .comment("Tracking lifecycle: not_started | in_progress | completed | cancelled");
  });

  // Add tracking status column to companion_journeys
  await knex.schema.alterTable("companion_journeys", (table) => {
    table
      .string("trackingStatus")
      .notNullable()
      .defaultTo(JOURNEY_TRACKING_STATUS.NOT_STARTED)
      .comment("Tracking lifecycle: not_started | in_progress | completed | cancelled");
  });

  // Create journey_tracking table to store GPS positions
  await knex.schema.createTable("journey_tracking", (table) => {
    table.increments("id").primary();
    table.integer("journeyId").notNullable().comment("ID of the passenger or companion journey");
    table
      .string("journeyType")
      .notNullable()
      .comment("passenger | companion");
    table
      .integer("userId")
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL")
      .comment("User ID who recorded the position");
    table
      .decimal("lat", 10, 8)
      .notNullable()
      .comment("GPS latitude of the recorded position");
    table
      .decimal("lon", 11, 8)
      .notNullable()
      .comment("GPS longitude of the recorded position");
    table.timestamp("recorded_at").defaultTo(knex.fn.now());

    table.index(["journeyId", "journeyType"]);
    table.index(["recorded_at"]);
  });
}

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.dropTable("journey_tracking");
  await knex.schema.alterTable("passenger_journeys", (table) => {
    table.dropColumn("trackingStatus");
  });
  await knex.schema.alterTable("companion_journeys", (table) => {
    table.dropColumn("trackingStatus");
  });
}

export { down, up };
