import { beforeEach, describe, expect, it, vi } from "vitest";

import { logger } from "../../../../../logger.js";
import * as userRepository from "../../../../../src/identities-access-management/repositories/user-repository.js";
import * as tokenService from "../../../../../src/identities-access-management/services/token-service.js";
import { authMiddleware } from "../../../../../src/shared/infrastructure/middlewares/auth-middleware.js";

vi.mock("../../../../../src/identities-access-management/repositories/user-repository.js");
vi.mock("../../../../../src/identities-access-management/services/token-service.js");
vi.mock("../../../../../logger.js", () => ({
  logger: { error: vi.fn(), info: vi.fn() },
}));

describe("Auth Middleware", () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { headers: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it("should return 401 if no authorization header is provided", async () => {
    // given
    // (no setup needed as it's handled in beforeEach)

    // when
    await authMiddleware(req, res, next);

    // then
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Authentication required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if authorization header is missing 'Bearer ' prefix", async () => {
    // given
    req.headers.authorization = "Basic token123";

    // when
    await authMiddleware(req, res, next);

    // then
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Authentication required" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token is missing after 'Bearer '", async () => {
    // given
    req.headers.authorization = "Bearer ";

    // when
    await authMiddleware(req, res, next);

    // then
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token format" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token decoding fails", async () => {
    // given
    req.headers.authorization = "Bearer invalid-token";
    tokenService.decodedToken.mockImplementation(() => {
      throw new Error("Expired token");
    });

    // when
    await authMiddleware(req, res, next);

    // then
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Expired token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if decoded payload has no userId", async () => {
    // given
    req.headers.authorization = "Bearer valid-token";
    tokenService.decodedToken.mockReturnValue({ someOtherData: "xyz" });

    // when
    await authMiddleware(req, res, next);

    // then
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid token payload" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if user is not found in database", async () => {
    // given
    req.headers.authorization = "Bearer valid-token";
    tokenService.decodedToken.mockReturnValue({ userId: 1 });
    userRepository.findUserById.mockResolvedValue(null);

    // when
    await authMiddleware(req, res, next);

    // then
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if user account is inactive", async () => {
    // given
    req.headers.authorization = "Bearer valid-token";
    tokenService.decodedToken.mockReturnValue({ userId: 1 });
    userRepository.findUserById.mockResolvedValue({ id: 1, isActive: false });

    // when
    await authMiddleware(req, res, next);

    // then
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User account is inactive" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next() and populate req.auth on success", async () => {
    // given
    req.headers.authorization = "Bearer valid-token";
    tokenService.decodedToken.mockReturnValue({ userId: 1 });

    const mockUser = {
      id: 1,
      firstname: "John",
      lastname: "Doe",
      email: "john@example.com",
      userType: "user",
      isActive: true,
    };
    userRepository.findUserById.mockResolvedValue(mockUser);

    // when
    await authMiddleware(req, res, next);

    // then
    expect(req.auth).toBeDefined();
    expect(req.auth.userId).toBe(1);
    expect(req.auth.firstname).toBe("John");
    expect(next).toHaveBeenCalledTimes(1);
  });

  it("should catch unexpected errors and return 500", async () => {
    // given
    req.headers.authorization = "Bearer valid-token";
    tokenService.decodedToken.mockReturnValue({ userId: 1 });
    userRepository.findUserById.mockRejectedValue(new Error("Database error"));

    // when
    await authMiddleware(req, res, next);

    // then
    expect(logger.error).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error during authentication" });
    expect(next).not.toHaveBeenCalled();
  });
});
