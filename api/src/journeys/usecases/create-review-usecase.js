import { JOURNEY_STATUS } from "../../shared/constants.js";
import {
  FoundJourneyNotFound,
  InvalidRatingError,
  JourneyNotCompletedError,
  ReviewAlreadySubmittedError,
  UserNotParticipantError,
} from "../errors.js";
import {
  findFoundJourneyWithParticipants,
  hasUserReviewedFoundJourney,
  saveReview,
} from "../repositories/reviews-repository.js";

/**
 * Creates a review for a completed found journey
 * @param {object} params - Parameters
 * @param {number} params.foundJourneyId - The found journey ID
 * @param {number} params.authorId - The ID of the reviewing user
 * @param {number} params.rating - The star rating (1-5)
 * @param {string} [params.comment] - Optional text comment
 * @param {Function} [params.findJourney] - Repository function to find journey
 * @param {Function} [params.hasReviewed] - Repository function to check existing review
 * @param {Function} [params.save] - Repository function to persist review
 * @returns {Promise<object>} The created review
 */
async function createReviewUsecase({
  foundJourneyId,
  authorId,
  rating,
  comment = null,
  findJourney = findFoundJourneyWithParticipants,
  hasReviewed = hasUserReviewedFoundJourney,
  save = saveReview,
}) {
  const numericRating = Number(rating);
  if (!Number.isInteger(numericRating) || numericRating < 1 || numericRating > 5) {
    throw new InvalidRatingError();
  }

  const journey = await findJourney(foundJourneyId);
  if (!journey) {
    throw new FoundJourneyNotFound();
  }

  const isCompletedOrConfirmed =
    (journey.companionStatus === JOURNEY_STATUS.ACCEPTED &&
      journey.passengerStatus === JOURNEY_STATUS.ACCEPTED) ||
    journey.companionStatus === JOURNEY_STATUS.COMPLETED ||
    journey.passengerStatus === JOURNEY_STATUS.COMPLETED;

  if (!isCompletedOrConfirmed) {
    throw new JourneyNotCompletedError();
  }

  const isCompanion = Number(journey.companionUserId) === Number(authorId);
  const isPassenger = Number(journey.passengerUserId) === Number(authorId);

  if (!isCompanion && !isPassenger) {
    throw new UserNotParticipantError();
  }

  const targetUserId = isCompanion ? journey.passengerUserId : journey.companionUserId;

  const alreadyReviewed = await hasReviewed({ foundJourneyId, authorId });
  if (alreadyReviewed) {
    throw new ReviewAlreadySubmittedError();
  }

  try {
    return await save({
      foundJourneyId,
      authorId,
      targetUserId,
      rating: numericRating,
      comment,
    });
  } catch (error) {
    if (error?.code === "23505" || error?.constraint === "reviews_found_journey_author_unique") {
      throw new ReviewAlreadySubmittedError();
    }
    throw error;
  }
}

export { createReviewUsecase };
