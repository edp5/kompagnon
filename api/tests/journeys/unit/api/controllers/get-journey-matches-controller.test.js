import { beforeEach, describe, expect, it, vi } from "vitest";

import { getJourneyMatchesController } from "../../../../../src/journeys/api/controllers/get-journey-matches-controller.js";
import { JourneyNotFound, UserHasNoRole } from "../../../../../src/journeys/errors.js";
import { USER_ROLE } from "../../../../../src/shared/constants.js";

describe("Unit | Journey | Api | Controller | Get journey matches controller", () => {
  let res, next, getPassengerMatches, getCompanionMatches, findUserRepository;
  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    getPassengerMatches = vi.fn();
    getCompanionMatches = vi.fn();
    findUserRepository = vi.fn();
    next = vi.fn();
  });

  it("should return the passenger matches for an invalid user", async () => {
    // given
    const req = { auth: { userId: 1 }, params: { journeyId: "5" } };
    findUserRepository.mockResolvedValue({ id: 1, role: USER_ROLE.INVALID });
    getPassengerMatches.mockResolvedValue([{ foundJourneyId: 3 }]);

    // when
    await getJourneyMatchesController(req, res, next, getPassengerMatches, getCompanionMatches, findUserRepository);

    // then
    expect(getPassengerMatches).toHaveBeenCalledWith({ journeyId: 5, userId: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [{ foundJourneyId: 3 }] });
  });

  it("should return the companion matches for a valid user", async () => {
    // given
    const req = { auth: { userId: 1 }, params: { journeyId: "5" } };
    findUserRepository.mockResolvedValue({ id: 1, role: USER_ROLE.VALID });
    getCompanionMatches.mockResolvedValue([]);

    // when
    await getJourneyMatchesController(req, res, next, getPassengerMatches, getCompanionMatches, findUserRepository);

    // then
    expect(getCompanionMatches).toHaveBeenCalledWith({ journeyId: 5, userId: 1 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [] });
  });

  it("should forward JourneyNotFound when the journey is not the user's", async () => {
    // given
    const req = { auth: { userId: 1 }, params: { journeyId: "5" } };
    findUserRepository.mockResolvedValue({ id: 1, role: USER_ROLE.INVALID });
    getPassengerMatches.mockResolvedValue(null);

    // when
    await getJourneyMatchesController(req, res, next, getPassengerMatches, getCompanionMatches, findUserRepository);

    // then
    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new JourneyNotFound());
  });

  it("should forward UserHasNoRole when the user has no role", async () => {
    // given
    const req = { auth: { userId: 1 }, params: { journeyId: "5" } };
    findUserRepository.mockResolvedValue({ id: 1 });

    // when
    await getJourneyMatchesController(req, res, next, getPassengerMatches, getCompanionMatches, findUserRepository);

    // then
    expect(getPassengerMatches).not.toHaveBeenCalled();
    expect(getCompanionMatches).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(new UserHasNoRole());
  });

  it("should forward unexpected errors to next", async () => {
    // given
    const req = { auth: { userId: 1 }, params: { journeyId: "5" } };
    const thrownError = new Error("boom");
    findUserRepository.mockRejectedValue(thrownError);

    // when
    await getJourneyMatchesController(req, res, next, getPassengerMatches, getCompanionMatches, findUserRepository);

    // then
    expect(next).toHaveBeenCalledWith(thrownError);
  });
});
