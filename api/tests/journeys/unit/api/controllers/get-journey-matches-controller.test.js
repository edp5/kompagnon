import { beforeEach, describe, expect, it, vi } from "vitest";

import { getJourneyMatchesController } from "../../../../../src/journeys/api/controllers/get-journey-matches-controller.js";

describe("Unit | Journey | Api | Controller | Get journey matches controller", () => {
  let res, next, getJourneyMatches;
  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    getJourneyMatches = vi.fn();
    next = vi.fn();
  });

  it("should return the matches of the requested journey for the authenticated user", async () => {
    // given
    const req = { auth: { userId: 1 }, params: { journeyId: "5" } };
    getJourneyMatches.mockResolvedValue([{ foundJourneyId: 3 }]);

    // when
    await getJourneyMatchesController(req, res, next, getJourneyMatches);

    // then
    expect(getJourneyMatches).toHaveBeenCalledWith({ userId: 1, journeyId: 5 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [{ foundJourneyId: 3 }] });
  });

  it("should forward errors thrown by the use case to next", async () => {
    // given
    const req = { auth: { userId: 1 }, params: { journeyId: "5" } };
    const thrownError = new Error("boom");
    getJourneyMatches.mockRejectedValue(thrownError);

    // when
    await getJourneyMatchesController(req, res, next, getJourneyMatches);

    // then
    expect(res.status).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(thrownError);
  });
});
