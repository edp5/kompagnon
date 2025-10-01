import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import * as userRepository from "../../../../src/identities-access-management/repositories/user-repository.js";
import { USER_TYPES } from "../../../../src/shared/constants.js";

describe("UserRepository Integration Tests", () => {
  describe("#createNewUser", () => {
    it("should create a new user with default user type", async () => {
      // given
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        birthday: "1990-01-01",
        hashedPassword: "hashedPassword123",
        userType: USER_TYPES.USER,
      };

      // when
      const userId = await userRepository.createNewUser(userData);

      // then
      expect(userId).toBeDefined();
      expect(typeof userId).toBe("number");

      const user = await knex("users").where({ id: userId }).first();
      expect(user).toMatchObject({
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        birthday: "1990-01-01",
        hashedPassword: "hashedPassword123",
        userType: USER_TYPES.USER,
        isActive: false,
        isChecked: false,
      });
    });

    it("should handle duplicate email constraint", async () => {
      // given
      await databaseBuilder.factory.buildUser({ email: "duplicate@example.com" });

      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "duplicate@example.com",
        birthday: "1990-01-01",
        hashedPassword: "hashedPassword123",
        userType: USER_TYPES.USER,
      };

      // when & then
      await expect(userRepository.createNewUser(userData)).rejects.toThrow();
    });
  });

  describe("#activateUserById", () => {
    it("should activate user successfully", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ isActive: false });

      // when
      await userRepository.activateUserById(user.id);

      // then
      const updatedUser = await knex("users").where({ id: user.id }).first();
      expect(updatedUser.isActive).toBeTruthy();
    });

    it("should throw error if user not found", async () => {
      // when & then
      await expect(userRepository.activateUserById(999)).rejects.toThrow("User with ID 999 not found");
    });
  });
});
