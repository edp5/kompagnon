import { MATCHING_ROLE } from "../infrastructure/matching-algorithm-api.js";
import { saveJourney } from "../repositories/companion-users-repository.js";
import { callMatchingAlgorithmUsecase } from "./call-matching-algorithm-usecase.js";
import { recordJourneyUsecase } from "./record-journey-usecase.js";

async function recordCompanionJourneyUsecase({ userId, departureTime, arrivalTime, departureAddress, arrivalAddress, departureLon = null, departureLat = null, arrivalLon = null, arrivalLat = null }) {
  const recordedJourney = await recordJourneyUsecase(saveJourney, { userId, departureTime, arrivalTime, departureAddress, arrivalAddress, departureLon, departureLat, arrivalLon, arrivalLat });
  await callMatchingAlgorithmUsecase({ journeyId: recordedJourney.journeyId, role: MATCHING_ROLE.COMPANION });
  return recordedJourney;
}

export { recordCompanionJourneyUsecase };
