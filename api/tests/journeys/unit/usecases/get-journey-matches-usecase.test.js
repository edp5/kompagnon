import { beforeEach, describe, expect, it, vi } from "vitest";

import { JourneyNotFound, UserHasNoRole } from "../../../../src/journeys/errors.js";
import { getJourneyMatchesUsecase } from "../../../../src/journeys/usecases/get-journey-matches-usecase.js";
import { USER_ROLE } from "../../../../src/shared/constants.js";

describe("Unit | Journey | Usecase | Get journey matches", () => {
  let findUser, getPassengerMatches, getCompanionMatches, deps;
  beforeEach(() => {
    findUser = vi.fn();
    getPassengerMatches = vi.fn();
    getCompanionMatches = vi.fn();
    deps = { findUser, getPassengerMatches, getCompanionMatches };
  });

  it("should return the passenger matches for a passenger (invalid role) user", async () => {
    // given
    findUser.mockResolvedValue({ id: 1, role: USER_ROLE.INVALID });
    getPassengerMatches.mockResolvedValue([{ foundJourneyId: 3 }]);

    // when
    const matches = await getJourneyMatchesUsecase({ userId: 1, journeyId: 5 }, deps);

    // then
    expect(getPassengerMatches).toHaveBeenCalledWith({ journeyId: 5, userId: 1 });
    expect(getCompanionMatches).not.toHaveBeenCalled();
    expect(matches).toEqual([{ foundJourneyId: 3 }]);
  });

  it("should return the companion matches for a companion (valid role) user", async () => {
    // given
    findUser.mockResolvedValue({ id: 1, role: USER_ROLE.VALID });
    getCompanionMatches.mockResolvedValue([]);

    // when
    const matches = await getJourneyMatchesUsecase({ userId: 1, journeyId: 5 }, deps);

    // then
    expect(getCompanionMatches).toHaveBeenCalledWith({ journeyId: 5, userId: 1 });
    expect(getPassengerMatches).not.toHaveBeenCalled();
    expect(matches).toEqual([]);
  });

  it("should throw JourneyNotFound when the journey is not the user's", async () => {
    // given
    findUser.mockResolvedValue({ id: 1, role: USER_ROLE.INVALID });
    getPassengerMatches.mockResolvedValue(null);

    // when / then
    await expect(getJourneyMatchesUsecase({ userId: 1, journeyId: 5 }, deps)).rejects.toThrow(JourneyNotFound);
  });

  it("should throw UserHasNoRole when the user has no passenger/companion role", async () => {
    // given
    findUser.mockResolvedValue({ id: 1 });

    // when / then
    await expect(getJourneyMatchesUsecase({ userId: 1, journeyId: 5 }, deps)).rejects.toThrow(UserHasNoRole);
    expect(getPassengerMatches).not.toHaveBeenCalled();
    expect(getCompanionMatches).not.toHaveBeenCalled();
  });
});
