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
    table.timestamp("departure_time").notNullable().comment("departure time");
    table.timestamp("arrival_time").notNullable().comment("arrival time");
    table.text("departure_address").notNullable();
    table.text("arrival_address").notNullable();
    table
      .decimal("departure_lon", 11, 8)
      .notNullable()
      .comment(
        "departure longitude is a parameter for the algorythm to find the closest passenger",
      );
    table
      .decimal("departure_lat", 10, 8)
      .notNullable()
      .comment(
        "departure latitude is a parameter for the algorythm to find the closest passenger",
      );
    table
      .decimal("arrival_lon", 11, 8)
      .notNullable()
      .comment(
        "arrival longitude is a parameter for the algorythm to find the closest passenger",
      );
    table
      .decimal("arrival_lat", 10, 8)
      .notNullable()
      .comment(
        "arrival latitude is a parameter for the algorythm to find the closest passenger",
      );
    table.timestamp("created_at").defaultTo(knex.fn.now());
    table.timestamp("updated_at").defaultTo(knex.fn.now());
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
