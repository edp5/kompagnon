/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.createTable("journey_shares", (table) => {
    table.increments("id").primary();
    table
      .integer("foundJourneyId")
      .notNullable()
      .references("id")
      .inTable("found_journeys")
      .onDelete("CASCADE")
      .index();
    table
      .integer("createdBy")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.string("token").notNullable().unique().index();
    table.timestamp("expiresAt").notNullable();
    table.timestamp("revokedAt").nullable().defaultTo(null);
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.dropTable("journey_shares");
}

export { down, up };
