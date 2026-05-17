import { saveJourney } from "../repositories/passenger-users-repository.js";
import { recordJourneyUsecase } from "./record-journey-usecase.js";

async function recordPassengerJourneyUsecase({ userId, departureTime, arrivalTime, departureAddress, arrivalAddress, departureLon = null, departureLat = null, arrivalLon = null, arrivalLat = null }) {
  return await recordJourneyUsecase(saveJourney, { userId, departureTime, arrivalTime, departureAddress, arrivalAddress, departureLon, departureLat, arrivalLon, arrivalLat });
}

export { recordPassengerJourneyUsecase };
