import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../db/database-builder/index.js";
import { knex } from "../../../db/knex-database-connection.js";
import { UserIsAlreadyActive, UserNotFoundError } from "../../../src/identities-access-management/errors.js";
import usecases from "../../../src/identities-access-management/usecases/index.js";

describe("Integration | Usecases | Activate user usecase", () => {
  describe("success case", () => {
    it("should Activate user", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ isActive: false });

      // when
      await usecases.activateUserUsecase(user.id);

      // then
      const updatedUser = await knex("users").where({ id: user.id }).first();
      expect(updatedUser.isActive).toBeTruthy();
    });
  });

  describe("error case", () => {
    it("should throw an error if user does not exist", async () => {
      // given
      const nonExistentUserId = 999;

      // when
      const result = usecases.activateUserUsecase(nonExistentUserId);

      // then
      await expect(result).rejects.toThrow(UserNotFoundError);
    });

    it("should throw an error if user is already active", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ isActive: true });

      // when
      const result = usecases.activateUserUsecase(user.id);

      // then
      await expect(result).rejects.toThrow(UserIsAlreadyActive);
    });
  });
});
