import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import usecases from "../../../../src/journeys/usecases/index.js";
import { JOURNEY_STATUS } from "../../../../src/shared/constants.js";

describe("Integration | Journeys | Usecases | Get companion journey matches", () => {
  it("should return the passenger match with the other user, journey and statuses", async () => {
    // given
    const companion = await databaseBuilder.factory.buildUser();
    const companionJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id });
    const passenger = await databaseBuilder.factory.buildUser({ firstname: "Marie", lastname: "Durand" });
    const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({
      userId: passenger.id,
      departureAddress: "Paris Gare de Lyon",
      arrivalAddress: "Lyon Part-Dieu",
    });
    const foundJourney = await databaseBuilder.factory.buildFoundJourney({
      passengerJourneyId: passengerJourney.id,
      companionJourneyId: companionJourney.id,
      passengerStatus: JOURNEY_STATUS.ACCEPTED,
      companionStatus: JOURNEY_STATUS.WAITING,
    });

    // when
    const result = await usecases.getCompanionJourneyMatchesUsecase({ journeyId: Number(companionJourney.id), userId: companion.id });

    // then
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      foundJourneyId: Number(foundJourney.id),
      user: { firstname: "Marie", lastname: "Durand" },
      journey: { departureAddress: "Paris Gare de Lyon", arrivalAddress: "Lyon Part-Dieu" },
      myStatus: JOURNEY_STATUS.WAITING,
      otherStatus: JOURNEY_STATUS.ACCEPTED,
    });
  });

  it("should return null when the journey is not owned by the user", async () => {
    // given
    const owner = await databaseBuilder.factory.buildUser();
    const otherUser = await databaseBuilder.factory.buildUser();
    const companionJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: owner.id });

    // when
    const result = await usecases.getCompanionJourneyMatchesUsecase({ journeyId: Number(companionJourney.id), userId: otherUser.id });

    // then
    expect(result).toBeNull();
  });
});
