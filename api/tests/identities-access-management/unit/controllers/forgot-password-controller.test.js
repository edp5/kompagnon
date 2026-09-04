import { beforeEach, describe, expect, it, vi } from "vitest";

import { forgotPasswordController } from "../../../../src/identities-access-management/controllers/forgot-password-controller.js";

describe("Unit | Identities Access Management | Controller | Forgot password controller", () => {
  let requestResetUsecase, res, next;

  beforeEach(() => {
    requestResetUsecase = vi.fn();
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  it("should call status 200 and return result on success", async () => {
    // given
    const req = {
      body: {
        email: "user@example.com",
      },
    };
    const expectedResult = { message: "If your email address is registered, you will receive a password reset link." };
    requestResetUsecase.mockResolvedValue(expectedResult);

    // when
    await forgotPasswordController(req, res, next, requestResetUsecase);

    // then
    expect(requestResetUsecase).toHaveBeenCalledWith({ email: "user@example.com" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: expectedResult });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error when usecase throws", async () => {
    // given
    const req = {
      body: {
        email: "user@example.com",
      },
    };
    const error = new Error("Database error");
    requestResetUsecase.mockRejectedValue(error);

    // when
    await forgotPasswordController(req, res, next, requestResetUsecase);

    // then
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
