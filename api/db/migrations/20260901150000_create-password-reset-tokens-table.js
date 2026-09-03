/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.createTable("password_reset_tokens", (table) => {
    table.increments("id").primary();
    table
      .integer("userId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("token").notNullable().unique().index();
    table.timestamp("expiresAt").notNullable();
    table.timestamp("usedAt").nullable().defaultTo(null);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.dropTable("password_reset_tokens");
}

export { down, up };
