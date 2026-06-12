import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import usecases from "../../../../src/journeys/usecases/index.js";

describe("Integration | Journeys | Usecases | Get passenger journeys", () => {
  it("should return all passenger journeys belonging to the user", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser();
    const journey1 = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });
    const journey2 = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });

    // when
    const result = await usecases.getPassengerJourneysUsecase({ userId: user.id });

    // then
    expect(result).toHaveLength(2);
    const ids = result.map(j => Number(j.id));
    expect(ids).toContain(Number(journey1.id));
    expect(ids).toContain(Number(journey2.id));
  });

  it("should enrich journey status with isMatched boolean", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser();
    const matchedJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });
    const unmatchedJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });

    await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: matchedJourney.id });

    // when
    const result = await usecases.getPassengerJourneysUsecase({ userId: user.id });

    // then
    expect(result).toHaveLength(2);
    const matched = result.find(j => Number(j.id) === Number(matchedJourney.id));
    const unmatched = result.find(j => Number(j.id) === Number(unmatchedJourney.id));

    expect(matched.isMatched).toBe(true);
    expect(unmatched.isMatched).toBe(false);
  });
});
