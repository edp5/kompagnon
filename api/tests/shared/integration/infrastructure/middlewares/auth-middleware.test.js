import { describe, expect, it, vi } from "vitest";

import databaseBuilder from "../../../../../db/database-builder/index.js";
import { encodedToken } from "../../../../../src/identities-access-management/services/token-service.js";
import { authMiddleware } from "../../../../../src/shared/infrastructure/middlewares/auth-middleware.js";

function buildReqRes() {
  const req = { headers: {} };
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  };
  const next = vi.fn();
  return { req, res, next };
}

describe("Integration | Shared | Infrastructure | Middlewares | Auth Middleware", () => {
  describe("when no authorization header is provided", () => {
    it("should return 401", async () => {
      // given
      const { req, res, next } = buildReqRes();

      // when
      await authMiddleware(req, res, next);

      // then
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Authentication required" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("when authorization header is missing 'Bearer ' prefix", () => {
    it("should return 401", async () => {
      // given
      const { req, res, next } = buildReqRes();
      req.headers.authorization = "Basic token123";

      // when
      await authMiddleware(req, res, next);

      // then
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Authentication required" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("when token is missing after 'Bearer '", () => {
    it("should return 401", async () => {
      // given
      const { req, res, next } = buildReqRes();
      req.headers.authorization = "Bearer ";

      // when
      await authMiddleware(req, res, next);

      // then
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid token format" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("when token is invalid or expired", () => {
    it("should return 401", async () => {
      // given
      const { req, res, next } = buildReqRes();
      req.headers.authorization = "Bearer invalid-token";

      // when
      await authMiddleware(req, res, next);

      // then
      expect(res.status).toHaveBeenCalledWith(401);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("when token does not contain a userId", () => {
    it("should return 401", async () => {
      // given
      const { req, res, next } = buildReqRes();
      const token = encodedToken({ someOtherData: "xyz" });
      req.headers.authorization = `Bearer ${token}`;

      // when
      await authMiddleware(req, res, next);

      // then
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid token payload" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("when user referenced in token does not exist in database", () => {
    it("should return 401", async () => {
      // given
      const { req, res, next } = buildReqRes();
      const token = encodedToken({ userId: 99999 });
      req.headers.authorization = `Bearer ${token}`;

      // when
      await authMiddleware(req, res, next);

      // then
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("when user account is inactive", () => {
    it("should return 401", async () => {
      // given
      const { req, res, next } = buildReqRes();
      const user = await databaseBuilder.factory.buildUser({ isActive: false });
      const token = encodedToken({ userId: user.id });
      req.headers.authorization = `Bearer ${token}`;

      // when
      await authMiddleware(req, res, next);

      // then
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "User account is inactive" });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("when token and user are valid", () => {
    it("should call next() and populate req.auth", async () => {
      // given
      const { req, res, next } = buildReqRes();
      const user = await databaseBuilder.factory.buildUser({
        firstname: "John",
        lastname: "Doe",
        email: "john@example.com",
        isActive: true,
      });
      const token = encodedToken({ userId: user.id });
      req.headers.authorization = `Bearer ${token}`;

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
