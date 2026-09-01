import { describe, expect, it, vi } from "vitest";

import {
  FoundJourneyNotFound,
  InvalidRatingError,
  JourneyNotCompletedError,
  ReviewAlreadySubmittedError,
  UserNotParticipantError,
} from "../../../../src/journeys/errors.js";
import { createReviewUsecase } from "../../../../src/journeys/usecases/create-review-usecase.js";
import { JOURNEY_STATUS } from "../../../../src/shared/constants.js";

describe("Unit | Journeys | Usecases | Create review usecase", () => {
  it("should throw InvalidRatingError when rating is less than 1 or greater than 5 or not an integer", async () => {
    // given
    const invalidRatings = [0, 6, 2.5, "abc", -1];

    for (const rating of invalidRatings) {
      await expect(
        createReviewUsecase({
          foundJourneyId: 1,
          authorId: 10,
          rating,
        }),
      ).rejects.toThrow(InvalidRatingError);
    }
  });

  it("should throw FoundJourneyNotFound when found journey does not exist", async () => {
    // given
    const findJourneyMock = vi.fn().mockResolvedValue(null);

    // when & then
    await expect(
      createReviewUsecase({
        foundJourneyId: 999,
        authorId: 10,
        rating: 5,
        findJourney: findJourneyMock,
      }),
    ).rejects.toThrow(FoundJourneyNotFound);
  });

  it("should throw JourneyNotCompletedError when journey is not in COMPLETED status", async () => {
    // given
    const findJourneyMock = vi.fn().mockResolvedValue({
      id: 1,
      companionUserId: 10,
      passengerUserId: 20,
      companionStatus: JOURNEY_STATUS.ACCEPTED,
      passengerStatus: JOURNEY_STATUS.ACCEPTED,
    });

    // when & then
    await expect(
      createReviewUsecase({
        foundJourneyId: 1,
        authorId: 10,
        rating: 5,
        findJourney: findJourneyMock,
      }),
    ).rejects.toThrow(JourneyNotCompletedError);
  });

  it("should throw UserNotParticipantError when author is neither companion nor passenger", async () => {
    // given
    const findJourneyMock = vi.fn().mockResolvedValue({
      id: 1,
      companionUserId: 10,
      passengerUserId: 20,
      companionStatus: JOURNEY_STATUS.COMPLETED,
      passengerStatus: JOURNEY_STATUS.COMPLETED,
    });

    // when & then
    await expect(
      createReviewUsecase({
        foundJourneyId: 1,
        authorId: 99,
        rating: 5,
        findJourney: findJourneyMock,
      }),
    ).rejects.toThrow(UserNotParticipantError);
  });

  it("should throw ReviewAlreadySubmittedError when author has already reviewed this journey", async () => {
    // given
    const findJourneyMock = vi.fn().mockResolvedValue({
      id: 1,
      companionUserId: 10,
      passengerUserId: 20,
      companionStatus: JOURNEY_STATUS.COMPLETED,
      passengerStatus: JOURNEY_STATUS.COMPLETED,
    });
    const hasReviewedMock = vi.fn().mockResolvedValue(true);

    // when & then
    await expect(
      createReviewUsecase({
        foundJourneyId: 1,
        authorId: 10,
        rating: 5,
        findJourney: findJourneyMock,
        hasReviewed: hasReviewedMock,
      }),
    ).rejects.toThrow(ReviewAlreadySubmittedError);
  });

  it("should save review with targetUserId as passenger when companion submits review", async () => {
    // given
    const findJourneyMock = vi.fn().mockResolvedValue({
      id: 1,
      companionUserId: 10,
      passengerUserId: 20,
      companionStatus: JOURNEY_STATUS.COMPLETED,
      passengerStatus: JOURNEY_STATUS.COMPLETED,
    });
    const hasReviewedMock = vi.fn().mockResolvedValue(false);
    const saveMock = vi.fn().mockResolvedValue({
      id: 100,
      foundJourneyId: 1,
      authorId: 10,
      targetUserId: 20,
      rating: 5,
      comment: "Super !",
    });

    // when
    const result = await createReviewUsecase({
      foundJourneyId: 1,
      authorId: 10,
      rating: 5,
      comment: "Super !",
      findJourney: findJourneyMock,
      hasReviewed: hasReviewedMock,
      save: saveMock,
    });

    // then
    expect(saveMock).toHaveBeenCalledWith({
      foundJourneyId: 1,
      authorId: 10,
      targetUserId: 20,
      rating: 5,
      comment: "Super !",
    });
    expect(result).toEqual({
      id: 100,
      foundJourneyId: 1,
      authorId: 10,
      targetUserId: 20,
      rating: 5,
      comment: "Super !",
    });
  });

  it("should save review with targetUserId as companion when passenger submits review", async () => {
    // given
    const findJourneyMock = vi.fn().mockResolvedValue({
      id: 1,
      companionUserId: 10,
      passengerUserId: 20,
      companionStatus: JOURNEY_STATUS.COMPLETED,
      passengerStatus: JOURNEY_STATUS.ACCEPTED,
    });
    const hasReviewedMock = vi.fn().mockResolvedValue(false);
    const saveMock = vi.fn().mockResolvedValue({
      id: 101,
      foundJourneyId: 1,
      authorId: 20,
      targetUserId: 10,
      rating: 4,
      comment: null,
    });

    // when
    const result = await createReviewUsecase({
      foundJourneyId: 1,
      authorId: 20,
      rating: 4,
      findJourney: findJourneyMock,
      hasReviewed: hasReviewedMock,
      save: saveMock,
    });

    // then
    expect(saveMock).toHaveBeenCalledWith({
      foundJourneyId: 1,
      authorId: 20,
      targetUserId: 10,
      rating: 4,
      comment: null,
    });
    expect(result.id).toBe(101);
  });
});
