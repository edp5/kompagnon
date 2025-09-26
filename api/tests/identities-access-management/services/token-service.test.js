import { beforeEach, describe, expect, it, vi } from "vitest";

import tokenService from "../../../src/identities-access-management/services/token-service.js";

vi.mock("../../../config.js", () => ({
  config: {
    jwt: {
      tokenSecret: "test-secret-key",
      expirationTime: "1h",
    },
  },
}));

describe("TokenService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("encodedToken", () => {
    it("should encode data into a JWT token", async () => {
      const testData = { userId: 123, email: "test@example.com" };

      const token = await tokenService.encodedToken(testData);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3);
    });

    it("should encode different data types", async () => {
      const testData = {
        string: "test",
        number: 42,
        boolean: true,
        object: { nested: "value" },
      };

      const token = await tokenService.encodedToken(testData);

      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
    });

    it("should throw error when secret is not configured", async () => {
      const originalSecret = tokenService.secret;
      tokenService.secret = null;

      await expect(tokenService.encodedToken({ test: "data" }))
        .rejects.toThrow("JWT secret is not configured");

      tokenService.secret = originalSecret;
    });
  });

  describe("decodedToken", () => {
    it("should decode a valid JWT token", async () => {
      const testData = { userId: 123, email: "test@example.com" };
      const token = await tokenService.encodedToken(testData);

      const decoded = tokenService.decodedToken(token);

      expect(decoded).toMatchObject(testData);
      expect(decoded.iat).toBeDefined();
      expect(decoded.exp).toBeDefined();
    });

    it("should throw error for invalid token", () => {
      const invalidToken = "invalid.token.here";

      expect(() => tokenService.decodedToken(invalidToken))
        .toThrow("Invalid token");
    });

    it("should throw error for expired token", async () => {
      const originalExpirationTime = tokenService.expirationTime;
      tokenService.expirationTime = "1ms";

      const testData = { userId: 123 };
      const token = await tokenService.encodedToken(testData);

      await new Promise(resolve => setTimeout(resolve, 10));

      expect(() => tokenService.decodedToken(token))
        .toThrow("Token has expired");

      tokenService.expirationTime = originalExpirationTime;
    });

    it("should throw error when secret is not configured", () => {
      const originalSecret = tokenService.secret;
      tokenService.secret = null;

      expect(() => tokenService.decodedToken("any.token.here"))
        .toThrow("JWT secret is not configured");

      tokenService.secret = originalSecret;
    });
  });

  describe("integration", () => {
    it("should encode and decode data correctly", async () => {
      const originalData = {
        userId: 456,
        email: "integration@test.com",
        role: "admin",
        permissions: ["read", "write"],
      };

      const token = await tokenService.encodedToken(originalData);
      const decodedData = tokenService.decodedToken(token);

      expect(decodedData.userId).toBe(originalData.userId);
      expect(decodedData.email).toBe(originalData.email);
      expect(decodedData.role).toBe(originalData.role);
      expect(decodedData.permissions).toEqual(originalData.permissions);
    });
  });
});
