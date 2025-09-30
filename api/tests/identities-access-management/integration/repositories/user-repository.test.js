import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { buildUser } from "../../../../db/database-builder/factory/build-user.js";
import { knex } from "../../../../db/knex-database-connection.js";
import { activateUserById, createNewUser, findByEmail, findById } from "../../../../src/identities-access-management/repositories/user-repository.js";
import { DEFAULT_USER_TYPE, USER_TYPES } from "../../../../src/shared/constants.js";

describe("UserRepository Integration Tests", () => {
  beforeEach(async () => {
    // Clean up users table before each test
    await knex("users").del();
  });

  afterEach(async () => {
    // Clean up after each test
    await knex("users").del();
  });

  describe("createNewUser", () => {
    it("should create a new user with default user type", async () => {
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        birthday: "1990-01-01",
        hashedPassword: "hashedPassword123",
      };

      const userId = await createNewUser(userData);

      expect(userId).toBeDefined();
      expect(typeof userId).toBe("number");

      // Verify user was created in database
      const users = await knex("users").where({ id: userId });
      expect(users).toHaveLength(1);
      expect(users[0]).toMatchObject({
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        hashedPassword: "hashedPassword123",
        userType: DEFAULT_USER_TYPE,
        isActive: false,
        isChecked: false,
      });
    });

    it("should create a new user with specified user type", async () => {
      const userData = {
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        birthday: "1985-05-15",
        hashedPassword: "hashedPassword456",
        userType: USER_TYPES.ADMIN,
      };

      const userId = await createNewUser(userData);

      expect(userId).toBeDefined();

      // Verify user was created with correct type
      const users = await knex("users").where({ id: userId });
      expect(users[0].userType).toBe(USER_TYPES.ADMIN);
    });

    it("should trim whitespace from input data", async () => {
      const userData = {
        firstName: "  John  ",
        lastName: "  Doe  ",
        email: "  JOHN.DOE@EXAMPLE.COM  ",
        birthday: "1990-01-01",
        hashedPassword: "hashedPassword123",
      };

      const userId = await createNewUser(userData);

      // Verify trimmed data in database
      const users = await knex("users").where({ id: userId });
      expect(users[0]).toMatchObject({
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
      });
    });

    it("should handle duplicate email constraint", async () => {
      // Create first user
      await buildUser({ email: "duplicate@example.com" });

      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "duplicate@example.com",
        birthday: "1990-01-01",
        hashedPassword: "hashedPassword123",
      };

      await expect(createNewUser(userData)).rejects.toThrow();
    });
  });

  describe("activateUserById", () => {
    it("should activate user successfully", async () => {
      // Create a user using databaseBuilder
      const user = await buildUser({
        email: "test@example.com",
        isActive: false,
      });

      await activateUserById(user.id);

      // Verify user is now active
      const updatedUser = await knex("users").where({ id: user.id }).first();
      expect(updatedUser.isActive).toBe(true);
    });

    it("should throw error if user not found", async () => {
      await expect(activateUserById(999)).rejects.toThrow(
        "User with ID 999 not found",
      );
    });

    it("should update timestamp when activating", async () => {
      const user = await buildUser({
        email: "test@example.com",
        isActive: false,
      });

      const originalUpdatedAt = user.updated_at;

      await activateUserById(user.id);

      const updatedUser = await knex("users").where({ id: user.id }).first();
      expect(new Date(updatedUser.updated_at)).toBeInstanceOf(Date);
      expect(updatedUser.updated_at).not.toEqual(originalUpdatedAt);
    });
  });

  describe("findByEmail", () => {
    it("should find user by email", async () => {
      const user = await buildUser({
        email: "findme@example.com",
        firstname: "Find",
        lastname: "Me",
      });

      const foundUser = await findByEmail("findme@example.com");

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(user.id);
      expect(foundUser.email).toBe("findme@example.com");
    });

    it("should return null if user not found", async () => {
      const foundUser = await findByEmail("nonexistent@example.com");

      expect(foundUser).toBeNull();
    });

    it("should handle case insensitive email search", async () => {
      await buildUser({ email: "case@example.com" });

      const foundUser = await findByEmail("CASE@EXAMPLE.COM");

      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe("case@example.com");
    });

    it("should trim whitespace from email", async () => {
      await buildUser({ email: "trim@example.com" });

      const foundUser = await findByEmail("  trim@example.com  ");

      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe("trim@example.com");
    });
  });

  describe("findById", () => {
    it("should find user by ID", async () => {
      const user = await buildUser({
        email: "findbyid@example.com",
        firstname: "Find",
        lastname: "ById",
      });

      const foundUser = await findById(user.id);

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(user.id);
      expect(foundUser.email).toBe("findbyid@example.com");
    });

    it("should return null if user not found", async () => {
      const foundUser = await findById(999);

      expect(foundUser).toBeNull();
    });
  });

  describe("end-to-end workflow", () => {
    it("should complete full user registration and activation workflow", async () => {
      // 1. Create user
      const userData = {
        firstName: "End",
        lastName: "ToEnd",
        email: "endtoend@example.com",
        birthday: "1990-01-01",
        hashedPassword: "hashedPassword123",
        userType: USER_TYPES.USER,
      };

      const userId = await createNewUser(userData);

      // 2. Verify user is inactive
      let user = await findById(userId);
      expect(user.isActive).toBe(false);

      // 3. Find user by email
      user = await findByEmail("endtoend@example.com");
      expect(user.id).toBe(userId);

      // 4. Activate user
      await activateUserById(userId);

      // 5. Verify user is now active
      user = await findById(userId);
      expect(user.isActive).toBe(true);
    });
  });
});
