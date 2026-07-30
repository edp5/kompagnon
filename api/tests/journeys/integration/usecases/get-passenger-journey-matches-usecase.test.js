import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import usecases from "../../../../src/journeys/usecases/index.js";
import { JOURNEY_STATUS } from "../../../../src/shared/constants.js";

describe("Integration | Journeys | Usecases | Get passenger journey matches", () => {
  it("should return the companion match with the other user, journey and statuses", async () => {
    // given
    const passenger = await databaseBuilder.factory.buildUser();
    const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id });
    const companion = await databaseBuilder.factory.buildUser({ firstname: "Adrien", lastname: "Le Guen" });
    const companionJourney = await databaseBuilder.factory.buildCompanionJourney({
      userId: companion.id,
      departureAddress: "Paris Gare de Lyon",
      arrivalAddress: "Lyon Part-Dieu",
    });
    const foundJourney = await databaseBuilder.factory.buildFoundJourney({
      passengerJourneyId: passengerJourney.id,
      companionJourneyId: companionJourney.id,
      passengerStatus: JOURNEY_STATUS.WAITING,
      companionStatus: JOURNEY_STATUS.ACCEPTED,
    });

    // when
    const result = await usecases.getPassengerJourneyMatchesUsecase({ journeyId: Number(passengerJourney.id), userId: passenger.id });

    // then
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      foundJourneyId: Number(foundJourney.id),
      user: { firstname: "Adrien", lastname: "Le Guen" },
      journey: { departureAddress: "Paris Gare de Lyon", arrivalAddress: "Lyon Part-Dieu" },
      myStatus: JOURNEY_STATUS.WAITING,
      otherStatus: JOURNEY_STATUS.ACCEPTED,
    });
  });

  it("should return null when the journey is not owned by the user", async () => {
    // given
    const owner = await databaseBuilder.factory.buildUser();
    const otherUser = await databaseBuilder.factory.buildUser();
    const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: owner.id });

    // when
    const result = await usecases.getPassengerJourneyMatchesUsecase({ journeyId: Number(passengerJourney.id), userId: otherUser.id });

    // then
    expect(result).toBeNull();
  });

  it("should exclude a match declined by the other side", async () => {
    // given
    const passenger = await databaseBuilder.factory.buildUser();
    const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id });
    const companionJourney = await databaseBuilder.factory.buildCompanionJourney();
    await databaseBuilder.factory.buildFoundJourney({
      passengerJourneyId: passengerJourney.id,
      companionJourneyId: companionJourney.id,
      passengerStatus: JOURNEY_STATUS.WAITING,
      companionStatus: JOURNEY_STATUS.REJECTED,
    });

    // when
    const result = await usecases.getPassengerJourneyMatchesUsecase({ journeyId: Number(passengerJourney.id), userId: passenger.id });

    // then
    expect(result).toEqual([]);
  });
});
