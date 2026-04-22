/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.createTable("found_journeys", (table) => {
    table.increments("id").primary();
    table
      .integer("companionJourneyId")
      .notNullable()
      .references("id")
      .inTable("companion_journeys")
      .onDelete("CASCADE");
    table
      .integer("passengerJourneyId")
      .notNullable()
      .references("id")
      .inTable("passenger_journeys")
      .onDelete("CASCADE");
    table.string("status").notNullable().defaultTo("waiting");
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.dropTable("found_journeys");
}

export { down, up };
