import { callMatchingAlgorithmService } from "../services/call-matching-algorithm-service.js";
import { acceptFoundJourneyCompanionStatusUsecase } from "./accept-found-journey-companion-status-usecase.js";
import { acceptFoundJourneyPassengerStatusUsecase } from "./accept-found-journey-passenger-status-usecase.js";
import { cancelFoundJourneyCompanionStatusUsecase } from "./cancel-found-journey-companion-status-usecase.js";
import { cancelFoundJourneyPassengerStatusUsecase } from "./cancel-found-journey-passenger-status-usecase.js";
import { getCompanionJourneyMatchesUsecase } from "./get-companion-journey-matches-usecase.js";
import { getCompanionJourneyUsecase } from "./get-companion-journey-usecase.js";
import { getCompanionJourneysUsecase } from "./get-companion-journeys-usecase.js";
import { getPassengerJourneyMatchesUsecase } from "./get-passenger-journey-matches-usecase.js";
import { getPassengerJourneyUsecase } from "./get-passenger-journey-usecase.js";
import { getPassengerJourneysUsecase } from "./get-passenger-journeys-usecase.js";
import { recordCompanionJourneyUsecase } from "./record-companion-journey-usecase.js";
import { recordPassengerJourneyUsecase } from "./record-passenger-journey-usecase.js";
import { rejectFoundJourneyCompanionStatusUsecase } from "./reject-found-journey-companion-status-usecase.js";
import { rejectFoundJourneyPassengerStatusUsecase } from "./reject-found-journey-passenger-status-usecase.js";

const usecases = {
  acceptFoundJourneyCompanionStatusUsecase,
  acceptFoundJourneyPassengerStatusUsecase,
  callMatchingAlgorithmUsecase: callMatchingAlgorithmService,
  cancelFoundJourneyCompanionStatusUsecase,
  cancelFoundJourneyPassengerStatusUsecase,
  getCompanionJourneyUsecase,
  getCompanionJourneyMatchesUsecase,
  getCompanionJourneysUsecase,
  getPassengerJourneyUsecase,
  getPassengerJourneyMatchesUsecase,
  getPassengerJourneysUsecase,
  recordCompanionJourneyUsecase,
  recordPassengerJourneyUsecase,
  rejectFoundJourneyCompanionStatusUsecase,
  rejectFoundJourneyPassengerStatusUsecase,
};

export default usecases;
