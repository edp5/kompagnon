/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.createTable("companion_journeys", (table) => {
    table.increments("id").primary();
    table
      .integer("userId")
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table.timestamp("departureTime").notNullable().comment("departure time");
    table.timestamp("arrivalTime").notNullable().comment("arrival time");
    table.text("departureAddress").notNullable();
    table.text("arrivalAddress").notNullable();
    table
      .decimal("departureLon", 11, 8)
      .notNullable()
      .comment(
        "departure longitude is a parameter for the algorythm to find the closest passenger",
      );
    table
      .decimal("departureLat", 10, 8)
      .notNullable()
      .comment(
        "departure latitude is a parameter for the algorythm to find the closest passenger",
      );
    table
      .decimal("arrivalLon", 11, 8)
      .notNullable()
      .comment(
        "arrival longitude is a parameter for the algorythm to find the closest passenger",
      );
    table
      .decimal("arrivalLat", 10, 8)
      .notNullable()
      .comment(
        "arrival latitude is a parameter for the algorythm to find the closest passenger",
      );
    table.timestamp("createdAt").defaultTo(knex.fn.now());
    table.timestamp("updatedAt").defaultTo(knex.fn.now());
  });
}

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.dropTable("companion_journeys");
}

export { down, up };
