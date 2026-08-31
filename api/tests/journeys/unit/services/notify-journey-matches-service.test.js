import { describe, expect, it, vi } from "vitest";

import { logger } from "../../../../logger.js";
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

  it("should log a warning and skip a match whose found journey is missing without throwing", async () => {
    // given
    const deps = buildDeps();
    deps.findFoundJourney.mockResolvedValue(null);
    const warnSpy = vi.spyOn(logger, "warn").mockImplementation(() => {});

    // when / then
    await expect(notifyJourneyMatchesService({ foundJourneyIds: [3], ...deps })).resolves.toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith(
      { foundJourneyId: 3 },
      "Found journey not found when sending match notifications",
    );
    expect(deps.sendMailOnMatch).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("should log a warning and skip a match whose journeys can no longer be found", async () => {
    // given
    const deps = buildDeps();
    deps.findPassengerJourney.mockResolvedValue(null);
    const warnSpy = vi.spyOn(logger, "warn").mockImplementation(() => {});

    // when / then
    await expect(notifyJourneyMatchesService({ foundJourneyIds: [3], ...deps })).resolves.toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith(
      { foundJourneyId: 3, passengerJourneyId: 10, companionJourneyId: 20 },
      "Associated journey not found when sending match notifications",
    );
    expect(deps.sendMailOnMatch).not.toHaveBeenCalled();
    warnSpy.mockRestore();
  });

  it("should log a warning and skip a match whose users can no longer be found", async () => {
    // given
    const deps = buildDeps();
    deps.findUser.mockResolvedValue(null);
    const warnSpy = vi.spyOn(logger, "warn").mockImplementation(() => {});

    // when / then
    await expect(notifyJourneyMatchesService({ foundJourneyIds: [3], ...deps })).resolves.toBeUndefined();
    expect(warnSpy).toHaveBeenCalledWith(
      { foundJourneyId: 3, passengerUserId: 100, companionUserId: 200 },
      "Associated user not found when sending match notifications",
    );
    expect(deps.sendMailOnMatch).not.toHaveBeenCalled();
    warnSpy.mockRestore();
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
