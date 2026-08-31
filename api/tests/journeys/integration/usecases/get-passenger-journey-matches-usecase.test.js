import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { getPassengerJourneyMatchesUsecase } from "../../../../src/journeys/usecases/get-passenger-journey-matches-usecase.js";
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
    const result = await getPassengerJourneyMatchesUsecase({ journeyId: Number(passengerJourney.id), userId: passenger.id });

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

  it("should return the companion match with the other user, journey and statuses and phone number if journey is accepted", async () => {
    // given
    const passenger = await databaseBuilder.factory.buildUser();
    const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id });
    const companion = await databaseBuilder.factory.buildUser({ firstname: "Adrien", lastname: "Le Guen", phoneNumber: "0612345678" });
    const companionJourney = await databaseBuilder.factory.buildCompanionJourney({
      userId: companion.id,
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
    const result = await getPassengerJourneyMatchesUsecase({ journeyId: Number(passengerJourney.id), userId: passenger.id });

    // then
    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      foundJourneyId: Number(foundJourney.id),
      user: { firstname: "Adrien", lastname: "Le Guen", phoneNumber: "0612345678" },
      journey: { departureAddress: "Paris Gare de Lyon", arrivalAddress: "Lyon Part-Dieu" },
      myStatus: JOURNEY_STATUS.ACCEPTED,
      otherStatus: JOURNEY_STATUS.ACCEPTED,
    });
  });

  it("should return null when the journey is not owned by the user", async () => {
    // given
    const owner = await databaseBuilder.factory.buildUser();
    const otherUser = await databaseBuilder.factory.buildUser();
    const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: owner.id });

    // when
    const result = await getPassengerJourneyMatchesUsecase({ journeyId: Number(passengerJourney.id), userId: otherUser.id });

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
    const result = await getPassengerJourneyMatchesUsecase({ journeyId: Number(passengerJourney.id), userId: passenger.id });

    // then
    expect(result).toEqual([]);
  });

  it("should include the other journey's coordinates", async () => {
    // given
    const owner = await databaseBuilder.factory.buildUser();
    const ownerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: owner.id });
    const other = await databaseBuilder.factory.buildUser();
    const otherJourney = await databaseBuilder.factory.buildCompanionJourney({
      userId: other.id,
      departureLat: 48.8443,
      departureLon: 2.3743,
      arrivalLat: 45.7602,
      arrivalLon: 4.8596,
    });
    await databaseBuilder.factory.buildFoundJourney({
      passengerJourneyId: ownerJourney.id,
      companionJourneyId: otherJourney.id,
      passengerStatus: JOURNEY_STATUS.WAITING,
      companionStatus: JOURNEY_STATUS.ACCEPTED,
    });

    // when
    const result = await getPassengerJourneyMatchesUsecase({ journeyId: Number(ownerJourney.id), userId: owner.id });

    // then
    expect(Number(result[0].journey.departureLat)).toBeCloseTo(48.8443);
    expect(Number(result[0].journey.departureLon)).toBeCloseTo(2.3743);
    expect(Number(result[0].journey.arrivalLat)).toBeCloseTo(45.7602);
    expect(Number(result[0].journey.arrivalLon)).toBeCloseTo(4.8596);
  });
});
