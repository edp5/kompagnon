/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.createTable("found_journeys", (table) => {
    table.increments("id").primary();
    table
      .integer("companion_journey_id")
      .notNullable()
      .references("id")
      .inTable("companion_journeys")
      .onDelete("CASCADE");
    table
      .integer("passenger_journey_id")
      .notNullable()
      .references("id")
      .inTable("passenger_journeys")
      .onDelete("CASCADE");
    table.string("status").notNullable().defaultTo("waiting");
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
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
