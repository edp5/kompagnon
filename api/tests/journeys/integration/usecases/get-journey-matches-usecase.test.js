import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { JourneyNotFound, UserHasNoRole } from "../../../../src/journeys/errors.js";
import usecases from "../../../../src/journeys/usecases/index.js";
import { USER_ROLE } from "../../../../src/shared/constants.js";

describe("Integration | Journey | Usecase | Get journey matches", () => {
  it("should return the passenger matches for a passenger (invalid role) user", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser({ role: USER_ROLE.INVALID });
    const journey = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });
    const foundJourney = await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: journey.id });

    // when
    const matches = await usecases.getJourneyMatchesUsecase({ userId: user.id, journeyId: journey.id });

    // then
    expect(matches[0].foundJourneyId).toEqual(foundJourney.id);
  });

  it("should return the companion matches for a companion (valid role) user", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser({ role: USER_ROLE.VALID });
    const journey = await databaseBuilder.factory.buildCompanionJourney({ userId: user.id });

    // when
    const matches = await usecases.getJourneyMatchesUsecase({ userId: user.id, journeyId: journey.id });

    // then
    expect(matches).toEqual([]);
  });

  it("should throw JourneyNotFound when the journey is not the user's", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser({ role: USER_ROLE.INVALID });

    // when / then
    await expect(usecases.getJourneyMatchesUsecase({ userId: user.id, journeyId: 5 })).rejects.toThrow(JourneyNotFound);
  });

  it("should throw UserHasNoRole when the user has no passenger/companion role", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser();

    // when / then
    await expect(usecases.getJourneyMatchesUsecase({ userId: user.id, journeyId: 5 })).rejects.toThrow(UserHasNoRole);
  });
});
