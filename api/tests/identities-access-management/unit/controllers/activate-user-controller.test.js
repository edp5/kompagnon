import { beforeEach, describe, expect, it, vi } from "vitest";

import { activateUserController } from "../../../../src/identities-access-management/controllers/activate-user-controller.js";

describe("Unit | Identities Access Management | Controller | Activate User", () => {
  let findUserByIdRepository, activateUserByIdRepository, decodedTokenService, req, res, next;

  beforeEach(() => {
    findUserByIdRepository = vi.fn();
    activateUserByIdRepository = vi.fn();
    decodedTokenService = vi.fn();
    req = {
      query: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnValue(),
    };
    next = vi.fn();
  });

  describe("success cases", () => {
    it("should activate user and return 201 when token is valid and user is inactive", async () => {
      // given
      req.query.token = "valid-token";
      const decodedData = { userId: 123 };
      const user = { id: 123, isActive: false };

      decodedTokenService.mockReturnValue(decodedData);
      findUserByIdRepository.mockResolvedValue(user);
      activateUserByIdRepository.mockResolvedValue();

      // when
      await activateUserController(req, res, next, findUserByIdRepository, activateUserByIdRepository, decodedTokenService);

      // then
      expect(decodedTokenService).toHaveBeenCalledWith("valid-token");
      expect(findUserByIdRepository).toHaveBeenCalledWith(123);
      expect(activateUserByIdRepository).toHaveBeenCalledWith(123);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "User activated successfully" });
    });
  });

  describe("error cases", () => {
    it("should return 400 when token is missing", async () => {
      // given
      req.query.token = undefined;

      // when
      await activateUserController(req, res, next, findUserByIdRepository, activateUserByIdRepository, decodedTokenService);

      // then
      expect(decodedTokenService).not.toHaveBeenCalled();
      expect(findUserByIdRepository).not.toHaveBeenCalled();
      expect(activateUserByIdRepository).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Token is required" });
    });

    it("should return 401 when user does not exist", async () => {
      // given
      req.query.token = "valid-token";
      const decodedData = { userId: 999 };

      decodedTokenService.mockReturnValue(decodedData);
      findUserByIdRepository.mockResolvedValue(null);

      // when
      await activateUserController(req, res, next, findUserByIdRepository, activateUserByIdRepository, decodedTokenService);

      // then
      expect(decodedTokenService).toHaveBeenCalledWith("valid-token");
      expect(findUserByIdRepository).toHaveBeenCalledWith(999);
      expect(activateUserByIdRepository).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found or already active" });
    });

    it("should return 401 when user is already active", async () => {
      // given
      req.query.token = "valid-token";
      const decodedData = { userId: 123 };
      const user = { id: 123, isActive: true };

      decodedTokenService.mockReturnValue(decodedData);
      findUserByIdRepository.mockResolvedValue(user);

      // when
      await activateUserController(req, res, next, findUserByIdRepository, activateUserByIdRepository, decodedTokenService);

      // then
      expect(decodedTokenService).toHaveBeenCalledWith("valid-token");
      expect(findUserByIdRepository).toHaveBeenCalledWith(123);
      expect(activateUserByIdRepository).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found or already active" });
    });

    it("should return 500 when an unexpected error occurs", async () => {
      // given
      req.query.token = "valid-token";
      const decodedData = { userId: 123 };

      decodedTokenService.mockReturnValue(decodedData);
      findUserByIdRepository.mockRejectedValue(new Error("Database connection failed"));

      // when
      await activateUserController(req, res, next, findUserByIdRepository, activateUserByIdRepository, decodedTokenService);

      // then
      expect(decodedTokenService).toHaveBeenCalledWith("valid-token");
      expect(findUserByIdRepository).toHaveBeenCalledWith(123);
      expect(activateUserByIdRepository).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
  });
});

