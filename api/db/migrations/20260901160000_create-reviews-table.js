/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.createTable("reviews", (table) => {
    table.increments("id").primary();
    table
      .integer("foundJourneyId")
      .notNullable()
      .references("id")
      .inTable("found_journeys")
      .onDelete("CASCADE");
    table
      .integer("authorId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("targetUserId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.integer("rating").notNullable();
    table.text("comment").nullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());

    table.unique(["foundJourneyId", "authorId"]);
  });
}

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.dropTable("reviews");
}

export { down, up };
