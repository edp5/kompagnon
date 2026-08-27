import { beforeEach, describe, expect, it, vi } from "vitest";

import { findUserById } from "../../../../src/identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../../../src/shared/constants.js";
import { JOURNEY_TRACKING_STATUS, JOURNEY_TYPE } from "../../../../src/journeys/constants.js";
import { JourneyIsNotOfThisUser, JourneyNotFound } from "../../../../src/journeys/errors.js";
import { findJourneyById as findCompanionJourneyById } from "../../../../src/journeys/repositories/companion-users-repository.js";
import { updateJourneyTrackingStatus } from "../../../../src/journeys/repositories/journey-tracking-repository.js";
import { findJourneyById as findPassengerJourneyById } from "../../../../src/journeys/repositories/passenger-users-repository.js";
import { updateJourneyStatusUsecase } from "../../../../src/journeys/usecases/update-journey-status-usecase.js";

vi.mock("../../../../src/identities-access-management/repositories/user-repository.js");
vi.mock("../../../../src/journeys/repositories/companion-users-repository.js");
vi.mock("../../../../src/journeys/repositories/journey-tracking-repository.js");
vi.mock("../../../../src/journeys/repositories/passenger-users-repository.js");

describe("updateJourneyStatusUsecase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw JourneyNotFound if journey does not exist", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.COMPANION });
    findCompanionJourneyById.mockResolvedValue(null);

    await expect(updateJourneyStatusUsecase({ userId: 1, journeyId: 1, status: JOURNEY_TRACKING_STATUS.IN_PROGRESS })).rejects.toThrow(JourneyNotFound);
  });

  it("should throw JourneyIsNotOfThisUser if user is not the owner", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.INVALID });
    findPassengerJourneyById.mockResolvedValue({ userId: 2 });

    await expect(updateJourneyStatusUsecase({ userId: 1, journeyId: 1, status: JOURNEY_TRACKING_STATUS.IN_PROGRESS })).rejects.toThrow(JourneyIsNotOfThisUser);
  });

  it("should throw error if transition is invalid", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.INVALID });
    findPassengerJourneyById.mockResolvedValue({ userId: 1, trackingStatus: JOURNEY_TRACKING_STATUS.NOT_STARTED });

    const promise = updateJourneyStatusUsecase({ userId: 1, journeyId: 1, status: JOURNEY_TRACKING_STATUS.COMPLETED });
    
    await expect(promise).rejects.toThrow('Invalid status transition from "not_started" to "completed"');
    await expect(promise).rejects.toHaveProperty("statusCode", 400);
  });

  it("should update status if transition is valid", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.COMPANION });
    findCompanionJourneyById.mockResolvedValue({ userId: 1, trackingStatus: JOURNEY_TRACKING_STATUS.IN_PROGRESS });

    await updateJourneyStatusUsecase({ userId: 1, journeyId: 1, status: JOURNEY_TRACKING_STATUS.COMPLETED });
    
    expect(updateJourneyTrackingStatus).toHaveBeenCalledWith({
      journeyId: 1,
      journeyType: JOURNEY_TYPE.COMPANION,
      status: JOURNEY_TRACKING_STATUS.COMPLETED
    });
  });
});
