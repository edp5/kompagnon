import { beforeEach, describe, expect, it, vi } from "vitest";

import { activateUserController } from "../../../../src/identities-access-management/controllers/activate-user-controller.js";

describe("Unit | Identities Access Management | Controller | Activate User", () => {
  let activateUserUsecase, decodedTokenService, req, res, next;

  beforeEach(() => {
    activateUserUsecase = vi.fn();
    decodedTokenService = vi.fn();
    req = {
      headers: {},
      body: {},
    };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnValue(),
      send: vi.fn(),
    };
    next = vi.fn();
  });

  describe("success cases", () => {
    it("should activate user and return 201 when token is valid and user is inactive", async () => {
      // given
      req.headers.authorization = "Bearer valid-token";
      req.body.phoneNumber = "phonenumber";
      req.body.role = "companion";
      const decodedData = { userId: 123 };

      decodedTokenService.mockReturnValue(decodedData);

      // when
      await activateUserController(req, res, next, activateUserUsecase, decodedTokenService);

      // then
      expect(decodedTokenService).toHaveBeenCalledWith("valid-token");
      expect(activateUserUsecase).toHaveBeenCalledWith({ userId: 123, phoneNumber: "phonenumber", role: "companion" });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalled();
    });
  });

  describe("error cases", () => {
    it("should return an error if usecase failed", async () => {
      // given
      req.headers.authorization = "Bearer valid-token";
      req.body.phoneNumber = "test";
      req.body.role = "passenger";
      const decodedData = { userId: 999 };

      decodedTokenService.mockReturnValue(decodedData);
      activateUserUsecase.mockRejectedValue("some error");

      // when
      await activateUserController(req, res, next, activateUserUsecase, decodedTokenService);

      // then
      expect(decodedTokenService).toHaveBeenCalledWith("valid-token");
      expect(activateUserUsecase).toHaveBeenCalledWith({ userId: 999, phoneNumber: "test", role: "passenger" });
      expect(next).toHaveBeenCalledWith("some error");
    });
  });
});
