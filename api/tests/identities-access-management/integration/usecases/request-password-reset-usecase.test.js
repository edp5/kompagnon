import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import usecases from "../../../../src/identities-access-management/usecases/index.js";

describe("Integration | Identities Access Management | Usecases | Request password reset usecase", () => {
  describe("success case", () => {
    it("should create a password reset token in the database when user exists", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ email: "jean.dupont@example.com" });

      // when
      const result = await usecases.requestPasswordResetUsecase({
        email: " JEAN.DUPONT@example.com ",
      });

      // then
      expect(result).toHaveProperty("message");
      const tokens = await knex("password_reset_tokens").where({ userId: user.id });
      expect(tokens).toHaveLength(1);
      expect(tokens[0].token).toBeDefined();
      expect(new Date(tokens[0].expiresAt).getTime()).toBeGreaterThan(Date.now());
      expect(tokens[0].usedAt).toBeNull();
    });
  });

  describe("anti-enumeration case", () => {
    it("should return success message without creating a token when user is not found", async () => {
      // when
      const result = await usecases.requestPasswordResetUsecase({
        email: "unknown@example.com",
      });

      // then
      expect(result).toHaveProperty("message");
      const tokens = await knex("password_reset_tokens");
      const matchingToken = tokens.find((t) => t.userId === 999999);
      expect(matchingToken).toBeUndefined();
    });
  });
});
