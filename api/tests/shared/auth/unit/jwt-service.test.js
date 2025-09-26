import { describe, expect, it, vi } from "vitest";

import jwtService from "../../../../src/shared/auth/jwt-service.js";

vi.mock("../../../../config.js", () => ({
  config: {
    jwt: {
      tokenSecret: "test-secret-key",
      expirationTime: "1h",
    },
  },
}));

describe("Unit | Shared | Auth | JWT Service", () => {
  describe("generateToken", () => {
    it("should generate a valid JWT token", () => {
      // given
      const payload = {
        userId: 1,
        email: "test@example.com",
        userType: "accompanying",
      };

      // when
      const token = jwtService.generateToken(payload);

      // then
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");
      expect(token.split(".")).toHaveLength(3); // JWT has 3 parts
    });

    it("should generate token with custom expiration", () => {
      // given
      const payload = {
        userId: 1,
        email: "test@example.com",
      };
      const customExpiration = "2h";

      // when
      const token = jwtService.generateToken(payload, customExpiration);

      // then
      expect(token).toBeDefined();
      const decoded = jwtService.decodeToken(token);
      expect(decoded.exp).toBeDefined();
    });

  });

  describe("generateEmailVerificationToken", () => {
    it("should generate email verification token", () => {
      // given
      const userId = 1;
      const email = "test@example.com";

      // when
      const token = jwtService.generateEmailVerificationToken(userId, email);

      // then
      expect(token).toBeDefined();
      const decoded = jwtService.decodeToken(token);
      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
      expect(decoded.type).toBe("email_verification");
    });
  });

  describe("generatePasswordResetToken", () => {
    it("should generate password reset token", () => {
      // given
      const userId = 1;
      const email = "test@example.com";

      // when
      const token = jwtService.generatePasswordResetToken(userId, email);

      // then
      expect(token).toBeDefined();
      const decoded = jwtService.decodeToken(token);
      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
      expect(decoded.type).toBe("password_reset");
    });
  });

  describe("verifyToken", () => {
    it("should verify valid token", () => {
      // given
      const payload = {
        userId: 1,
        email: "test@example.com",
        userType: "accompanying",
      };
      const token = jwtService.generateToken(payload);

      // when
      const decoded = jwtService.verifyToken(token);

      // then
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.userType).toBe(payload.userType);
    });

    it("should throw error for invalid token", () => {
      // given
      const invalidToken = "invalid.token.here";

      // when & then
      expect(() => jwtService.verifyToken(invalidToken)).toThrow("Invalid token");
    });

  });

  describe("verifyEmailVerificationToken", () => {
    it("should verify valid email verification token", () => {
      // given
      const userId = 1;
      const email = "test@example.com";
      const token = jwtService.generateEmailVerificationToken(userId, email);

      // when
      const decoded = jwtService.verifyEmailVerificationToken(token);

      // then
      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
      expect(decoded.type).toBe("email_verification");
    });

    it("should throw error for wrong token type", () => {
      // given
      const payload = {
        userId: 1,
        email: "test@example.com",
        type: "wrong_type",
      };
      const token = jwtService.generateToken(payload);

      // when & then
      expect(() => jwtService.verifyEmailVerificationToken(token)).toThrow("Invalid token type for email verification");
    });
  });

  describe("verifyPasswordResetToken", () => {
    it("should verify valid password reset token", () => {
      // given
      const userId = 1;
      const email = "test@example.com";
      const token = jwtService.generatePasswordResetToken(userId, email);

      // when
      const decoded = jwtService.verifyPasswordResetToken(token);

      // then
      expect(decoded.userId).toBe(userId);
      expect(decoded.email).toBe(email);
      expect(decoded.type).toBe("password_reset");
    });

    it("should throw error for wrong token type", () => {
      // given
      const payload = {
        userId: 1,
        email: "test@example.com",
        type: "wrong_type",
      };
      const token = jwtService.generateToken(payload);

      // when & then
      expect(() => jwtService.verifyPasswordResetToken(token)).toThrow("Invalid token type for password reset");
    });
  });

  describe("extractTokenFromHeader", () => {
    it("should extract token from valid Bearer header", () => {
      // given
      const authHeader = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

      // when
      const token = jwtService.extractTokenFromHeader(authHeader);

      // then
      expect(token).toBe("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...");
    });

    it("should return null for invalid header format", () => {
      // given
      const authHeader = "Basic dXNlcjpwYXNz";

      // when
      const token = jwtService.extractTokenFromHeader(authHeader);

      // then
      expect(token).toBeNull();
    });

    it("should return null for null header", () => {
      // given
      const authHeader = null;

      // when
      const token = jwtService.extractTokenFromHeader(authHeader);

      // then
      expect(token).toBeNull();
    });

    it("should return null for undefined header", () => {
      // given
      const authHeader = undefined;

      // when
      const token = jwtService.extractTokenFromHeader(authHeader);

      // then
      expect(token).toBeNull();
    });
  });

  describe("decodeToken", () => {
    it("should decode token without verification", () => {
      // given
      const payload = {
        userId: 1,
        email: "test@example.com",
        userType: "accompanying",
      };
      const token = jwtService.generateToken(payload);

      // when
      const decoded = jwtService.decodeToken(token);

      // then
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.userType).toBe(payload.userType);
    });
  });
});
