import { knex } from "../../knex-database-connection.js";

async function buildUser({ firstname = "John", lastname = "Doe", email = "john.doe@example.net", birthday = "01/01/1970", password = "$2b$10$dummy.hash.for.testing", created_at = new Date(), updated_at = new Date(), isActive = true, isChecked = true }) {
  const [values] = await knex("users").insert({
    firstname,
    lastname,
    email,
    birthday,
    password,
    created_at,
    updated_at,
    isActive,
    isChecked,
  }).returning("*");
  return values;
}

export { buildUser };
