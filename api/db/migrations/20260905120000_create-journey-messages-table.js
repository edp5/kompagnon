/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.createTable("journey_messages", (table) => {
    table.increments("id").primary();
    table
      .integer("foundJourneyId")
      .notNullable()
      .references("id")
      .inTable("found_journeys")
      .onDelete("CASCADE")
      .index();
    table
      .integer("senderId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.text("body").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.dropTable("journey_messages");
}

export { down, up };
