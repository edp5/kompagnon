import { saveJourney } from "../repositories/companion-users-repository.js";
import { recordJourneyUsecase } from "./record-journey-usecase.js";

async function recordCompanionJourneyUsecase({ userId, departureTime, arrivalTime, departureAddress, arrivalAddress, departureLon = null, departureLat = null, arrivalLon = null, arrivalLat = null }) {
  return await recordJourneyUsecase(saveJourney, { userId, departureTime, arrivalTime, departureAddress, arrivalAddress, departureLon, departureLat, arrivalLon, arrivalLat });
}

export { recordCompanionJourneyUsecase };
