import { USER_TYPES } from "../../src/shared/constants.js";

const TABLE_NAME = "users";
const COLUMN_NAME = "userType";

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.string(COLUMN_NAME).defaultTo(USER_TYPES.USER).notNullable();
  });
}

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.dropColumn(COLUMN_NAME);
  });
}

export { down, up };
