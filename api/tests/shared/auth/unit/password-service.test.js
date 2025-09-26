import { describe, expect, it, vi } from "vitest";

import passwordService from "../../../../src/shared/auth/password-service.js";

vi.mock("../../../../config.js", () => ({
  config: {
    users: {
      passwordHash: 10,
    },
  },
}));

describe("Unit | Shared | Auth | Password Service", () => {
  describe("hashPassword", () => {
    it("should hash a valid password", async () => {
      // given
      const password = "Password123!";

      // when
      const hashedPassword = await passwordService.hashPassword(password);

      // then
      expect(hashedPassword).toBeDefined();
      expect(typeof hashedPassword).toBe("string");
      expect(hashedPassword).not.toBe(password);
      expect(hashedPassword.length).toBeGreaterThan(0);
    });

    it("should throw error for empty password", async () => {
      // given
      const password = "";

      // when & then
      await expect(passwordService.hashPassword(password)).rejects.toThrow("Password must be a non-empty string");
    });

    it("should throw error for null password", async () => {
      // given
      const password = null;

      // when & then
      await expect(passwordService.hashPassword(password)).rejects.toThrow("Password must be a non-empty string");
    });

    it("should throw error for undefined password", async () => {
      // given
      const password = undefined;

      // when & then
      await expect(passwordService.hashPassword(password)).rejects.toThrow("Password must be a non-empty string");
    });

    it("should throw error for short password", async () => {
      // given
      const password = "short";

      // when & then
      await expect(passwordService.hashPassword(password)).rejects.toThrow("Password must be at least 8 characters long");
    });

    it("should throw error for non-string password", async () => {
      // given
      const password = 12345678;

      // when & then
      await expect(passwordService.hashPassword(password)).rejects.toThrow("Password must be a non-empty string");
    });
  });

  describe("verifyPassword", () => {
    it("should verify correct password", async () => {
      // given
      const password = "Password123!";
      const hashedPassword = await passwordService.hashPassword(password);

      // when
      const isValid = await passwordService.verifyPassword(password, hashedPassword);

      // then
      expect(isValid).toBe(true);
    });

    it("should reject incorrect password", async () => {
      // given
      const password = "Password123!";
      const wrongPassword = "WrongPassword123!";
      const hashedPassword = await passwordService.hashPassword(password);

      // when
      const isValid = await passwordService.verifyPassword(wrongPassword, hashedPassword);

      // then
      expect(isValid).toBe(false);
    });

    it("should return false for null password", async () => {
      // given
      const password = null;
      const hashedPassword = "some_hash";

      // when
      const isValid = await passwordService.verifyPassword(password, hashedPassword);

      // then
      expect(isValid).toBe(false);
    });

    it("should return false for null hashed password", async () => {
      // given
      const password = "Password123!";
      const hashedPassword = null;

      // when
      const isValid = await passwordService.verifyPassword(password, hashedPassword);

      // then
      expect(isValid).toBe(false);
    });

    it("should return false for undefined password", async () => {
      // given
      const password = undefined;
      const hashedPassword = "some_hash";

      // when
      const isValid = await passwordService.verifyPassword(password, hashedPassword);

      // then
      expect(isValid).toBe(false);
    });
  });

  describe("validatePasswordStrength", () => {
    it("should validate strong password", () => {
      // given
      const password = "StrongPassword123!";

      // when
      const result = passwordService.validatePasswordStrength(password);

      // then
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it("should reject password that is too short", () => {
      // given
      const password = "Short1!";

      // when
      const result = passwordService.validatePasswordStrength(password);

      // then
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must be at least 8 characters long");
    });

    it("should reject password that is too long", () => {
      // given
      const password = "A".repeat(129) + "1!";

      // when
      const result = passwordService.validatePasswordStrength(password);

      // then
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must be less than 128 characters long");
    });

    it("should reject password without lowercase letter", () => {
      // given
      const password = "PASSWORD123!";

      // when
      const result = passwordService.validatePasswordStrength(password);

      // then
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one lowercase letter");
    });

    it("should reject password without uppercase letter", () => {
      // given
      const password = "password123!";

      // when
      const result = passwordService.validatePasswordStrength(password);

      // then
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one uppercase letter");
    });

    it("should reject password without number", () => {
      // given
      const password = "Password!";

      // when
      const result = passwordService.validatePasswordStrength(password);

      // then
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one number");
    });

    it("should reject password without special character", () => {
      // given
      const password = "Password123";

      // when
      const result = passwordService.validatePasswordStrength(password);

      // then
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password must contain at least one special character");
    });

    it("should reject null password", () => {
      // given
      const password = null;

      // when
      const result = passwordService.validatePasswordStrength(password);

      // then
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password is required");
    });

    it("should reject undefined password", () => {
      // given
      const password = undefined;

      // when
      const result = passwordService.validatePasswordStrength(password);

      // then
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password is required");
    });

    it("should reject non-string password", () => {
      // given
      const password = 12345678;

      // when
      const result = passwordService.validatePasswordStrength(password);

      // then
      expect(result.isValid).toBe(false);
      expect(result.errors).toContain("Password is required");
    });

    it("should return multiple errors for weak password", () => {
      // given
      const password = "weak";

      // when
      const result = passwordService.validatePasswordStrength(password);

      // then
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(1);
      expect(result.errors).toContain("Password must be at least 8 characters long");
      expect(result.errors).toContain("Password must contain at least one uppercase letter");
      expect(result.errors).toContain("Password must contain at least one number");
      expect(result.errors).toContain("Password must contain at least one special character");
    });
  });

  describe("generateRandomToken", () => {
    it("should generate random token with default length", () => {
      // when
      const token = passwordService.generateRandomToken();

      // then
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBe(32);
    });

    it("should generate random token with custom length", () => {
      // given
      const length = 16;

      // when
      const token = passwordService.generateRandomToken(length);

      // then
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.length).toBe(length);
    });

    it("should generate different tokens", () => {
      // when
      const token1 = passwordService.generateRandomToken();
      const token2 = passwordService.generateRandomToken();

      // then
      expect(token1).not.toBe(token2);
    });

    it("should generate token with valid characters", () => {
      // given
      const validChars = /^[A-Za-z0-9]+$/;

      // when
      const token = passwordService.generateRandomToken();

      // then
      expect(token).toMatch(validChars);
    });
  });
});
