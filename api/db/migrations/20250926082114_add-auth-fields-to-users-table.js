const TABLE_NAME = "users";

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
async function up(knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    // Champs pour l'authentification
    table.string("password").nullable(); // Hash du mot de passe
    table.string("email").notNullable().alter(); // Email obligatoire
    table.boolean("email_verified").defaultTo(false).notNullable(); // Vérification email
    table.text("email_verification_token").nullable(); // Token de vérification email

    // Champs pour le statut utilisateur
    table.enum("user_type", ["accompanying", "accompanied"]).nullable(); // Type d'utilisateur
    table.boolean("terms_accepted").defaultTo(false).notNullable(); // Acceptation des CGU
    table.boolean("charter_accepted").defaultTo(false).notNullable(); // Acceptation de la charte
    table.string("identity_document_path").nullable(); // Chemin vers le document d'identité

    // Champs pour la sécurité
    table.integer("login_attempts").defaultTo(0).notNullable(); // Nombre de tentatives de connexion
    table.timestamp("last_login_attempt").nullable(); // Dernière tentative de connexion
    table.timestamp("account_locked_until").nullable(); // Verrouillage temporaire du compte

    // Champs pour la réinitialisation de mot de passe
    table.text("password_reset_token").nullable(); // Token de réinitialisation
    table.timestamp("password_reset_expires").nullable(); // Expiration du token de réinitialisation

    // Champs pour les handicaps (si accompagné)
    table.text("disabilities").nullable(); // JSON des handicaps
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
async function down(knex) {
  await knex.schema.alterTable(TABLE_NAME, (table) => {
    table.dropColumn("password");
    table.string("email").nullable().alter();
    table.dropColumn("email_verified");
    table.dropColumn("email_verification_token");
    table.dropColumn("user_type");
    table.dropColumn("terms_accepted");
    table.dropColumn("charter_accepted");
    table.dropColumn("identity_document_path");
    table.dropColumn("login_attempts");
    table.dropColumn("last_login_attempt");
    table.dropColumn("account_locked_until");
    table.dropColumn("password_reset_token");
    table.dropColumn("password_reset_expires");
    table.dropColumn("disabilities");
  });
};

export { down, up };
