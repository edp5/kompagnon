import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import {
  JourneyIsNotOfThisUser,
  JourneyNotFound,
  JourneyNotTravelledYet,
  JourneyWasNotConfirmed,
} from "../../../../src/journeys/errors.js";
import { findReputationOfUser } from "../../../../src/journeys/repositories/journey-reviews-repository.js";
import { getMyJourneyReviewUsecase } from "../../../../src/journeys/usecases/get-my-journey-review-usecase.js";
import { reviewJourneyUsecase } from "../../../../src/journeys/usecases/review-journey-usecase.js";
import { JOURNEY_STATUS } from "../../../../src/shared/constants.js";

const YESTERDAY = new Date(Date.now() - 24 * 3600 * 1000).toISOString();
const TOMORROW = new Date(Date.now() + 24 * 3600 * 1000).toISOString();

/**
 * Builds a match between a fresh passenger and a fresh companion.
 * @param {object} params - How the journey stands.
 * @returns {Promise<object>} The pair, their journeys and the found journey.
 */
async function buildJourney({ passengerStatus = JOURNEY_STATUS.ACCEPTED, companionStatus = JOURNEY_STATUS.ACCEPTED, arrivalTime = YESTERDAY } = {}) {
  const passenger = await databaseBuilder.factory.buildUser();
  const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id, arrivalTime });
  const companion = await databaseBuilder.factory.buildUser();
  const companionJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id, arrivalTime });
  const foundJourney = await databaseBuilder.factory.buildFoundJourney({
    passengerJourneyId: passengerJourney.id,
    companionJourneyId: companionJourney.id,
    passengerStatus,
    companionStatus,
  });

  return { passenger, passengerJourney, companion, companionJourney, foundJourney };
}

describe("Integration | Journeys | Reviews", () => {
  it("should record what one user thought of the other", async () => {
    // given
    const { passenger, foundJourney } = await buildJourney();

    // when
    const review = await reviewJourneyUsecase({
      foundJourneyId: Number(foundJourney.id),
      userId: passenger.id,
      rating: 5,
      comment: "Très rassurant.",
    });

    // then
    expect(review).toMatchObject({ rating: 5, comment: "Très rassurant." });
  });

  it("should rate the other user, not the author", async () => {
    // given
    const { passenger, companion, foundJourney } = await buildJourney();

    // when
    await reviewJourneyUsecase({ foundJourneyId: Number(foundJourney.id), userId: passenger.id, rating: 5 });

    // then
    expect(await findReputationOfUser(companion.id)).toEqual({ average: 5, count: 1 });
    expect(await findReputationOfUser(passenger.id)).toEqual({ average: null, count: 0 });
  });

  it("should average the ratings a user collected", async () => {
    // given
    const companion = await databaseBuilder.factory.buildUser();
    for (const rating of [5, 4]) {
      const passenger = await databaseBuilder.factory.buildUser();
      const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id, arrivalTime: YESTERDAY });
      const companionJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id, arrivalTime: YESTERDAY });
      const foundJourney = await databaseBuilder.factory.buildFoundJourney({
        passengerJourneyId: passengerJourney.id,
        companionJourneyId: companionJourney.id,
        passengerStatus: JOURNEY_STATUS.ACCEPTED,
        companionStatus: JOURNEY_STATUS.ACCEPTED,
      });
      await reviewJourneyUsecase({ foundJourneyId: Number(foundJourney.id), userId: passenger.id, rating });
    }

    // then
    expect(await findReputationOfUser(companion.id)).toEqual({ average: 4.5, count: 2 });
  });

  it("should let the author change their mind rather than review twice", async () => {
    // given
    const { passenger, foundJourney } = await buildJourney();
    await reviewJourneyUsecase({ foundJourneyId: Number(foundJourney.id), userId: passenger.id, rating: 2 });

    // when
    await reviewJourneyUsecase({
      foundJourneyId: Number(foundJourney.id),
      userId: passenger.id,
      rating: 4,
      comment: "Finalement très bien.",
    });

    // then
    const mine = await getMyJourneyReviewUsecase({ foundJourneyId: Number(foundJourney.id), userId: passenger.id });
    expect(mine).toMatchObject({ rating: 4, comment: "Finalement très bien." });
  });

  it("should refuse a journey that has not been travelled yet", async () => {
    // given
    const { passenger, foundJourney } = await buildJourney({ arrivalTime: TOMORROW });

    // when
    const error = await reviewJourneyUsecase({
      foundJourneyId: Number(foundJourney.id),
      userId: passenger.id,
      rating: 5,
    }).catch((caught) => caught);

    // then
    expect(error).toBeInstanceOf(JourneyNotTravelledYet);
  });

  it("should refuse a match the pair never confirmed", async () => {
    // given
    const { passenger, foundJourney } = await buildJourney({ passengerStatus: JOURNEY_STATUS.WAITING });

    // when
    const error = await reviewJourneyUsecase({
      foundJourneyId: Number(foundJourney.id),
      userId: passenger.id,
      rating: 5,
    }).catch((caught) => caught);

    // then
    expect(error).toBeInstanceOf(JourneyWasNotConfirmed);
  });

  it("should refuse someone who was not on the journey", async () => {
    // given
    const { foundJourney } = await buildJourney();
    const stranger = await databaseBuilder.factory.buildUser();

    // when
    const error = await reviewJourneyUsecase({
      foundJourneyId: Number(foundJourney.id),
      userId: stranger.id,
      rating: 1,
    }).catch((caught) => caught);

    // then
    expect(error).toBeInstanceOf(JourneyIsNotOfThisUser);
  });

  it("should refuse a journey that does not exist", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser();

    // when
    const error = await reviewJourneyUsecase({ foundJourneyId: 999999, userId: user.id, rating: 5 })
      .catch((caught) => caught);

    // then
    expect(error).toBeInstanceOf(JourneyNotFound);
  });

  it("should return nothing when the user has not reviewed the journey", async () => {
    // given
    const { passenger, foundJourney } = await buildJourney();

    // when
    const mine = await getMyJourneyReviewUsecase({ foundJourneyId: Number(foundJourney.id), userId: passenger.id });

    // then
    expect(mine).toBeNull();
  });
});
