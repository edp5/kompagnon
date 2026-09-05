import { JOURNEY_STATUS } from "../../shared/constants.js";
import { JourneyNotTravelledYet, JourneyWasNotConfirmed } from "../errors.js";
import { findJourneyById as findCompanionJourneyById } from "../repositories/companion-users-repository.js";
import { saveReview } from "../repositories/journey-reviews-repository.js";
import { findJourneyById as findPassengerJourneyById } from "../repositories/passenger-users-repository.js";
import { findFoundJourneyOfUser } from "../utils/find-found-journey-of-user.js";

/**
 * Records what one participant thought of the other, once the trip is over.
 *
 * Reviewing is only open on a journey the pair actually travelled: a match that
 * was never confirmed, or a trip that has not happened yet, cannot be rated.
 * Otherwise a reputation could be built out of journeys nobody made.
 *
 * @param {object} params - The review.
 * @param {number} params.foundJourneyId - The journey being reviewed.
 * @param {number} params.userId - The user writing it.
 * @param {number} params.rating - One to five.
 * @param {string|null} [params.comment] - What they wanted to add.
 * @param {Date} [params.now] - Current time, injected for tests.
 * @throws {JourneyNotFound} When the journey does not exist.
 * @throws {JourneyIsNotOfThisUser} When the user is not one of its two participants.
 * @throws {JourneyWasNotConfirmed} When the pair never both accepted.
 * @throws {JourneyNotTravelledYet} When the journey has not happened yet.
 * @returns {Promise<object>} The stored review.
 */
async function reviewJourneyUsecase({ foundJourneyId, userId, rating, comment = null, now = new Date() }) {
  const foundJourney = await findFoundJourneyOfUser({ foundJourneyId, userId });

  const confirmed =
    foundJourney.passengerStatus === JOURNEY_STATUS.ACCEPTED &&
    foundJourney.companionStatus === JOURNEY_STATUS.ACCEPTED;
  if (!confirmed) {
    throw new JourneyWasNotConfirmed();
  }

  const [passengerJourney, companionJourney] = await Promise.all([
    findPassengerJourneyById(foundJourney.passengerJourneyId),
    findCompanionJourneyById(foundJourney.companionJourneyId),
  ]);

  const arrival = new Date(passengerJourney?.arrivalTime ?? companionJourney?.arrivalTime);
  if (isNaN(arrival.getTime()) || arrival > now) {
    throw new JourneyNotTravelledYet();
  }

  const subjectId =
    passengerJourney?.userId === userId ? companionJourney?.userId : passengerJourney?.userId;

  return saveReview({ foundJourneyId, authorId: userId, subjectId, rating, comment });
}

export { reviewJourneyUsecase };
