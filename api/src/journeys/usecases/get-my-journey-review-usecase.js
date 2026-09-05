import { findReviewByAuthor } from "../repositories/journey-reviews-repository.js";
import { findFoundJourneyOfUser } from "../utils/find-found-journey-of-user.js";

/**
 * The review the user already left on this journey, so the app can offer to
 * change it rather than asking again as if nothing had been said.
 * @param {object} params - The lookup parameters.
 * @param {number} params.foundJourneyId - The journey.
 * @param {number} params.userId - The user asking.
 * @throws {JourneyNotFound} When the journey does not exist.
 * @throws {JourneyIsNotOfThisUser} When the user is not one of its participants.
 * @returns {Promise<object|null>} The review, or null when none was written.
 */
async function getMyJourneyReviewUsecase({ foundJourneyId, userId }) {
  await findFoundJourneyOfUser({ foundJourneyId, userId });

  const review = await findReviewByAuthor({ foundJourneyId, authorId: userId });
  if (!review) {
    return null;
  }

  return {
    rating: review.rating,
    comment: review.comment,
    updatedAt: review.updated_at,
  };
}

export { getMyJourneyReviewUsecase };
