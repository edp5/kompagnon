import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { createShare } from "../../../../src/journeys/repositories/journey-shares-repository.js";
import { createJourneyShareUsecase } from "../../../../src/journeys/usecases/create-journey-share-usecase.js";
import { getJourneyPositionsUsecase } from "../../../../src/journeys/usecases/get-journey-positions-usecase.js";
import { getSharedJourneyUsecase } from "../../../../src/journeys/usecases/get-shared-journey-usecase.js";
import { recordJourneyPositionUsecase } from "../../../../src/journeys/usecases/record-journey-position-usecase.js";

/**
 * Builds a match between a passenger and a companion.
 * @returns {Promise<{passenger: object, companion: object, foundJourneyId: number}>} Both users and the found journey id.
 */
async function buildMatch() {
  const passenger = await databaseBuilder.factory.buildUser({ firstname: "Alice" });
  const companion = await databaseBuilder.factory.buildUser({ firstname: "Bob" });
  const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({
    userId: passenger.id,
    departureAddress: "12 Rue de Rivoli",
    arrivalAddress: "Gare de Lyon",
  });
  const companionJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id });
  const foundJourney = await databaseBuilder.factory.buildFoundJourney({
    passengerJourneyId: passengerJourney.id,
    companionJourneyId: companionJourney.id,
  });
  return { passenger, companion, foundJourneyId: Number(foundJourney.id) };
}

describe("Integration | Journeys | Usecases | Following a journey", () => {
  describe("positions", () => {
    it("should keep only the latest position of each participant", async () => {
      // given
      const { passenger, companion, foundJourneyId } = await buildMatch();
      await recordJourneyPositionUsecase({ foundJourneyId, userId: passenger.id, lat: 48.85, lon: 2.35 });
      await recordJourneyPositionUsecase({ foundJourneyId, userId: passenger.id, lat: 48.86, lon: 2.36 });
      await recordJourneyPositionUsecase({ foundJourneyId, userId: companion.id, lat: 48.87, lon: 2.34 });

      // when
      const positions = await getJourneyPositionsUsecase({ foundJourneyId, userId: passenger.id });

      // then
      expect(positions).toHaveLength(2);
      const mine = positions.find((position) => position.mine);
      expect(Number(mine.lat)).toBeCloseTo(48.86);
      const theirs = positions.find((position) => !position.mine);
      expect(theirs.firstname).toBe("Bob");
    });

    it("should refuse a position from someone outside the journey", async () => {
      // given
      const { foundJourneyId } = await buildMatch();
      const stranger = await databaseBuilder.factory.buildUser();

      // when / then
      await expect(
        recordJourneyPositionUsecase({ foundJourneyId, userId: stranger.id, lat: 48.85, lon: 2.35 }),
      ).rejects.toThrow("Journey is not of this user");
    });

    it("should refuse to reveal positions to someone outside the journey", async () => {
      // given
      const { foundJourneyId } = await buildMatch();
      const stranger = await databaseBuilder.factory.buildUser();

      // when / then
      await expect(
        getJourneyPositionsUsecase({ foundJourneyId, userId: stranger.id }),
      ).rejects.toThrow("Journey is not of this user");
    });
  });

  describe("share link", () => {
    it("should create a link that expires", async () => {
      // given
      const { passenger, foundJourneyId } = await buildMatch();

      // when
      const share = await createJourneyShareUsecase({ foundJourneyId, userId: passenger.id });

      // then
      expect(share.token).toMatch(/^[0-9a-f]{48}$/);
      expect(share.url).toContain(share.token);
      expect(new Date(share.expiresAt).getTime()).toBeGreaterThan(Date.now());
    });

    it("should refuse to share a journey the user is not part of", async () => {
      // given
      const { foundJourneyId } = await buildMatch();
      const stranger = await databaseBuilder.factory.buildUser();

      // when / then
      await expect(
        createJourneyShareUsecase({ foundJourneyId, userId: stranger.id }),
      ).rejects.toThrow("Journey is not of this user");
    });

    it("should let anyone holding the link follow the journey", async () => {
      // given
      const { passenger, companion, foundJourneyId } = await buildMatch();
      await recordJourneyPositionUsecase({ foundJourneyId, userId: companion.id, lat: 48.87, lon: 2.34 });
      const { token } = await createJourneyShareUsecase({ foundJourneyId, userId: passenger.id });

      // when
      const shared = await getSharedJourneyUsecase({ token });

      // then
      expect(shared.journey.departureAddress).toBe("12 Rue de Rivoli");
      expect(shared.journey.arrivalAddress).toBe("Gare de Lyon");
      expect(shared.positions).toHaveLength(1);
      expect(shared.positions[0].firstname).toBe("Bob");
    });

    it("should never expose contact details through the link", async () => {
      // given
      const { passenger, foundJourneyId } = await buildMatch();
      const { token } = await createJourneyShareUsecase({ foundJourneyId, userId: passenger.id });

      // when
      const shared = await getSharedJourneyUsecase({ token });

      // then
      const serialised = JSON.stringify(shared);
      expect(serialised).not.toMatch(/email/i);
      expect(serialised).not.toMatch(/phoneNumber/i);
      expect(serialised).not.toMatch(/lastname/i);
    });

    it("should refuse an unknown link", async () => {
      await expect(getSharedJourneyUsecase({ token: "0".repeat(48) })).rejects.toThrow(
        "Share link is invalid or expired",
      );
    });

    it("should refuse an expired link", async () => {
      // given
      const { passenger, foundJourneyId } = await buildMatch();
      await createShare({
        foundJourneyId,
        createdBy: passenger.id,
        token: "a".repeat(48),
        expiresAt: new Date(Date.now() - 1000),
      });

      // when / then
      await expect(getSharedJourneyUsecase({ token: "a".repeat(48) })).rejects.toThrow(
        "Share link is invalid or expired",
      );
    });

    it("should refuse a link once it is past its expiry, checked against the given time", async () => {
      // given
      const { passenger, foundJourneyId } = await buildMatch();
      const { token, expiresAt } = await createJourneyShareUsecase({ foundJourneyId, userId: passenger.id });
      const afterExpiry = new Date(new Date(expiresAt).getTime() + 1000);

      // when / then
      await expect(getSharedJourneyUsecase({ token, now: afterExpiry })).rejects.toThrow(
        "Share link is invalid or expired",
      );
    });
  });
});
