import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { getCompanionJourneyMatchesUsecase } from "../../../../src/journeys/usecases/get-companion-journey-matches-usecase.js";
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
    const result = await getCompanionJourneyMatchesUsecase({ journeyId: Number(companionJourney.id), userId: companion.id });

    // then
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      foundJourneyId: Number(foundJourney.id),
      user: { firstname: "Marie", lastname: "Durand", phoneNumber: null },
      journey: { departureAddress: "Paris Gare de Lyon", arrivalAddress: "Lyon Part-Dieu" },
      myStatus: JOURNEY_STATUS.WAITING,
      otherStatus: JOURNEY_STATUS.ACCEPTED,
    });
  });

  it("should return the passenger match with the other user and phone number, when journey is confirmed", async () => {
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
      companionStatus: JOURNEY_STATUS.ACCEPTED,
    });

    // when
    const result = await getCompanionJourneyMatchesUsecase({ journeyId: Number(companionJourney.id), userId: companion.id });

    // then
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      foundJourneyId: Number(foundJourney.id),
      user: { firstname: "Marie", lastname: "Durand", phoneNumber: passenger.phoneNumber },
      journey: { departureAddress: "Paris Gare de Lyon", arrivalAddress: "Lyon Part-Dieu" },
      myStatus: JOURNEY_STATUS.ACCEPTED,
      otherStatus: JOURNEY_STATUS.ACCEPTED,
    });
  });

  it("should return null when the journey is not owned by the user", async () => {
    // given
    const owner = await databaseBuilder.factory.buildUser();
    const otherUser = await databaseBuilder.factory.buildUser();
    const companionJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: owner.id });

    // when
    const result = await getCompanionJourneyMatchesUsecase({ journeyId: Number(companionJourney.id), userId: otherUser.id });

    // then
    expect(result).toBeNull();
  });

  it("should include the other journey's coordinates", async () => {
    // given
    const owner = await databaseBuilder.factory.buildUser();
    const ownerJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: owner.id });
    const other = await databaseBuilder.factory.buildUser();
    const otherJourney = await databaseBuilder.factory.buildPassengerJourney({
      userId: other.id,
      departureLat: 48.8443,
      departureLon: 2.3743,
      arrivalLat: 45.7602,
      arrivalLon: 4.8596,
    });
    await databaseBuilder.factory.buildFoundJourney({
      companionJourneyId: ownerJourney.id,
      passengerJourneyId: otherJourney.id,
      companionStatus: JOURNEY_STATUS.WAITING,
      passengerStatus: JOURNEY_STATUS.ACCEPTED,
    });

    // when
    const result = await getCompanionJourneyMatchesUsecase({ journeyId: Number(ownerJourney.id), userId: owner.id });

    // then
    expect(Number(result[0].journey.departureLat)).toBeCloseTo(48.8443);
    expect(Number(result[0].journey.departureLon)).toBeCloseTo(2.3743);
    expect(Number(result[0].journey.arrivalLat)).toBeCloseTo(45.7602);
    expect(Number(result[0].journey.arrivalLon)).toBeCloseTo(4.8596);
  });
});
