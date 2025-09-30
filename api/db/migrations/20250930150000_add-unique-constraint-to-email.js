const TABLE_NAME = "users";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.unique("email");
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.dropUnique("email");
  });
};

export { down, up };
