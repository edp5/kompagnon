import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  authenticateUserController,
} from "../../../../src/identities-access-management/controllers/authenticate-user-controller.js";

describe("Unit | Identities Access Management | Controller | Authenticate user controller", () => {
  let authenticateUsecase, res, next;
  beforeEach(() => {
    authenticateUsecase = vi.fn();
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  it("should call status with 200 and send data", async () => {
    // given
    const req = {
      body: {
        email: "john.doe@example.net",
        password: "password123",
      },
    };
    authenticateUsecase.mockResolvedValue({ userId: 123, token: "token" });

    // when
    await authenticateUserController(
      req, res, next,
      authenticateUsecase,
    );
    // then
    expect(authenticateUsecase).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: { token: "token", userId: 123 } });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error", async () => {
    // given
    const req = {
      body: {
        email: "john.doe@example.net",
        password: "password123",
      },
    };
    authenticateUsecase.mockRejectedValue(new Error("error"));

    // when
    await authenticateUserController(
      req, res, next,
      authenticateUsecase,
    );

    // then
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error("error"));
  });
});
