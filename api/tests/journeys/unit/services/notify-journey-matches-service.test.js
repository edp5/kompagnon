import { describe, expect, it, vi } from "vitest";

import { notifyJourneyMatchesService } from "../../../../src/journeys/services/notify-journey-matches-service.js";

describe("Unit | Journeys | Services | Notify journey matches", () => {
  function buildDeps() {
    return {
      findFoundJourney: vi.fn().mockResolvedValue({ passengerJourneyId: 10, companionJourneyId: 20 }),
      findPassengerJourney: vi.fn().mockResolvedValue({ id: 10, userId: 100 }),
      findCompanionJourney: vi.fn().mockResolvedValue({ id: 20, userId: 200 }),
      findUser: vi.fn(async (id) => (id === 100
        ? { firstname: "Marie", lastname: "Durand", email: "marie@example.net" }
        : { firstname: "Paul", lastname: "Martin", email: "paul@example.net" })),
      sendMailOnMatch: vi.fn().mockResolvedValue(),
    };
  }

  it("should email both users of each match with a link to their own journey", async () => {
    // given
    const deps = buildDeps();

    // when
    await notifyJourneyMatchesService({ foundJourneyIds: [3], ...deps });

    // then
    expect(deps.sendMailOnMatch).toHaveBeenCalledTimes(2);
    expect(deps.sendMailOnMatch).toHaveBeenCalledWith(expect.objectContaining({
      email: "marie@example.net",
      journeyId: 10,
      matchLabel: "une personne à accompagner",
    }));
    expect(deps.sendMailOnMatch).toHaveBeenCalledWith(expect.objectContaining({
      email: "paul@example.net",
      journeyId: 20,
      matchLabel: "un accompagnateur",
    }));
  });

  it("should skip a match whose found journey is missing without throwing", async () => {
    // given
    const deps = buildDeps();
    deps.findFoundJourney.mockResolvedValue(null);

    // when / then
    await expect(notifyJourneyMatchesService({ foundJourneyIds: [3], ...deps })).resolves.toBeUndefined();
    expect(deps.sendMailOnMatch).not.toHaveBeenCalled();
  });

  it("should skip a match whose journeys can no longer be found", async () => {
    // given
    const deps = buildDeps();
    deps.findPassengerJourney.mockResolvedValue(null);

    // when / then
    await expect(notifyJourneyMatchesService({ foundJourneyIds: [3], ...deps })).resolves.toBeUndefined();
    expect(deps.sendMailOnMatch).not.toHaveBeenCalled();
  });

  it("should not stop the other matches when one notification fails", async () => {
    // given
    const deps = buildDeps();
    deps.sendMailOnMatch
      .mockRejectedValueOnce(new Error("smtp down"))
      .mockResolvedValue();

    // when / then
    await expect(notifyJourneyMatchesService({ foundJourneyIds: [3, 4], ...deps })).resolves.toBeUndefined();
    // second match still processed (2 emails attempted for it)
    expect(deps.findFoundJourney).toHaveBeenCalledTimes(2);
  });
});
