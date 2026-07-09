import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import { InvalidCredentialsError } from "../../../../src/identities-access-management/errors.js";
import usecases from "../../../../src/identities-access-management/usecases/index.js";

describe("Integration | Identities Access Management | Usecases | Authenticate user with credentials usecase", () => {
  describe("success case", () => {
    it("should return user id and token", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ email: "test@example.net", password: "password" });

      // when
      const result = await usecases.authenticateUserWithCredentialsUsecase({ email: "test@example.net", password: "password" });

      // then
      expect(result.userId).toBe(user.id);
      expect(result.token).toBeDefined();
      const updatedUser = await knex("users").where({ id: user.id }).first();
      expect(updatedUser.lastLoggedAt).toBeDefined();
      expect(user.lastLoggedAt).not.toBe(updatedUser.lastLoggedAt);
    });
  });

  describe("error cases", () => {
    it("should throw an error if email is invalid", async () => {
      // when
      const result = usecases.authenticateUserWithCredentialsUsecase({ email: "test@example.net" });

      // then
      await expect(result).rejects.toThrow(InvalidCredentialsError);
    });

    it("should throw an error if password is invalid", async () => {
      // given
      await databaseBuilder.factory.buildUser({ email: "t@example.net", password: "toto" });

      // when
      const result = usecases.authenticateUserWithCredentialsUsecase({ email: "t@example.net", password: "tata" });

      // then
      await expect(result).rejects.toThrow(InvalidCredentialsError);
    });
  });
});
