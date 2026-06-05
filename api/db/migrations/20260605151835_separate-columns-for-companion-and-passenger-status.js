import { JOURNEY_STATUS } from "../../src/shared/constants.js";

const TABLE_NAME = "found_journeys";

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.alterTable(TABLE_NAME, function(table) {
    table.dropColumns("status");
    table.string("companionStatus").notNullable().defaultTo(JOURNEY_STATUS.WAITING).comment("The status of the companion");
    table.string("passengerStatus").notNullable().defaultTo(JOURNEY_STATUS.WAITING).comment("The status of the passenger");
  });
};

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.alterTable(TABLE_NAME, function(table) {
    table.dropColumns("companionStatus", "passengerStatus");
    table.string("status").notNullable().defaultTo(JOURNEY_STATUS.WAITING);
  });
};

export { down, up };
