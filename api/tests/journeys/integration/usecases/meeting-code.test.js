import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { getCompanionJourneyMatchesUsecase } from "../../../../src/journeys/usecases/get-companion-journey-matches-usecase.js";
import { getPassengerJourneyMatchesUsecase } from "../../../../src/journeys/usecases/get-passenger-journey-matches-usecase.js";
import { JOURNEY_STATUS } from "../../../../src/shared/constants.js";

/**
 * Builds a match between a fresh passenger and a fresh companion.
 * @param {object} statuses - The status of each side.
 * @returns {Promise<object>} The two journeys and their users.
 */
async function buildMatch({ passengerStatus, companionStatus }) {
  const passenger = await databaseBuilder.factory.buildUser();
  const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id });
  const companion = await databaseBuilder.factory.buildUser();
  const companionJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id });
  await databaseBuilder.factory.buildFoundJourney({
    passengerJourneyId: passengerJourney.id,
    companionJourneyId: companionJourney.id,
    passengerStatus,
    companionStatus,
  });

  return { passenger, passengerJourney, companion, companionJourney };
}

describe("Integration | Journeys | Meeting code", () => {
  it("should give both users the same code once they both accepted", async () => {
    // given
    const { passenger, passengerJourney, companion, companionJourney } = await buildMatch({
      passengerStatus: JOURNEY_STATUS.ACCEPTED,
      companionStatus: JOURNEY_STATUS.ACCEPTED,
    });

    // when
    const [passengerSide] = await getPassengerJourneyMatchesUsecase({
      journeyId: Number(passengerJourney.id),
      userId: passenger.id,
    });
    const [companionSide] = await getCompanionJourneyMatchesUsecase({
      journeyId: Number(companionJourney.id),
      userId: companion.id,
    });

    // then
    expect(passengerSide.meetingCode).toMatch(/^\d{4}$/);
    expect(companionSide.meetingCode).toBe(passengerSide.meetingCode);
  });

  it("should withhold the code while the match is only suggested", async () => {
    // given
    const { passenger, passengerJourney } = await buildMatch({
      passengerStatus: JOURNEY_STATUS.WAITING,
      companionStatus: JOURNEY_STATUS.WAITING,
    });

    // when
    const [match] = await getPassengerJourneyMatchesUsecase({
      journeyId: Number(passengerJourney.id),
      userId: passenger.id,
    });

    // then
    expect(match.meetingCode).toBeNull();
  });

  it("should withhold the code while only one side has accepted", async () => {
    // given
    const { passenger, passengerJourney } = await buildMatch({
      passengerStatus: JOURNEY_STATUS.ACCEPTED,
      companionStatus: JOURNEY_STATUS.WAITING,
    });

    // when
    const [match] = await getPassengerJourneyMatchesUsecase({
      journeyId: Number(passengerJourney.id),
      userId: passenger.id,
    });

    // then
    expect(match.meetingCode).toBeNull();
  });

  it("should give a different code to another journey", async () => {
    // given
    const first = await buildMatch({
      passengerStatus: JOURNEY_STATUS.ACCEPTED,
      companionStatus: JOURNEY_STATUS.ACCEPTED,
    });
    const second = await buildMatch({
      passengerStatus: JOURNEY_STATUS.ACCEPTED,
      companionStatus: JOURNEY_STATUS.ACCEPTED,
    });

    // when
    const [firstMatch] = await getPassengerJourneyMatchesUsecase({
      journeyId: Number(first.passengerJourney.id),
      userId: first.passenger.id,
    });
    const [secondMatch] = await getPassengerJourneyMatchesUsecase({
      journeyId: Number(second.passengerJourney.id),
      userId: second.passenger.id,
    });

    // then
    expect(firstMatch.meetingCode).toMatch(/^\d{4}$/);
    expect(secondMatch.meetingCode).toMatch(/^\d{4}$/);
  });
});
