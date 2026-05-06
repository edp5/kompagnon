import databaseBuilder from "../database-builder/index.js";
import { journeys } from "./data/journeys.js";
import { users } from "./data/users.js";

async function seed() {
  console.log("Seeding users");
  await users(databaseBuilder);

  console.log("Seeding journeys...");
  await journeys(databaseBuilder);
}

export { seed };
