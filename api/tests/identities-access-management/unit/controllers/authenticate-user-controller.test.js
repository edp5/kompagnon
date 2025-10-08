import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  authenticateUserController,
} from "../../../../src/identities-access-management/controllers/authenticate-user-controller.js";
import ERRORS from "../../../../src/identities-access-management/errors.js";

describe("Unit | Identities Access Management | Controller | Authenticate user controller", () => {
  let findUserRepository, checkPasswordService, encodedTokenService, updateLastLoginRepository, res, next;
  beforeEach(() => {
    findUserRepository = vi.fn();
    checkPasswordService = vi.fn();
    encodedTokenService = vi.fn();
    updateLastLoginRepository = vi.fn();
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
      send: vi.fn(),
    };
    next = vi.fn();
  });

  it("should call status with 200 and send a token", async () => {
    // given
    const req = {
      body: {
        email: "john.doe@example.net",
        password: "password123",
      },
    };
    findUserRepository.mockResolvedValue({ id: 123, hashedPassword: "hashedPassword", userType: "user" });
    encodedTokenService.mockReturnValue("token123");
    checkPasswordService.mockResolvedValue(true);

    // when
    await authenticateUserController(
      req, res, next,
      findUserRepository,
      checkPasswordService,
      encodedTokenService,
      updateLastLoginRepository,
    );
    // then
    expect(findUserRepository).toHaveBeenCalledWith("john.doe@example.net");
    expect(checkPasswordService).toHaveBeenCalledWith("password123", "hashedPassword");
    expect(encodedTokenService).toHaveBeenCalledWith({ userId: 123, userType: "user" });
    expect(updateLastLoginRepository).toHaveBeenCalledWith(123);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: { token: "token123", userId: 123 } });
    expect(next).not.toHaveBeenCalled();
  });

  it("should 404 status if user is not active", async () => {
    // given
    const req = {
      body: {
        email: "john.doe@example.net",
        password: "password123",
      },
    };
    findUserRepository.mockResolvedValue({ isActive: false });

    // when
    await authenticateUserController(
      req, res, next,
      findUserRepository,
      checkPasswordService,
      encodedTokenService,
      updateLastLoginRepository,
    );

    // then
    expect(findUserRepository).toHaveBeenCalledWith("john.doe@example.net");
    expect(checkPasswordService).not.toHaveBeenCalled();
    expect(encodedTokenService).not.toHaveBeenCalled();
    expect(updateLastLoginRepository).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  describe(`${ERRORS.AUTHENTICATION.INVALID_CREDENTIALS} error`, () => {
    it("should return 401 if user email not found", async () => {
      // given
      const req = {
        body: {
          email: "john.doe@example.net",
          password: "password123",
        },
      };
      findUserRepository.mockResolvedValue(null);

      // when
      await authenticateUserController(
        req, res, next,
        findUserRepository,
        checkPasswordService,
        encodedTokenService,
        updateLastLoginRepository,
      );

      // then
      expect(findUserRepository).toHaveBeenCalledWith("john.doe@example.net");
      expect(checkPasswordService).not.toHaveBeenCalled();
      expect(encodedTokenService).not.toHaveBeenCalled();
      expect(updateLastLoginRepository).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: ERRORS.AUTHENTICATION.INVALID_CREDENTIALS });
      expect(next).not.toHaveBeenCalled();
    });

    it("should return 401 if password is invalid", async () => {
      // given
      const req = {
        body: {
          email: "john.doe@example.net",
          password: "password123",
        },
      };
      findUserRepository.mockResolvedValue({ id: 123, hashedPassword: "hashedPassword", userType: "user" });
      checkPasswordService.mockResolvedValue(false);

      // when
      await authenticateUserController(
        req, res, next,
        findUserRepository,
        checkPasswordService,
        encodedTokenService,
        updateLastLoginRepository,
      );

      // then
      expect(findUserRepository).toHaveBeenCalledWith("john.doe@example.net");
      expect(checkPasswordService).toHaveBeenCalledWith("password123", "hashedPassword");
      expect(encodedTokenService).not.toHaveBeenCalled();
      expect(updateLastLoginRepository).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: ERRORS.AUTHENTICATION.INVALID_CREDENTIALS });
      expect(next).not.toHaveBeenCalled();
    });
  });

  it("should call next with error", async () => {
    // given
    const req = {
      body: {
        email: "john.doe@example.net",
        password: "password123",
      },
    };
    const error = new Error("Database error");
    findUserRepository.mockRejectedValue(error);

    // when
    await authenticateUserController(
      req, res, next,
      findUserRepository,
      checkPasswordService,
      encodedTokenService,
      updateLastLoginRepository,
    );

    // then
    expect(findUserRepository).toHaveBeenCalledWith("john.doe@example.net");
    expect(checkPasswordService).not.toHaveBeenCalled();
    expect(encodedTokenService).not.toHaveBeenCalled();
    expect(updateLastLoginRepository).not.toHaveBeenCalled();
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
