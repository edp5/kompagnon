/**
 * A review is written by one participant about the other, once the journey is
 * over. The unique key holds one review per author per journey: someone who
 * changes their mind edits what they wrote rather than piling on a second
 * opinion of the same trip.
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.createTable("journey_reviews", (table) => {
    table.increments("id").primary();
    table
      .integer("foundJourneyId")
      .notNullable()
      .references("id")
      .inTable("found_journeys")
      .onDelete("CASCADE")
      .index();
    table
      .integer("authorId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("subjectId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE")
      .index();
    table.integer("rating").notNullable();
    table.text("comment").nullable();
    table.timestamp("created_at").notNullable().defaultTo(knex.fn.now());
    table.timestamp("updated_at").notNullable().defaultTo(knex.fn.now());
    table.unique(["foundJourneyId", "authorId"]);
  });
}

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.dropTable("journey_reviews");
}

export { down, up };
