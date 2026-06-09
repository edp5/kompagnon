import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import usecases from "../../../../src/journeys/usecases/index.js";

describe("Integration | Journeys | Usecases | Get passenger journey", () => {
  it("should return the journey when it belongs to the user", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser();
    const journey = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });

    // when
    const result = await usecases.getPassengerJourneyUsecase({ journeyId: Number(journey.id), userId: user.id });

    // then
    expect(result).not.toBeNull();
    expect(Number(result.id)).toBe(Number(journey.id));
    expect(Number(result.userId)).toBe(user.id);
  });

  it("should return null when the journey belongs to another user", async () => {
    // given
    const owner = await databaseBuilder.factory.buildUser({ email: `owner-${crypto.randomUUID()}@example.net` });
    const otherUser = await databaseBuilder.factory.buildUser({ email: `other-${crypto.randomUUID()}@example.net` });
    const journey = await databaseBuilder.factory.buildPassengerJourney({ userId: owner.id });

    // when
    const result = await usecases.getPassengerJourneyUsecase({ journeyId: Number(journey.id), userId: otherUser.id });

    // then
    expect(result).toBeNull();
  });

  it("should return null when the journey does not exist", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser();

    // when
    const result = await usecases.getPassengerJourneyUsecase({ journeyId: 9999999, userId: user.id });

    // then
    expect(result).toBeNull();
  });
});
