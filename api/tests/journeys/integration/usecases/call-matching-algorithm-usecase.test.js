import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { config } from "../../../../config.js";
import { callMatchingAlgorithmUsecase } from "../../../../src/journeys/usecases/call-matching-algorithm-usecase.js";

describe("Integration | Journeys | Usecases | Call matching algorithm", () => {
  beforeEach(() => {
    config.algorithm.enabled = true;
  });

  afterEach(() => {
    vi.restoreAllMocks();
    config.algorithm.enabled = false;
  });

  it("should call the algo match route and return its answer when enabled", async () => {
    // given
    const matchResponse = { found_journey_ids: [1], message: "ok" };
    const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(matchResponse),
    });

    // when
    const result = await callMatchingAlgorithmUsecase({ journeyId: 7, role: "passenger" });

    // then
    expect(fetchSpy).toHaveBeenCalledWith("http://localhost:8000/api/match", expect.objectContaining({
      method: "POST",
      body: JSON.stringify({ journey_id: 7, role: "passenger" }),
    }));
    expect(result).toEqual(matchResponse);
  });

  it("should skip the call when the algorithm is disabled", async () => {
    // given
    config.algorithm.enabled = false;
    const fetchSpy = vi.spyOn(global, "fetch");

    // when
    const result = await callMatchingAlgorithmUsecase({ journeyId: 7, role: "passenger" });

    // then
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(result).toBeUndefined();
  });

  it("should not throw and return undefined when the algorithm request fails", async () => {
    // given
    vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 502 });

    // when
    const result = await callMatchingAlgorithmUsecase({ journeyId: 7, role: "companion" });

    // then
    expect(result).toBeUndefined();
  });
});
