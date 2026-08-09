const TABLE_NAME = "users";
const COLUMN_NAME = "phoneNumber";

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.alterTable(TABLE_NAME, function(table) {
    table.string(COLUMN_NAME, 10).nullable().comment("User's phone number").unique();
  });
};

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.alterTable(TABLE_NAME, function(table) {
    table.dropColumn(COLUMN_NAME);
  });
};

export { down, up };
