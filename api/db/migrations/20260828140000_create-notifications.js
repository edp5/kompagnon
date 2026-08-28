/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.createTable("notifications", (table) => {
    table.increments("id").primary();
    table
      .integer("userId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("type").notNullable().comment("machine-readable notification kind, e.g. journey_match_found");
    table.text("title").notNullable();
    table.text("message").notNullable();
    table.boolean("isRead").notNullable().defaultTo(false);
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.dropTable("notifications");
}

export { down, up };
