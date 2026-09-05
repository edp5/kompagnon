/**
 * The trusted contact is the person a user turns to if a journey goes wrong.
 * It lives on the account rather than on the phone so it survives a reinstall
 * and a change of device — re-typing a phone number is exactly what someone
 * will not manage in the moment they need it.
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.alterTable("users", (table) => {
    table.string("trustedContactName", 255).nullable();
    table.string("trustedContactPhone", 20).nullable();
  });
}

/**
 * @param { import("knex").Knex } knex - The Knex instance
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.alterTable("users", (table) => {
    table.dropColumn("trustedContactName");
    table.dropColumn("trustedContactPhone");
  });
}

export { down, up };
