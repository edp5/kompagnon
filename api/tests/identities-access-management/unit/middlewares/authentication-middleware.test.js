import { beforeEach, describe, expect, it, vi } from "vitest";
import { authenticationMiddleware } from "../../../../src/identities-access-management/middlewares/authentication-middleware.js";
import ERRORS from "../../../../src/identities-access-management/errors.js";

describe("Unit | Identities Access Management | Middleware | Authentication middleware", () => {
  let decodedTokenService, findUserRepository, res, next;

  beforeEach(() => {
    decodedTokenService = vi.fn();
    findUserRepository = vi.fn();
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  it("should call next and attach user info to req.auth if token is valid", async () => {
    // given
    const req = {
      headers: {
        authorisation: "valid-token",
      },
    };
    const decodedPayload = { userId: 123 };
    const user = { id: 123, firstname: "John", lastname: "Doe" };

    decodedTokenService.mockReturnValue(decodedPayload);
    findUserRepository.mockResolvedValue(user);

    // when
    await authenticationMiddleware(
      req,
      res,
      next,
      decodedTokenService,
      findUserRepository,
    );

    // then
    expect(decodedTokenService).toHaveBeenCalledWith("valid-token");
    expect(findUserRepository).toHaveBeenCalledWith(123);
    expect(req.auth).toEqual({
      firstName: "John",
      lastName: "Doe",
      userId: 123,
    });
    expect(next).toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 401 if token is missing", async () => {
    // given
    const req = {
      headers: {},
    };

    // when
    await authenticationMiddleware(
      req,
      res,
      next,
      decodedTokenService,
      findUserRepository,
    );

    // then
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: ERRORS.TOKEN.REQUIRED });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if token decoding fails", async () => {
    // given
    const req = {
      headers: {
        authorisation: "invalid-token",
      },
    };
    decodedTokenService.mockImplementation(() => {
      throw new Error(ERRORS.TOKEN.INVALID_TOKEN);
    });

    // when
    await authenticationMiddleware(
      req,
      res,
      next,
      decodedTokenService,
      findUserRepository,
    );

    // then
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: ERRORS.TOKEN.INVALID_TOKEN,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 if user is not found in database", async () => {
    // given
    const req = {
      headers: {
        authorisation: "valid-token",
      },
    };
    decodedTokenService.mockReturnValue({ userId: 123 });
    findUserRepository.mockResolvedValue(null);

    // when
    await authenticationMiddleware(
      req,
      res,
      next,
      decodedTokenService,
      findUserRepository,
    );

    // then
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: ERRORS.TOKEN.INVALID_TOKEN,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 and log error if an unexpected error occurs", async () => {
    // given
    const req = {
      headers: {
        authorisation: "valid-token",
      },
    };
    decodedTokenService.mockReturnValue({ userId: 123 });
    findUserRepository.mockRejectedValue(new Error("Database error"));

    // when
    await authenticationMiddleware(
      req,
      res,
      next,
      decodedTokenService,
      findUserRepository,
    );

    // then
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({
      message: ERRORS.INTERNAL_SERVER_ERROR,
    });
    expect(next).not.toHaveBeenCalled();
  });
});
