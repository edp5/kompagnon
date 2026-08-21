import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import {
  findLastTrackingPoint,
  findTrackingPointsByJourneyId,
  saveTrackingPoint,
  updateJourneyTrackingStatus,
} from "../../../../src/journeys/repositories/journey-tracking-repository.js";
import { JOURNEY_TRACKING_STATUS } from "../../../../src/journeys/constants.js";

describe("Integration | Journeys | Repositories | Journey tracking repository", () => {
  describe("#saveTrackingPoint", () => {
    it("should insert and return a tracking point", async () => {
      // given
      const journey = await databaseBuilder.factory.buildPassengerJourney();

      // when
      const point = await saveTrackingPoint({ journeyId: journey.id, journeyType: "passenger", lat: 48.8566, lon: 2.3522 });

      // then
      expect(point).toBeDefined();
      expect(point.journeyId).toBe(journey.id);
      expect(point.journeyType).toBe("passenger");
      expect(Number(point.lat)).toBeCloseTo(48.8566, 3);
      expect(Number(point.lon)).toBeCloseTo(2.3522, 3);
    });
  });

  describe("#findTrackingPointsByJourneyId", () => {
    it("should return all points for a journey ordered chronologically", async () => {
      // given
      const journey = await databaseBuilder.factory.buildPassengerJourney();
      await saveTrackingPoint({ journeyId: journey.id, journeyType: "passenger", lat: 48.0, lon: 2.0 });
      await saveTrackingPoint({ journeyId: journey.id, journeyType: "passenger", lat: 48.1, lon: 2.1 });

      // when
      const points = await findTrackingPointsByJourneyId(journey.id, "passenger");

      // then
      expect(points.length).toBeGreaterThanOrEqual(2);
      expect(points[0].recorded_at <= points[1].recorded_at).toBe(true);
    });

    it("should return an empty array if no points exist for the journey", async () => {
      // given
      const journey = await databaseBuilder.factory.buildPassengerJourney();

      // when
      const points = await findTrackingPointsByJourneyId(journey.id, "passenger");

      // then
      expect(points).toEqual([]);
    });
  });

  describe("#updateJourneyTrackingStatus", () => {
    it("should update trackingStatus on a passenger journey", async () => {
      // given
      const journey = await databaseBuilder.factory.buildPassengerJourney();

      // when
      await updateJourneyTrackingStatus({ journeyId: journey.id, journeyType: "passenger", status: JOURNEY_TRACKING_STATUS.IN_PROGRESS });

      // then
      const updated = await knex("passenger_journeys").where({ id: journey.id }).first();
      expect(updated.trackingStatus).toBe(JOURNEY_TRACKING_STATUS.IN_PROGRESS);
    });

    it("should update trackingStatus on a companion journey", async () => {
      // given
      const journey = await databaseBuilder.factory.buildCompanionJourney();

      // when
      await updateJourneyTrackingStatus({ journeyId: journey.id, journeyType: "companion", status: JOURNEY_TRACKING_STATUS.COMPLETED });

      // then
      const updated = await knex("companion_journeys").where({ id: journey.id }).first();
      expect(updated.trackingStatus).toBe(JOURNEY_TRACKING_STATUS.COMPLETED);
    });
  });

  describe("#findLastTrackingPoint", () => {
    it("should return the most recent tracking point", async () => {
      // given
      const journey = await databaseBuilder.factory.buildPassengerJourney();
      await saveTrackingPoint({ journeyId: journey.id, journeyType: "passenger", lat: 48.0, lon: 2.0 });
      const last = await saveTrackingPoint({ journeyId: journey.id, journeyType: "passenger", lat: 48.9, lon: 2.9 });

      // when
      const point = await findLastTrackingPoint(journey.id, "passenger");

      // then
      expect(point).toBeDefined();
      expect(point.id).toBe(last.id);
    });

    it("should return null if no tracking point exists", async () => {
      // given
      const journey = await databaseBuilder.factory.buildPassengerJourney();

      // when
      const point = await findLastTrackingPoint(journey.id, "passenger");

      // then
      expect(point).toBeNull();
    });
  });
});
