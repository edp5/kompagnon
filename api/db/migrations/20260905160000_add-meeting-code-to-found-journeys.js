/**
 * The meeting code lets the two users check they found each other before the
 * journey starts, which is the only way a blind passenger can tell that the
 * person greeting them is really their companion.
 *
 * The default is set in the database rather than in the application, so a row
 * cannot be created without a code whichever path creates it — the matching job
 * included.
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.alterTable("found_journeys", (table) => {
    table
      .string("meetingCode", 4)
      .notNullable()
      .defaultTo(knex.raw("lpad((floor(random() * 10000))::text, 4, '0')"));
  });
}

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.alterTable("found_journeys", (table) => {
    table.dropColumn("meetingCode");
  });
}

export { down, up };
