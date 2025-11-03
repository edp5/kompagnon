import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import * as userRepository from "../../../../src/identities-access-management/repositories/user-repository.js";
import { USER_TYPES } from "../../../../src/shared/constants.js";

describe("Integration | Identities Access Management | Repositories | User repository", () => {
  describe("#createNewUser", () => {
    it("should create a new user with default user type", async () => {
      // given
      const userData = {
        firstname: "John",
        lastname: "Doe",
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
        firstname: "John",
        lastname: "Doe",
        email: "duplicate@example.com",
        birthday: "1990-01-01",
        hashedPassword: "hashedPassword123",
        userType: USER_TYPES.USER,
      };

      // when & then
      await expect(userRepository.createNewUser(userData)).rejects.toThrow();
    });
  });

  describe("#findUserById", () => {
    it("should find user by ID", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();

      // when
      const foundUser = await userRepository.findUserById(user.id);

      // then
      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(user.id);
      expect(foundUser.firstname).toBe(user.firstname);
      expect(foundUser.lastname).toBe(user.lastname);
      expect(foundUser.email).toBe(user.email);
    });

    it("should return null if user not found", async () => {
      // when
      const foundUser = await userRepository.findUserById(999);

      // then
      expect(foundUser).toBeNull();
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

  describe("#updateLastLoggedAt", () => {
    it("should update lastLoggedAt timestamp when user has no previous login", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ lastLoggedAt: null });

      // when
      const result = await userRepository.updateLastLoggedAt(user.id);

      // then
      expect(result).toBe(1);
      const updatedUser = await knex("users").where({ id: user.id }).first();
      expect(updatedUser.lastLoggedAt).toBeTruthy();
      expect(new Date(updatedUser.lastLoggedAt).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it("should update lastLoggedAt timestamp when user has previous login", async () => {
      // given
      const previousLoginTime = new Date("2024-01-01T10:00:00Z");
      const user = await databaseBuilder.factory.buildUser({ lastLoggedAt: previousLoginTime });

      // when
      const result = await userRepository.updateLastLoggedAt(user.id);

      // then
      expect(result).toBe(1);
      const updatedUser = await knex("users").where({ id: user.id }).first();
      expect(updatedUser.lastLoggedAt).toBeTruthy();
      expect(new Date(updatedUser.lastLoggedAt).getTime()).toBeGreaterThan(
        previousLoginTime.getTime(),
      );
      expect(new Date(updatedUser.lastLoggedAt).getTime()).toBeLessThanOrEqual(Date.now());
    });

    it("should update updated_at timestamp", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const originalUpdatedAt = user.updated_at;

      // when
      const result = await userRepository.updateLastLoggedAt(user.id);

      // then
      expect(result).toBe(1);
      const updatedUser = await knex("users").where({ id: user.id }).first();
      expect(new Date(updatedUser.updated_at).getTime()).toBeGreaterThan(
        new Date(originalUpdatedAt).getTime(),
      );
    });

    it("should return 0 when user not found", async () => {
      // when
      const result = await userRepository.updateLastLoggedAt(999);

      // then
      expect(result).toBe(0);
    });
  });

  describe("#findUserByEmail", () => {
    it("should return user information", async () => {
      // given
      const createdUser = await databaseBuilder.factory.buildUser({ email: "found@example.net" });

      // when
      const foundUser = await userRepository.findUserByEmail("found@example.net");

      // then
      expect(foundUser).toBeDefined();
      expect(foundUser).toEqual(createdUser);
    });

    it("should return null if user not found", async () => {
      // given
      const email = "toto@example.net";

      // when
      const foundUser = await userRepository.findUserByEmail(email);

      // then
      expect(foundUser).toBeNull();
    });
  });
});
