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
});
