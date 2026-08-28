import { knex } from "../../knex-database-connection.js";
import { buildUser } from "./build-user.js";

const TABLE_NAME = "notifications";

async function buildNotification({
  userId = null,
  type = "journey_match_found",
  title = "Nouvelle correspondance de trajet",
  message = "Une correspondance a été trouvée pour votre trajet.",
  isRead = false,
} = {}) {
  if (!userId) {
    const user = await buildUser({ email: `${crypto.randomUUID()}@example.net` });
    userId = user.id;
  }
  const [values] = await knex(TABLE_NAME).insert({
    userId,
    type,
    title,
    message,
    isRead,
    created_at: new Date(),
    updated_at: new Date(),
  }).returning("*");
  return values;
}

export { buildNotification };
