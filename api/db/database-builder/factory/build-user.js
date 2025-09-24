import { knex } from "../../knex-database-connection.js";

async function buildUser({ firstname = "John", lastname = "Doe", email = "john.doe@example.net", birthday = "01/01/1970", created_at = new Date(), updated_at = new Date(), isActive = true, isChecked = true }) {
  const [values] = await knex("users").insert({
    firstname,
    lastname,
    email,
    birthday,
    created_at,
    updated_at,
    isActive,
    isChecked,
  }).returning("*");
  return values;
}

export { buildUser };
