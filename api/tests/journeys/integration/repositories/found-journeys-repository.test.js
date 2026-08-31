import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import * as foundJouroneysRepository from "../../../../src/journeys/repositories/found-journeys-repository.js";
import { JOURNEY_STATUS } from "../../../../src/shared/constants.js";

describe("Integration | Journeys | Repositories | Found journeys repository", () => {
  describe("#foundJourneyByFoundJourneyId", () => {
    it("should return the found journey corresponding to id", async () => {
      // given
      const createdFoundJourney = await databaseBuilder.factory.buildFoundJourney();

      // when
      const foundFoundJourney = await foundJouroneysRepository.findFoundJourneyByFoundJourneyId(createdFoundJourney.id);

      // then
      expect(foundFoundJourney).toBeDefined();
      expect(foundFoundJourney).toEqual(createdFoundJourney);
    });

    it("should return null if no found journey is found", async () => {
      // given
      const foundJourneyId = 123;

      // when
      const foundFoundJourney = await foundJouroneysRepository.findFoundJourneyByFoundJourneyId(foundJourneyId);

      // then
      expect(foundFoundJourney).toBeNull();
    });
  });

  describe("#updateFoundJourneyCompanionStatusByFoundJourneyId", () => {
    it("should update the found journey status", async () => {
      // given
      const createdFoundJourney = await databaseBuilder.factory.buildFoundJourney({ companionStatus: JOURNEY_STATUS.WAITING });

      // when
      await foundJouroneysRepository.updateFoundJourneyCompanionStatusByFoundJourneyId({ foundJourneyId: createdFoundJourney.id, status: JOURNEY_STATUS.ACCEPTED });

      // when
      const updatedFoundJourney = await knex("found_journeys").where({ id: createdFoundJourney.id }).first();
      expect(updatedFoundJourney.companionStatus).toBe(JOURNEY_STATUS.ACCEPTED);
    });
  });

  describe("#updateFoundJourneyPassengerStatusByFoundJourneyId", () => {
    it("should update the found journey status", async () => {
      // given
      const createdFoundJourney = await databaseBuilder.factory.buildFoundJourney({ passengerStatus: JOURNEY_STATUS.WAITING });

      // when
      await foundJouroneysRepository.updateFoundJourneyPassengerStatusByFoundJourneyId({ foundJourneyId: createdFoundJourney.id, status: JOURNEY_STATUS.ACCEPTED });

      // when
      const updatedFoundJourney = await knex("found_journeys").where({ id: createdFoundJourney.id }).first();
      expect(updatedFoundJourney.passengerStatus).toBe(JOURNEY_STATUS.ACCEPTED);
    });
  });

  describe("#findMatchesByPassengerJourneyId", () => {
    it("should return the companion side of the match with the user, statuses and journey coordinates", async () => {
      // given
      const passenger = await databaseBuilder.factory.buildUser();
      const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id });
      const companion = await databaseBuilder.factory.buildUser({ firstname: "Adrien", lastname: "Le Guen", phoneNumber: "0612345678" });
      const companionJourney = await databaseBuilder.factory.buildCompanionJourney({
        userId: companion.id,
        departureAddress: "Paris Gare de Lyon",
        arrivalAddress: "Lyon Part-Dieu",
        departureLat: 48.8443,
        departureLon: 2.3743,
        arrivalLat: 45.7602,
        arrivalLon: 4.8596,
      });
      const foundJourney = await databaseBuilder.factory.buildFoundJourney({
        passengerJourneyId: passengerJourney.id,
        companionJourneyId: companionJourney.id,
        passengerStatus: JOURNEY_STATUS.WAITING,
        companionStatus: JOURNEY_STATUS.ACCEPTED,
      });

      // when
      const rows = await foundJouroneysRepository.findMatchesByPassengerJourneyId(passengerJourney.id);

      // then
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        foundJourneyId: Number(foundJourney.id),
        firstname: "Adrien",
        lastname: "Le Guen",
        phoneNumber: "0612345678",
        departureAddress: "Paris Gare de Lyon",
        arrivalAddress: "Lyon Part-Dieu",
        passengerStatus: JOURNEY_STATUS.WAITING,
        companionStatus: JOURNEY_STATUS.ACCEPTED,
      });
      expect(Number(rows[0].departureLat)).toBeCloseTo(48.8443);
      expect(Number(rows[0].departureLon)).toBeCloseTo(2.3743);
      expect(Number(rows[0].arrivalLat)).toBeCloseTo(45.7602);
      expect(Number(rows[0].arrivalLon)).toBeCloseTo(4.8596);
    });

    it("should return an empty array when the journey has no match", async () => {
      // given
      const passenger = await databaseBuilder.factory.buildUser();
      const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id });

      // when
      const rows = await foundJouroneysRepository.findMatchesByPassengerJourneyId(passengerJourney.id);

      // then
      expect(rows).toEqual([]);
    });
  });

  describe("#findMatchesByCompanionJourneyId", () => {
    it("should return the passenger side of the match with the user, statuses and journey coordinates", async () => {
      // given
      const companion = await databaseBuilder.factory.buildUser();
      const companionJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id });
      const passenger = await databaseBuilder.factory.buildUser({ firstname: "Marie", lastname: "Curie", phoneNumber: "0698765432" });
      const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({
        userId: passenger.id,
        departureAddress: "12 Rue de Rivoli",
        arrivalAddress: "Gare de Lyon",
        departureLat: 48.8558,
        departureLon: 2.3588,
        arrivalLat: 48.8443,
        arrivalLon: 2.3743,
      });
      const foundJourney = await databaseBuilder.factory.buildFoundJourney({
        passengerJourneyId: passengerJourney.id,
        companionJourneyId: companionJourney.id,
        passengerStatus: JOURNEY_STATUS.ACCEPTED,
        companionStatus: JOURNEY_STATUS.WAITING,
      });

      // when
      const rows = await foundJouroneysRepository.findMatchesByCompanionJourneyId(companionJourney.id);

      // then
      expect(rows).toHaveLength(1);
      expect(rows[0]).toMatchObject({
        foundJourneyId: Number(foundJourney.id),
        firstname: "Marie",
        lastname: "Curie",
        phoneNumber: "0698765432",
        departureAddress: "12 Rue de Rivoli",
        arrivalAddress: "Gare de Lyon",
        passengerStatus: JOURNEY_STATUS.ACCEPTED,
        companionStatus: JOURNEY_STATUS.WAITING,
      });
      expect(Number(rows[0].departureLat)).toBeCloseTo(48.8558);
      expect(Number(rows[0].departureLon)).toBeCloseTo(2.3588);
      expect(Number(rows[0].arrivalLat)).toBeCloseTo(48.8443);
      expect(Number(rows[0].arrivalLon)).toBeCloseTo(2.3743);
    });

    it("should return an empty array when the journey has no match", async () => {
      // given
      const companion = await databaseBuilder.factory.buildUser();
      const companionJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id });

      // when
      const rows = await foundJouroneysRepository.findMatchesByCompanionJourneyId(companionJourney.id);

      // then
      expect(rows).toEqual([]);
    });
  });
});
