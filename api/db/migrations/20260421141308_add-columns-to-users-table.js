const TABLE_NAME = "users";
const COLUMNS = ["genre", "role"];

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    COLUMNS.map((column) => table.string(column).defaultTo(null));
    table.specificType("disabilities", "text[]");
  });
};

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    COLUMNS.map((column) => table.dropColumn(column));
  });
};

export { down, up };
