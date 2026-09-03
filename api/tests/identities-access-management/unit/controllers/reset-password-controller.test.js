import { beforeEach, describe, expect, it, vi } from "vitest";

import { resetPasswordController } from "../../../../src/identities-access-management/controllers/reset-password-controller.js";

describe("Unit | Identities Access Management | Controller | Reset password controller", () => {
  let resetUsecase, res, next;

  beforeEach(() => {
    resetUsecase = vi.fn();
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
        token: "token123",
        password: "newPassword123",
      },
    };
    const expectedResult = { message: "Password reset successful." };
    resetUsecase.mockResolvedValue(expectedResult);

    // when
    await resetPasswordController(req, res, next, resetUsecase);

    // then
    expect(resetUsecase).toHaveBeenCalledWith({ token: "token123", password: "newPassword123" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: expectedResult });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error when usecase throws", async () => {
    // given
    const req = {
      body: {
        token: "token123",
        password: "newPassword123",
      },
    };
    const error = new Error("Invalid token");
    resetUsecase.mockRejectedValue(error);

    // when
    await resetPasswordController(req, res, next, resetUsecase);

    // then
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
