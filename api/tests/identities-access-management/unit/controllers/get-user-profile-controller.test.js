import { beforeEach, describe, expect, it, vi } from "vitest";

import { getUserProfileController } from "../../../../src/identities-access-management/controllers/get-user-profile-controller.js";

describe("Unit | Identities Access Management | Controller | Get user profile controller", () => {
  let res, getUserDataUsecase, next;

  beforeEach(() => {
    getUserDataUsecase = vi.fn();
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  it("should return 200 with authenticated profile", async () => {
    // given
    const req = {
      auth: {
        userId: 42,
      },
    };
    const userData = {
      userId: 42,
      firstname: "Jane",
      lastname: "Doe",
      email: "jane.doe@example.com",
      birthday: "1990-05-15",
      genre: "nb",
      role: "ttt",
      disabilities: ["a", "b"],
    };
    getUserDataUsecase.mockResolvedValue(userData);

    // when
    await getUserProfileController(req, res, next, getUserDataUsecase);

    // then
    expect(getUserDataUsecase).toHaveBeenCalledWith(42);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: userData,
    });
  });

  it("should call next when an error occurred", async () => {
    // given
    getUserDataUsecase.mockRejectedValue(new Error("error"));
    const req = { auth: { userId: 42 } };

    // when
    await getUserProfileController(req, res, next, getUserDataUsecase);

    // then
    expect(getUserDataUsecase).toHaveBeenCalledWith(42);
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new Error("error"));
  });
});
