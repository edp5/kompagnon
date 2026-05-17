import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import * as companionUsersRepository from "../../../../src/journeys/repositories/companion-users-repository.js";

describe("Integration | Journeys | Repositories | Companion users repository", () => {
  describe("#saveJourney", () => {
    it("should save a journey and return id", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const data = {
        userId: user.id,
        departureTime: new Date().toISOString(),
        arrivalTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // +1h
        departureAddress: "10 Downing St, London",
        arrivalAddress: "221B Baker St, London",
        departureLon: 0.127758, // example lon/lat
        departureLat: 51.507351,
        arrivalLon: 0.157000,
        arrivalLat: 51.523767,
      };

      // when
      const id = await companionUsersRepository.saveJourney(data);

      // then
      expect(id).toBeDefined();
      expect(typeof id).toBe("number");

      const saved = await knex("companion_journeys").where({ id }).first();
      expect(saved).toBeDefined();
      expect(saved.userId).toBe(user.id);
      expect(saved.departureAddress).toBe(data.departureAddress);
      expect(saved.arrivalAddress).toBe(data.arrivalAddress);
      expect(Number(saved.departureLon)).toBeCloseTo(data.departureLon, 6);
      expect(Number(saved.departureLat)).toBeCloseTo(data.departureLat, 6);
      expect(Number(saved.arrivalLon)).toBeCloseTo(data.arrivalLon, 6);
      expect(Number(saved.arrivalLat)).toBeCloseTo(data.arrivalLat, 6);
    });
  });

  describe("#findJourneyById", () => {
    it("should return the journey when it exists", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const data = {
        userId: user.id,
        departureTime: new Date().toISOString(),
        arrivalTime: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // +30m
        departureAddress: "Start A",
        arrivalAddress: "End A",
        departureLon: 1.23,
        departureLat: 4.56,
        arrivalLon: 7.89,
        arrivalLat: 0.12,
      };

      // when
      const id = await companionUsersRepository.saveJourney(data);
      const found = await companionUsersRepository.findJourneyById(id);

      // then
      expect(found).toBeDefined();
      expect(found.id).toBe(id);
      expect(found.userId).toBe(user.id);
      expect(found.departureAddress).toBe(data.departureAddress);
    });

    it("should return null when journey does not exist", async () => {
      // given & when
      const found = await companionUsersRepository.findJourneyById(99999999);

      // then
      expect(found).toBeNull();
    });
  });

  describe("#findJourneysByUserId", () => {
    it("should return all journeys for a given user", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const otherUser = await databaseBuilder.factory.buildUser({ email: `other-${Date.now()}@example.net` });

      await databaseBuilder.factory.buildCompanionJourney({
        userId: user.id,
        departureTime: new Date().toISOString(),
        arrivalTime: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
        departureAddress: "A1",
        arrivalAddress: "B1",
        departureLon: 0,
        departureLat: 0,
        arrivalLon: 0,
        arrivalLat: 0,
      });
      await databaseBuilder.factory.buildCompanionJourney({
        userId: user.id,
        departureTime: new Date().toISOString(),
        arrivalTime: new Date(Date.now() + 40 * 60 * 1000).toISOString(),
        departureAddress: "A2",
        arrivalAddress: "B2",
        departureLon: 0,
        departureLat: 0,
        arrivalLon: 0,
        arrivalLat: 0,
      });
      await databaseBuilder.factory.buildCompanionJourney({
        userId: otherUser.id,
        departureTime: new Date().toISOString(),
        arrivalTime: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        departureAddress: "AO",
        arrivalAddress: "BO",
        departureLon: 0,
        departureLat: 0,
        arrivalLon: 0,
        arrivalLat: 0,
      });

      // when
      const journeys = await companionUsersRepository.findJourneysByUserId(user.id);

      // then
      expect(Array.isArray(journeys)).toBe(true);
      expect(journeys.length).toBeGreaterThanOrEqual(2);
      for (const j of journeys) {
        expect(j.userId).toBe(user.id);
      }
    });
  });

  describe("#removeJourneyByJourneyId", () => {
    it("should remove an existing journey and return 1", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const data = await databaseBuilder.factory.buildCompanionJourney({
        userId: user.id,
        departureTime: new Date().toISOString(),
        arrivalTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
        departureAddress: "ToRemove",
        arrivalAddress: "ToRemoveDest",
        departureLon: 0,
        departureLat: 0,
        arrivalLon: 0,
        arrivalLat: 0,
      });

      // when
      const removed = await companionUsersRepository.removeJourneyByJourneyId(data.id);

      // then
      expect(removed).toBe(1);
      const found = await knex("companion_journeys").where({ id: data.id });
      expect(found).toHaveLength(0);
    });

    it("should return 0 when removing non-existent journey", async () => {
      // when
      const removed = await companionUsersRepository.removeJourneyByJourneyId(99999999);

      // then
      expect(removed).toBe(0);
    });
  });
});
