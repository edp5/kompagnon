import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import usecases from "../../../../src/journeys/usecases/index.js";

describe("Integration | Journeys | Usecases | Record passenger journey", () => {
  describe("database access", () => {
    it("should save the journey in the database", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const data = {
        userId: user.id,
        departureTime: "2024-01-01T10:00:00Z",
        arrivalTime: "2024-01-01T11:00:00Z",
        departureAddress: "123 Main St",
        arrivalAddress: "456 Elm St",
        departureLon: -122.4194,
        departureLat: 37.7749,
        arrivalLon: -122.4194,
        arrivalLat: 37.7749,
      };

      // when
      const result = await usecases.recordPassengerJourneyUsecase(data);

      // then
      expect(result).toHaveProperty("journeyId");
      const recordedJourney = await knex("passenger_journeys").where({ id: result.journeyId }).first();
      expect(Number(recordedJourney.id)).toBe(result.journeyId);
      expect(Number(recordedJourney.userId)).toBe(user.id);
      expect(new Date(recordedJourney.departureTime).getTime()).toBe(new Date(data.departureTime).getTime());
      expect(new Date(recordedJourney.arrivalTime).getTime()).toBe(new Date(data.arrivalTime).getTime());
      expect(recordedJourney.departureAddress).toBe(data.departureAddress);
      expect(recordedJourney.arrivalAddress).toBe(data.arrivalAddress);
      expect(parseFloat(recordedJourney.departureLon)).toBeCloseTo(-122.4194, 6);
      expect(parseFloat(recordedJourney.arrivalLon)).toBeCloseTo(-122.4194, 6);
      expect(parseFloat(recordedJourney.departureLat)).toBeCloseTo(37.7749, 6);
      expect(parseFloat(recordedJourney.arrivalLat)).toBeCloseTo(37.7749, 6);
    });
  });
});
