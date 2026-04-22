import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { knex } from "../../../db/knex-database-connection.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const migrationsDir = join(__dirname, "../../../db/migrations");
const migrateConfig = { directory: migrationsDir };

describe("Database | Migrations", () => {
  beforeAll(async () => {
    await knex.migrate.rollback(migrateConfig, true);
    await knex.migrate.latest(migrateConfig);
  });

  afterAll(async () => {
    await knex.migrate.latest(migrateConfig);
    await knex.destroy();
  });

  it("should apply all migrations successfully", async () => {
    const [completedMigrations, pendingMigrations] = await knex.migrate.list(migrateConfig);

    expect(completedMigrations.length).toBeGreaterThan(0);
    expect(pendingMigrations).toHaveLength(0);
  });

  it("should rollback all migrations successfully", async () => {
    const [completedMigrations] = await knex.migrate.list(migrateConfig);
    const migrationCount = completedMigrations.length;

    for (let step = 0; step < migrationCount; step++) {
      await expect(knex.migrate.down(migrateConfig)).resolves.toBeDefined();

      const [remaining] = await knex.migrate.list(migrateConfig);
      expect(remaining).toHaveLength(migrationCount - step - 1);
    }

    const [remainingMigrations] = await knex.migrate.list(migrateConfig);
    expect(remainingMigrations).toHaveLength(0);
  });
});
