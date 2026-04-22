import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { knex } from "../../../db/knex-database-connection.js";

describe("Database | Migrations", () => {
  beforeAll(async () => {
    await knex.migrate.rollback({}, true);
    await knex.migrate.latest();
  });

  afterAll(async () => {
    await knex.migrate.latest();
    await knex.destroy();
  });

  it("should apply all migrations successfully", async () => {
    const [completedMigrations, pendingMigrations] = await knex.migrate.list();

    expect(completedMigrations.length).toBeGreaterThan(0);
    expect(pendingMigrations).toHaveLength(0);
  });

  it("should rollback all migrations successfully", async () => {
    const [completedMigrations] = await knex.migrate.list();
    const migrationCount = completedMigrations.length;

    for (let step = 0; step < migrationCount; step++) {
      await expect(knex.migrate.down({})).resolves.toBeDefined();

      const [remaining] = await knex.migrate.list();
      expect(remaining).toHaveLength(migrationCount - step - 1);
    }

    const [remainingMigrations] = await knex.migrate.list();
    expect(remainingMigrations).toHaveLength(0);
  });
});
