import { beforeEach, describe, expect, it, vi } from "vitest";

import { getUserProfileController } from "../../../../src/identities-access-management/controllers/get-user-profile-controller.js";
import ERRORS from "../../../../src/identities-access-management/errors.js";

describe("Unit | Identities Access Management | Controller | Get user profile controller", () => {
  let res, findUserProfileByIdRepository, next;

  beforeEach(() => {
    findUserProfileByIdRepository = vi.fn();
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  it("should return 200 with authenticated profile", async () => {
    // given
    const req = {
      auth: {
        userId: 42,
      },
    };
    findUserProfileByIdRepository.mockResolvedValue({
      id: 42,
      firstname: "Jane",
      lastname: "Doe",
      email: "jane.doe@example.com",
      birthday: "1990-05-15",
      genre: "nb",
      role: "ttt",
      disabilities: ["a", "b"],
    });

    // when
    await getUserProfileController(req, res, next, findUserProfileByIdRepository);

    // then
    expect(findUserProfileByIdRepository).toHaveBeenCalledWith(42);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      data: {
        userId: 42,
        firstname: "Jane",
        lastname: "Doe",
        email: "jane.doe@example.com",
        birthday: "1990-05-15",
        genre: "nb",
        role: "ttt",
        disabilities: ["a", "b"],
      },
    });
  });

  it("should return 401 when authenticated user is not found", async () => {
    // given
    const req = {
      auth: {
        userId: 42,
      },
    };
    findUserProfileByIdRepository.mockResolvedValue(null);

    // when
    await getUserProfileController(req, res, next, findUserProfileByIdRepository);

    // then
    expect(findUserProfileByIdRepository).toHaveBeenCalledWith(42);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: "User not found" });
  });

  it("should return 500 when req.auth is missing", async () => {
    // given
    const req = {};

    // when
    await getUserProfileController(req, res, next, findUserProfileByIdRepository);

    // then
    expect(findUserProfileByIdRepository).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: ERRORS.INTERNAL_SERVER_ERROR });
  });

  it("should return 500 when the repository fails", async () => {
    // given
    const req = {
      auth: {
        userId: 42,
      },
    };
    findUserProfileByIdRepository.mockRejectedValue(new Error("Database down"));

    // when
    await getUserProfileController(req, res, next, findUserProfileByIdRepository);

    // then
    expect(findUserProfileByIdRepository).toHaveBeenCalledWith(42);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: ERRORS.INTERNAL_SERVER_ERROR });
  });
});
