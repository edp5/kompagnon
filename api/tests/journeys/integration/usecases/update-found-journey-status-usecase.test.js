import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import { JourneyIsNotOfThisUser, JourneyNotFound, UserHasNoRole } from "../../../../src/journeys/errors.js";
import { updateFoundJourneyStatusUsecase } from "../../../../src/journeys/usecases/update-found-journey-status-usecase.js";
import { JOURNEY_STATUS, USER_ROLE } from "../../../../src/shared/constants.js";

describe("Integration | Journey | Usecase | Update found journey status usecase", () => {
  describe("Passenger (invalid role)", () => {
    it("should accept passenger found journey status when updatedStatus is true", async () => {
      // given
      const passenger = await databaseBuilder.factory.buildUser({ role: USER_ROLE.INVALID });
      const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id });
      const foundJourney = await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: passengerJourney.id });

      // when
      await updateFoundJourneyStatusUsecase({
        userId: passenger.id,
        foundJourneyId: foundJourney.id,
        updatedStatus: true,
      });

      // then
      const updatedFoundJourney = await knex("found_journeys").where({ id: foundJourney.id }).first();
      expect(updatedFoundJourney.passengerStatus).toBe(JOURNEY_STATUS.ACCEPTED);
    });

    it("should reject passenger found journey status when updatedStatus is false", async () => {
      // given
      const passenger = await databaseBuilder.factory.buildUser({ role: USER_ROLE.INVALID });
      const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id });
      const foundJourney = await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: passengerJourney.id });

      // when
      await updateFoundJourneyStatusUsecase({
        userId: passenger.id,
        foundJourneyId: foundJourney.id,
        updatedStatus: false,
      });

      // then
      const updatedFoundJourney = await knex("found_journeys").where({ id: foundJourney.id }).first();
      expect(updatedFoundJourney.passengerStatus).toBe(JOURNEY_STATUS.REJECTED);
    });
  });

  describe("Companion (valid role)", () => {
    it("should accept companion found journey status when updatedStatus is true", async () => {
      // given
      const companion = await databaseBuilder.factory.buildUser({ role: USER_ROLE.VALID });
      const companionJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id });
      const foundJourney = await databaseBuilder.factory.buildFoundJourney({ companionJourneyId: companionJourney.id });

      // when
      await updateFoundJourneyStatusUsecase({
        userId: companion.id,
        foundJourneyId: foundJourney.id,
        updatedStatus: true,
      });

      // then
      const updatedFoundJourney = await knex("found_journeys").where({ id: foundJourney.id }).first();
      expect(updatedFoundJourney.companionStatus).toBe(JOURNEY_STATUS.ACCEPTED);
    });

    it("should reject companion found journey status when updatedStatus is false", async () => {
      // given
      const companion = await databaseBuilder.factory.buildUser({ role: USER_ROLE.VALID });
      const companionJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id });
      const foundJourney = await databaseBuilder.factory.buildFoundJourney({ companionJourneyId: companionJourney.id });

      // when
      await updateFoundJourneyStatusUsecase({
        userId: companion.id,
        foundJourneyId: foundJourney.id,
        updatedStatus: false,
      });

      // then
      const updatedFoundJourney = await knex("found_journeys").where({ id: foundJourney.id }).first();
      expect(updatedFoundJourney.companionStatus).toBe(JOURNEY_STATUS.REJECTED);
    });
  });

  describe("Error cases", () => {
    it("should throw UserHasNoRole when user has no role", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();

      // when / then
      await expect(
        updateFoundJourneyStatusUsecase({
          userId: user.id,
          foundJourneyId: 1,
          updatedStatus: true,
        }),
      ).rejects.toThrow(UserHasNoRole);
    });

    it("should throw JourneyNotFound when found journey does not exist", async () => {
      // given
      const companion = await databaseBuilder.factory.buildUser({ role: USER_ROLE.VALID });

      // when / then
      await expect(
        updateFoundJourneyStatusUsecase({
          userId: companion.id,
          foundJourneyId: 999999,
          updatedStatus: true,
        }),
      ).rejects.toThrow(JourneyNotFound);
    });

    it("should throw JourneyIsNotOfThisUser when journey belongs to another user", async () => {
      // given
      const companion1 = await databaseBuilder.factory.buildUser({ role: USER_ROLE.VALID });
      const companion2 = await databaseBuilder.factory.buildUser({ role: USER_ROLE.VALID });
      const companionJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: companion1.id });
      const foundJourney = await databaseBuilder.factory.buildFoundJourney({ companionJourneyId: companionJourney.id });

      // when / then
      await expect(
        updateFoundJourneyStatusUsecase({
          userId: companion2.id,
          foundJourneyId: foundJourney.id,
          updatedStatus: true,
        }),
      ).rejects.toThrow(JourneyIsNotOfThisUser);
    });
  });
});
