import { callMatchingAlgorithmService } from "../services/call-matching-algorithm-service.js";
import { acceptFoundJourneyCompanionStatusUsecase } from "./accept-found-journey-companion-status-usecase.js";
import { acceptFoundJourneyPassengerStatusUsecase } from "./accept-found-journey-passenger-status-usecase.js";
import { addTrackingPointUsecase } from "./add-tracking-point-usecase.js";
import { cancelFoundJourneyCompanionStatusUsecase } from "./cancel-found-journey-companion-status-usecase.js";
import { cancelFoundJourneyPassengerStatusUsecase } from "./cancel-found-journey-passenger-status-usecase.js";
import { getCompanionJourneyUsecase } from "./get-companion-journey-usecase.js";
import { getCompanionJourneysUsecase } from "./get-companion-journeys-usecase.js";
import { getJourneyMatchesUsecase } from "./get-journey-matches-usecase.js";
import { getPassengerJourneyUsecase } from "./get-passenger-journey-usecase.js";
import { getPassengerJourneysUsecase } from "./get-passenger-journeys-usecase.js";
import { getTrackingPointsUsecase } from "./get-tracking-points-usecase.js";
import { recordCompanionJourneyUsecase } from "./record-companion-journey-usecase.js";
import { recordPassengerJourneyUsecase } from "./record-passenger-journey-usecase.js";
import { rejectFoundJourneyCompanionStatusUsecase } from "./reject-found-journey-companion-status-usecase.js";
import { rejectFoundJourneyPassengerStatusUsecase } from "./reject-found-journey-passenger-status-usecase.js";
import { updateJourneyStatusUsecase } from "./update-journey-status-usecase.js";

const usecases = {
  acceptFoundJourneyCompanionStatusUsecase,
  acceptFoundJourneyPassengerStatusUsecase,
  addTrackingPointUsecase,
  callMatchingAlgorithmUsecase: callMatchingAlgorithmService,
  cancelFoundJourneyCompanionStatusUsecase,
  cancelFoundJourneyPassengerStatusUsecase,
  getCompanionJourneyUsecase,
  getCompanionJourneysUsecase,
  getJourneyMatchesUsecase,
  getPassengerJourneyUsecase,
  getPassengerJourneysUsecase,
  getTrackingPointsUsecase,
  recordCompanionJourneyUsecase,
  recordPassengerJourneyUsecase,
  rejectFoundJourneyCompanionStatusUsecase,
  rejectFoundJourneyPassengerStatusUsecase,
  updateJourneyStatusUsecase,
};

export default usecases;
