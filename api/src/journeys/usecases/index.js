import { acceptFoundJourneyCompanionStatusUsecase } from "./accept-found-journey-companion-status-usecase.js";
import { acceptFoundJourneyPassengerStatusUsecase } from "./accept-found-journey-passenger-status-usecase.js";
import { callMatchingAlgorithmUsecase } from "./call-matching-algorithm-usecase.js";
import { cancelFoundJourneyCompanionStatusUsecase } from "./cancel-found-journey-companion-status-usecase.js";
import { cancelFoundJourneyPassengerStatusUsecase } from "./cancel-found-journey-passenger-status-usecase.js";
import { getCompanionJourneyUsecase } from "./get-companion-journey-usecase.js";
import { getCompanionJourneysUsecase } from "./get-companion-journeys-usecase.js";
import { getPassengerJourneyUsecase } from "./get-passenger-journey-usecase.js";
import { getPassengerJourneysUsecase } from "./get-passenger-journeys-usecase.js";
import { recordCompanionJourneyUsecase } from "./record-companion-journey-usecase.js";
import { recordPassengerJourneyUsecase } from "./record-passenger-journey-usecase.js";
import { rejectFoundJourneyCompanionStatusUsecase } from "./reject-found-journey-companion-status-usecase.js";
import { rejectFoundJourneyPassengerStatusUsecase } from "./reject-found-journey-passenger-status-usecase.js";

const usecases = {
  acceptFoundJourneyCompanionStatusUsecase,
  acceptFoundJourneyPassengerStatusUsecase,
  callMatchingAlgorithmUsecase,
  cancelFoundJourneyCompanionStatusUsecase,
  cancelFoundJourneyPassengerStatusUsecase,
  getCompanionJourneyUsecase,
  getCompanionJourneysUsecase,
  getPassengerJourneyUsecase,
  getPassengerJourneysUsecase,
  recordCompanionJourneyUsecase,
  recordPassengerJourneyUsecase,
  rejectFoundJourneyCompanionStatusUsecase,
  rejectFoundJourneyPassengerStatusUsecase,
};

export default usecases;
