import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import {
  PhoneNumberAlreadyUsedError,
  UserIsAlreadyActive,
  UserNotFoundError,
} from "../../../../src/identities-access-management/errors.js";
import usecases from "../../../../src/identities-access-management/usecases/index.js";
import { USER_DISABILITIES, USER_ROLE } from "../../../../src/shared/constants.js";

describe("Integration | Usecases | Activate user usecase", () => {
  describe("success case", () => {
    it("should Activate user and set phone number", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ isActive: false });

      // when
      await usecases.activateUserUsecase({ userId: user.id, phoneNumber: "0601020304" });

      // then
      const updatedUser = await knex("users").where({ id: user.id }).first();
      expect(updatedUser.isActive).toBeTruthy();
      expect(updatedUser.phoneNumber).toBe("0601020304");
    });

    it("should Activate user as companion without setting disabilities", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ isActive: false });

      // when
      await usecases.activateUserUsecase({ userId: user.id, phoneNumber: "0601020304", role: USER_ROLE.COMPANION });

      // then
      const updatedUser = await knex("users").where({ id: user.id }).first();
      expect(updatedUser.isActive).toBeTruthy();
      expect(updatedUser.role).toBe(USER_ROLE.COMPANION);
      expect(updatedUser.disabilities).toBeNull();
    });

    it("should Activate user as passenger and automatically assign visual disability", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ isActive: false });

      // when
      await usecases.activateUserUsecase({ userId: user.id, phoneNumber: "0601020304", role: USER_ROLE.PASSENGER });

      // then
      const updatedUser = await knex("users").where({ id: user.id }).first();
      expect(updatedUser.isActive).toBeTruthy();
      expect(updatedUser.role).toBe(USER_ROLE.PASSENGER);
      expect(updatedUser.disabilities).toEqual([USER_DISABILITIES.VISUAL_DIFFICULTIES]);
    });
  });

  describe("error case", () => {
    it("should throw an error if user does not exist", async () => {
      // given
      const nonExistentUserId = 999;

      // when
      const result = usecases.activateUserUsecase({ userId: nonExistentUserId, phoneNumber: "0601020304" });

      // then
      await expect(result).rejects.toThrow(UserNotFoundError);
    });

    it("should throw an error if user is already active", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ isActive: true });

      // when
      const result = usecases.activateUserUsecase({ userId: user.id });

      // then
      await expect(result).rejects.toThrow(UserIsAlreadyActive);
    });

    it("should throw an error if phoneNumber already is present in database", async () => {
      // given
      const fakeUser = await databaseBuilder.factory.buildUser();
      const user = await databaseBuilder.factory.buildUser({ isActive: false });

      const result = usecases.activateUserUsecase({ userId: user.id, phoneNumber: fakeUser.phoneNumber });
      // when

      // then
      await expect(result).rejects.toThrow(PhoneNumberAlreadyUsedError);
    });
  });
});
