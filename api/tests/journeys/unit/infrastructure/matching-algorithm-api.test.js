import { afterEach, describe, expect, it, vi } from "vitest";

import { config } from "../../../../config.js";
import { requestJourneyMatch } from "../../../../src/journeys/infrastructure/matching-algorithm-api.js";

describe("Unit | Journeys | Infrastructure | Matching algorithm api", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should POST the journey id and role to the algo match route and return its answer", async () => {
    // given
    const matchResponse = { found_journey_ids: [], message: "no match" };
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(matchResponse),
    });

    // when
    const result = await requestJourneyMatch({ journeyId: 7, role: "passenger" });

    // then
    expect(fetchSpy).toHaveBeenCalledWith("http://localhost:8000/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ journey_id: 7, role: "passenger" }),
    });
    expect(result).toEqual(matchResponse);
  });

  it("should throw when the algorithm responds with a non-ok status", async () => {
    // given
    vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 404 });

    // when / then
    await expect(requestJourneyMatch({ journeyId: 7, role: "companion" })).rejects.toThrow("status 404");
  });

  it("should throw a clear error when the algorithm base url is not configured", async () => {
    // given
    const originalUrl = config.algorithm.apiUrl;
    config.algorithm.apiUrl = "";

    // when / then
    try {
      await expect(requestJourneyMatch({ journeyId: 7, role: "passenger" })).rejects.toThrow("Matching algorithm api url is not configured");
    } finally {
      config.algorithm.apiUrl = originalUrl;
    }
  });
});
