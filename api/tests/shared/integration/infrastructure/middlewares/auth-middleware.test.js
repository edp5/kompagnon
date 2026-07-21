import { beforeEach, describe, expect, it, vi } from "vitest";

import databaseBuilder from "../../../../../db/database-builder/index.js";
import { UserNotFoundError } from "../../../../../src/identities-access-management/errors.js";
import { encodedToken } from "../../../../../src/identities-access-management/services/token-service.js";
import {
  AuthenticationRequiredError,
  InvalidTokenFormatError,
  InvalidTokenPayloadError,
} from "../../../../../src/shared/errors.js";
import { authMiddleware } from "../../../../../src/shared/infrastructure/middlewares/auth-middleware.js";

describe("Integration | Shared | Infrastructure | Middlewares | Auth Middleware", () => {
  let res, next;
  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnValue(),
    };
    next = vi.fn();
  });

  describe("when no authorization header is provided", () => {
    it("should throw authentication required error", async () => {
      // given
      const req = { headers: {} };
      // when
      await authMiddleware(req, res, next);

      // then
      expect(next).toHaveBeenCalledWith(new AuthenticationRequiredError());
    });
  });

  describe("when authorization header is missing 'Bearer ' prefix", () => {
    it("should throw authentication required error", async () => {
      // given
      const req = { headers: { authorization: "Basic tooken123" } };

      // when
      await authMiddleware(req, res, next);

      // then
      expect(next).toHaveBeenCalledWith(new AuthenticationRequiredError());
    });
  });

  describe("when token is missing after 'Bearer '", () => {
    it("should throw an invalid token format error", async () => {
      // given
      const req = { headers: { authorization: "Bearer " } };

      // when
      await authMiddleware(req, res, next);

      // then
      expect(next).toHaveBeenCalledWith(new InvalidTokenFormatError());
    });
  });

  describe("when token is invalid or expired", () => {
    it("should call next by jsonwebtoken", async () => {
      // given
      const req = { headers: { authorization: "Bearer invalid-token" } };

      // when
      await authMiddleware(req, res, next);

      // then
      expect(next).toHaveBeenCalled();
    });
  });

  describe("when token does not contain a userId", () => {
    it("should throw Invalid token payload error", async () => {
      // given
      const token = encodedToken({ someOtherData: "xyz" });
      const req = { headers: { authorization: `Bearer ${token}` } };

      // when
      await authMiddleware(req, res, next);

      // then
      expect(next).toHaveBeenCalledWith(new InvalidTokenPayloadError());
    });
  });

  describe("when user referenced in token does not exist in database", () => {
    it("should throw a user not found error", async () => {
      // given
      const token = encodedToken({ userId: 99999 });
      const req = { headers: { authorization: `Bearer ${token}` } };

      // when
      await authMiddleware(req, res, next);

      // then
      expect(next).toHaveBeenCalledWith(new UserNotFoundError());
    });
  });

  describe("when user account is inactive", () => {
    it("should throw a user not found error", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ isActive: false });
      const token = encodedToken({ userId: user.id });
      const req = { headers: { authorization: `Bearer ${token}` } };

      // when
      await authMiddleware(req, res, next);

      // then
      expect(next).toHaveBeenCalledWith(new UserNotFoundError());
    });
  });

  describe("when token and user are valid", () => {
    it("should call next() and populate req.auth", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        isActive: true,
      });
      const token = encodedToken({ userId: user.id });
      const req = { headers: { authorization: `Bearer ${token}` } };

      // when
      await authMiddleware(req, res, next);

      // then
      expect(next).toHaveBeenCalledTimes(1);
      expect(req.auth).toBeDefined();
      expect(req.auth.userId).toBe(user.id);
      expect(req.auth.userType).toBe(user.userType);
    });
  });
});
