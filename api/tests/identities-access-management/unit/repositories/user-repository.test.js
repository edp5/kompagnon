import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { knex } from "../../../../db/knex-database-connection.js";
import { logger } from "../../../../logger.js";
import { activateUserById, createNewUser, findByEmail, findById } from "../../../../src/identities-access-management/repositories/user-repository.js";
import { DEFAULT_USER_TYPE, USER_TYPES } from "../../../../src/shared/constants.js";

// Mock dependencies
vi.mock("../../../../db/knex-database-connection.js");
vi.mock("../../../../logger.js");

describe("UserRepository Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("createNewUser", () => {
    it("should create a new user with default user type", async () => {
      const mockUser = { id: 1 };
      knex.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockUser]),
        }),
      });

      const result = await createNewUser({
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        birthday: "1990-01-01",
        hashedPassword: "hashedPassword123",
      });

      expect(result).toBe(1);
      expect(knex).toHaveBeenCalledWith("users");
      expect(knex().insert).toHaveBeenCalledWith({
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        birthday: "1990-01-01",
        hashedPassword: "hashedPassword123",
        userType: DEFAULT_USER_TYPE,
        isActive: false,
        isChecked: false,
        created_at: undefined,
        updated_at: undefined,
      });
      expect(logger.info).toHaveBeenCalledWith("Creating new user", {
        email: "john.doe@example.com",
        userType: DEFAULT_USER_TYPE,
      });
      expect(logger.info).toHaveBeenCalledWith("User created successfully", {
        userId: 1,
        email: "john.doe@example.com",
      });
    });

    it("should create a new user with specified user type", async () => {
      const mockUser = { id: 2 };
      knex.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockUser]),
        }),
      });

      const result = await createNewUser({
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        birthday: "1985-05-15",
        hashedPassword: "hashedPassword456",
        userType: USER_TYPES.ADMIN,
      });

      expect(result).toBe(2);
      expect(knex().insert).toHaveBeenCalledWith({
        firstname: "Jane",
        lastname: "Smith",
        email: "jane.smith@example.com",
        birthday: "1985-05-15",
        hashedPassword: "hashedPassword456",
        userType: USER_TYPES.ADMIN,
        isActive: false,
        isChecked: false,
        created_at: undefined,
        updated_at: undefined,
      });
    });

    it("should trim whitespace from input data", async () => {
      const mockUser = { id: 3 };
      knex.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([mockUser]),
        }),
      });

      await createNewUser({
        firstName: "  John  ",
        lastName: "  Doe  ",
        email: "  JOHN.DOE@EXAMPLE.COM  ",
        birthday: "1990-01-01",
        hashedPassword: "hashedPassword123",
      });

      expect(knex().insert).toHaveBeenCalledWith({
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        birthday: "1990-01-01",
        hashedPassword: "hashedPassword123",
        userType: DEFAULT_USER_TYPE,
        isActive: false,
        isChecked: false,
        created_at: undefined,
        updated_at: undefined,
      });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");
      knex.mockReturnValue({
        insert: vi.fn().mockReturnValue({
          returning: vi.fn().mockRejectedValue(dbError),
        }),
      });

      await expect(
        createNewUser({
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          birthday: "1990-01-01",
          hashedPassword: "hashedPassword123",
        }),
      ).rejects.toThrow("Database connection failed");

      expect(logger.error).toHaveBeenCalledWith("Failed to create user", {
        error: dbError,
        email: "john.doe@example.com",
      });
    });
  });

  describe("activateUserById", () => {
    it("should activate user successfully", async () => {
      knex.mockReturnValue({
        where: vi.fn().mockReturnValue({
          update: vi.fn().mockResolvedValue(1), // 1 row updated
        }),
      });

      await activateUserById(1);

      expect(knex).toHaveBeenCalledWith("users");
      expect(knex().where).toHaveBeenCalledWith({ id: 1 });
      expect(knex().where().update).toHaveBeenCalledWith({
        isActive: true,
        updated_at: undefined,
      });
      expect(logger.info).toHaveBeenCalledWith("Activating user", { userId: 1 });
      expect(logger.info).toHaveBeenCalledWith("User activated successfully", { userId: 1 });
    });

    it("should throw error if user not found", async () => {
      knex.mockReturnValue({
        where: vi.fn().mockReturnValue({
          update: vi.fn().mockResolvedValue(0), // 0 rows updated
        }),
      });

      await expect(activateUserById(999)).rejects.toThrow(
        "User with ID 999 not found",
      );

      expect(logger.error).toHaveBeenCalledWith(
        "User activation failed - user not found",
        { userId: 999 },
      );
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");
      knex.mockReturnValue({
        where: vi.fn().mockReturnValue({
          update: vi.fn().mockRejectedValue(dbError),
        }),
      });

      await expect(activateUserById(1)).rejects.toThrow(
        "Database connection failed",
      );

      expect(logger.error).toHaveBeenCalledWith("Failed to activate user", {
        error: dbError,
        userId: 1,
      });
    });
  });

  describe("findByEmail", () => {
    it("should find user by email", async () => {
      const mockUser = { id: 1, email: "john.doe@example.com" };
      knex.mockReturnValue({
        where: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(mockUser),
        }),
      });

      const result = await findByEmail("john.doe@example.com");

      expect(result).toEqual(mockUser);
      expect(knex().where).toHaveBeenCalledWith({ email: "john.doe@example.com" });
    });

    it("should return null if user not found", async () => {
      knex.mockReturnValue({
        where: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(undefined),
        }),
      });

      const result = await findByEmail("nonexistent@example.com");

      expect(result).toBeNull();
    });

    it("should trim and lowercase email", async () => {
      const mockUser = { id: 1, email: "john.doe@example.com" };
      knex.mockReturnValue({
        where: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(mockUser),
        }),
      });

      await findByEmail("  JOHN.DOE@EXAMPLE.COM  ");

      expect(knex().where).toHaveBeenCalledWith({ email: "john.doe@example.com" });
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");
      knex.mockReturnValue({
        where: vi.fn().mockReturnValue({
          first: vi.fn().mockRejectedValue(dbError),
        }),
      });

      await expect(findByEmail("test@example.com")).rejects.toThrow(
        "Database connection failed",
      );

      expect(logger.error).toHaveBeenCalledWith("Failed to find user by email", {
        error: dbError,
        email: "test@example.com",
      });
    });
  });

  describe("findById", () => {
    it("should find user by ID", async () => {
      const mockUser = { id: 1, email: "john.doe@example.com" };
      knex.mockReturnValue({
        where: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(mockUser),
        }),
      });

      const result = await findById(1);

      expect(result).toEqual(mockUser);
      expect(knex().where).toHaveBeenCalledWith({ id: 1 });
    });

    it("should return null if user not found", async () => {
      knex.mockReturnValue({
        where: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(undefined),
        }),
      });

      const result = await findById(999);

      expect(result).toBeNull();
    });

    it("should handle database errors", async () => {
      const dbError = new Error("Database connection failed");
      knex.mockReturnValue({
        where: vi.fn().mockReturnValue({
          first: vi.fn().mockRejectedValue(dbError),
        }),
      });

      await expect(findById(1)).rejects.toThrow(
        "Database connection failed",
      );

      expect(logger.error).toHaveBeenCalledWith("Failed to find user by ID", {
        error: dbError,
        userId: 1,
      });
    });
  });
});
