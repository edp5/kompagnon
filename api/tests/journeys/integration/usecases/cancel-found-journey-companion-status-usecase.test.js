import { describe, expect, it, suite } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import {
  AlreadyAccepted, AlreadyCancelled,
  AlreadyRejected,
  JourneyIsNotOfThisUser,
  JourneyNotFound,
} from "../../../../src/journeys/errors.js";
import usecases from "../../../../src/journeys/usecases/index.js";
import { JOURNEY_STATUS } from "../../../../src/shared/constants.js";

describe("Integration | Journeys | Usecases | Cancel found journey companion status", () => {
  describe("success case", () => {
    it(`should update status of found journey with ${JOURNEY_STATUS.CANCELLED}`, async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const journey = await databaseBuilder.factory.buildCompanionJourney({ userId: user.id });
      const foundJourney = await databaseBuilder.factory.buildFoundJourney({ companionJourneyId: journey.id, companionStatus: JOURNEY_STATUS.WAITING });

      // when
      await usecases.cancelFoundJourneyCompanionStatusUsecase({ userId: user.id, foundJourneyId: foundJourney.id });

      // then
      const updatedFoundJourney = await knex("found_journeys").where({ id: foundJourney.id }).first();
      expect(updatedFoundJourney.companionStatus).toBe(JOURNEY_STATUS.CANCELLED);
    });
  });

  describe("error cases", () => {
    it("should throw a journey not found error", async () => {
      // given
      const foundJourneyId = 123;

      // when
      const result = usecases.cancelFoundJourneyCompanionStatusUsecase({ foundJourneyId });

      // then
      await expect(result).rejects.toThrow(JourneyNotFound);
    });

    it("should throw an error if journey is not of user", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const journey = await databaseBuilder.factory.buildCompanionJourney({ userId: user.id });
      const foundJourney = await databaseBuilder.factory.buildFoundJourney({ companionJourneyId: journey.id });
      const fakeUserId = 123;

      // when
      const result = usecases.cancelFoundJourneyCompanionStatusUsecase({ userId: fakeUserId, foundJourneyId: foundJourney.id });

      // then
      await expect(result).rejects.toThrow(JourneyIsNotOfThisUser);
      const updatedFoundJourney = await knex("found_journeys").where({ id: foundJourney.id }).first();
      expect(updatedFoundJourney.companionStatus).toBe(JOURNEY_STATUS.WAITING);
    });

    suite("when a found journey status is already accepted or rejected", () => {
      it("should throw an error if journey is already accepted", async () => {
        // given
        const user = await databaseBuilder.factory.buildUser();
        const journey = await databaseBuilder.factory.buildCompanionJourney({ userId: user.id });
        const foundJourney = await databaseBuilder.factory.buildFoundJourney({ companionJourneyId: journey.id, companionStatus: JOURNEY_STATUS.ACCEPTED });

        // when
        const result = usecases.cancelFoundJourneyCompanionStatusUsecase({ userId: user.id, foundJourneyId: foundJourney.id });

        // then
        await expect(result).rejects.toThrow(AlreadyAccepted);
      });

      it("should throw an error if journey is already rejected", async () => {
        // given
        const user = await databaseBuilder.factory.buildUser();
        const journey = await databaseBuilder.factory.buildCompanionJourney({ userId: user.id });
        const foundJourney = await databaseBuilder.factory.buildFoundJourney({ companionJourneyId: journey.id, companionStatus: JOURNEY_STATUS.REJECTED });

        // when
        const result = usecases.cancelFoundJourneyCompanionStatusUsecase({ userId: user.id, foundJourneyId: foundJourney.id });

        // then
        await expect(result).rejects.toThrow(AlreadyRejected);
      });

      it("should throw an error if journey is already cancelled", async () => {
        // given
        const user = await databaseBuilder.factory.buildUser();
        const journey = await databaseBuilder.factory.buildCompanionJourney({ userId: user.id });
        const foundJourney = await databaseBuilder.factory.buildFoundJourney({ companionJourneyId: journey.id, companionStatus: JOURNEY_STATUS.CANCELLED });

        // when
        const result = usecases.cancelFoundJourneyCompanionStatusUsecase({ userId: user.id, foundJourneyId: foundJourney.id });

        // then
        await expect(result).rejects.toThrow(AlreadyCancelled);
      });
    });
  });
});
