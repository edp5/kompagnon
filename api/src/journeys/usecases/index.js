import { callMatchingAlgorithmService } from "../services/call-matching-algorithm-service.js";
import { acceptFoundJourneyCompanionStatusUsecase } from "./accept-found-journey-companion-status-usecase.js";
import { acceptFoundJourneyPassengerStatusUsecase } from "./accept-found-journey-passenger-status-usecase.js";
import { cancelFoundJourneyCompanionStatusUsecase } from "./cancel-found-journey-companion-status-usecase.js";
import { cancelFoundJourneyPassengerStatusUsecase } from "./cancel-found-journey-passenger-status-usecase.js";
import { createJourneyShareUsecase } from "./create-journey-share-usecase.js";
import { getCompanionJourneyUsecase } from "./get-companion-journey-usecase.js";
import { getCompanionJourneysUsecase } from "./get-companion-journeys-usecase.js";
import { getJourneyMatchesUsecase } from "./get-journey-matches-usecase.js";
import { getJourneyMessagesUsecase } from "./get-journey-messages-usecase.js";
import { getJourneyPositionsUsecase } from "./get-journey-positions-usecase.js";
import { getMyJourneyReviewUsecase } from "./get-my-journey-review-usecase.js";
import { getPassengerJourneyUsecase } from "./get-passenger-journey-usecase.js";
import { getPassengerJourneysUsecase } from "./get-passenger-journeys-usecase.js";
import { getSharedJourneyUsecase } from "./get-shared-journey-usecase.js";
import { recordCompanionJourneyUsecase } from "./record-companion-journey-usecase.js";
import { recordJourneyPositionUsecase } from "./record-journey-position-usecase.js";
import { recordPassengerJourneyUsecase } from "./record-passenger-journey-usecase.js";
import { rejectFoundJourneyCompanionStatusUsecase } from "./reject-found-journey-companion-status-usecase.js";
import { rejectFoundJourneyPassengerStatusUsecase } from "./reject-found-journey-passenger-status-usecase.js";
import { reviewJourneyUsecase } from "./review-journey-usecase.js";
import { sendJourneyMessageUsecase } from "./send-journey-message-usecase.js";

const usecases = {
  acceptFoundJourneyCompanionStatusUsecase,
  acceptFoundJourneyPassengerStatusUsecase,
  callMatchingAlgorithmUsecase: callMatchingAlgorithmService,
  cancelFoundJourneyCompanionStatusUsecase,
  cancelFoundJourneyPassengerStatusUsecase,
  createJourneyShareUsecase,
  getCompanionJourneyUsecase,
  getCompanionJourneysUsecase,
  getJourneyMatchesUsecase,
  getJourneyMessagesUsecase,
  getJourneyPositionsUsecase,
  getMyJourneyReviewUsecase,
  getPassengerJourneyUsecase,
  getPassengerJourneysUsecase,
  getSharedJourneyUsecase,
  recordCompanionJourneyUsecase,
  recordJourneyPositionUsecase,
  reviewJourneyUsecase,
  recordPassengerJourneyUsecase,
  rejectFoundJourneyCompanionStatusUsecase,
  rejectFoundJourneyPassengerStatusUsecase,
  sendJourneyMessageUsecase,
};

export default usecases;
