/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.createTable("journey_positions", (table) => {
    table.increments("id").primary();
    table
      .integer("foundJourneyId")
      .notNullable()
      .references("id")
      .inTable("found_journeys")
      .onDelete("CASCADE")
      .index();
    table
      .integer("userId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.decimal("lat", 10, 8).notNullable();
    table.decimal("lon", 11, 8).notNullable();
    table.timestamp("recorded_at").notNullable().defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.dropTable("journey_positions");
}

export { down, up };
