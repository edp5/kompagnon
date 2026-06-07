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

describe("Integration | Journeys | Usecases | Cancel found journey passenger status", () => {
  describe("success case", () => {
    it(`should update status of found journey with ${JOURNEY_STATUS.CANCELLED}`, async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const journey = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });
      const foundJourney = await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: journey.id, passengerStatus: JOURNEY_STATUS.WAITING });

      // when
      await usecases.cancelFoundJourneyPassengerStatusUsecase({ userId: user.id, foundJourneyId: foundJourney.id });

      // then
      const updatedFoundJourney = await knex("found_journeys").where({ id: foundJourney.id }).first();
      expect(updatedFoundJourney.passengerStatus).toBe(JOURNEY_STATUS.CANCELLED);
    });
  });

  describe("error cases", () => {
    it("should throw an error for not found journey", async () => {
      // given
      const foundJourneyId = 123;

      // when
      const result = usecases.cancelFoundJourneyPassengerStatusUsecase({ foundJourneyId });

      // then
      await expect(result).rejects.toThrow(JourneyNotFound);
    });

    it("should throw an error if journey is not of user", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const journey = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });
      const foundJourney = await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: journey.id });
      const fakeUserId = 123;

      // when
      const result = usecases.cancelFoundJourneyPassengerStatusUsecase({ userId: fakeUserId, foundJourneyId: foundJourney.id });

      // then
      await expect(result).rejects.toThrow(JourneyIsNotOfThisUser);
      const updatedFoundJourney = await knex("found_journeys").where({ id: foundJourney.id }).first();
      expect(updatedFoundJourney.passengerStatus).toBe(JOURNEY_STATUS.WAITING);
    });

    suite("when a found journey status is already accepted or rejected", () => {
      it("should throw an error if journey is already accepted", async () => {
        // given
        const user = await databaseBuilder.factory.buildUser();
        const journey = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });
        const foundJourney = await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: journey.id, passengerStatus: JOURNEY_STATUS.ACCEPTED });

        // when
        const result = usecases.cancelFoundJourneyPassengerStatusUsecase({ userId: user.id, foundJourneyId: foundJourney.id });

        // then
        await expect(result).rejects.toThrow(AlreadyAccepted);
      });

      it("should throw an error if journey is already rejected", async () => {
        // given
        const user = await databaseBuilder.factory.buildUser();
        const journey = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });
        const foundJourney = await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: journey.id, passengerStatus: JOURNEY_STATUS.REJECTED });

        // when
        const result = usecases.cancelFoundJourneyPassengerStatusUsecase({ userId: user.id, foundJourneyId: foundJourney.id });

        // then
        await expect(result).rejects.toThrow(AlreadyRejected);
      });

      it("should throw an error if journey is already cancelled", async () => {
        // given
        const user = await databaseBuilder.factory.buildUser();
        const journey = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });
        const foundJourney = await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: journey.id, passengerStatus: JOURNEY_STATUS.CANCELLED });

        // when
        const result = usecases.cancelFoundJourneyPassengerStatusUsecase({ userId: user.id, foundJourneyId: foundJourney.id });

        // then
        await expect(result).rejects.toThrow(AlreadyCancelled);
      });
    });
  });
});
