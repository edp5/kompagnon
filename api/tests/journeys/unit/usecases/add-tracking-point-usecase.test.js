import { beforeEach, describe, expect, it, vi } from "vitest";

import { findUserById } from "../../../../src/identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../../../src/shared/constants.js";
import { JOURNEY_TRACKING_STATUS, JOURNEY_TYPE } from "../../../../src/journeys/constants.js";
import { JourneyIsNotOfThisUser, JourneyNotFound } from "../../../../src/journeys/errors.js";
import { findJourneyById as findCompanionJourneyById } from "../../../../src/journeys/repositories/companion-users-repository.js";
import { saveTrackingPoint, updateJourneyTrackingStatus } from "../../../../src/journeys/repositories/journey-tracking-repository.js";
import { findJourneyById as findPassengerJourneyById } from "../../../../src/journeys/repositories/passenger-users-repository.js";
import { addTrackingPointUsecase } from "../../../../src/journeys/usecases/add-tracking-point-usecase.js";

vi.mock("../../../../src/identities-access-management/repositories/user-repository.js");
vi.mock("../../../../src/journeys/repositories/companion-users-repository.js");
vi.mock("../../../../src/journeys/repositories/journey-tracking-repository.js");
vi.mock("../../../../src/journeys/repositories/passenger-users-repository.js");

describe("addTrackingPointUsecase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw JourneyNotFound if journey does not exist", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.INVALID });
    findPassengerJourneyById.mockResolvedValue(null);

    await expect(addTrackingPointUsecase({ userId: 1, journeyId: 1, lat: 48, lon: 2 })).rejects.toThrow(JourneyNotFound);
  });

  it("should throw JourneyIsNotOfThisUser if user is not the owner", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.COMPANION });
    findCompanionJourneyById.mockResolvedValue({ userId: 2, trackingStatus: JOURNEY_TRACKING_STATUS.NOT_STARTED });

    await expect(addTrackingPointUsecase({ userId: 1, journeyId: 1, lat: 48, lon: 2 })).rejects.toThrow(JourneyIsNotOfThisUser);
  });

  it("should update tracking status to IN_PROGRESS if NOT_STARTED", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.INVALID });
    findPassengerJourneyById.mockResolvedValue({ userId: 1, trackingStatus: JOURNEY_TRACKING_STATUS.NOT_STARTED });
    saveTrackingPoint.mockResolvedValue({ id: 1 });

    await addTrackingPointUsecase({ userId: 1, journeyId: 1, lat: 48.0, lon: 2.0 });

    expect(updateJourneyTrackingStatus).toHaveBeenCalledWith({
      journeyId: 1,
      journeyType: JOURNEY_TYPE.PASSENGER,
      status: JOURNEY_TRACKING_STATUS.IN_PROGRESS,
    });
    expect(saveTrackingPoint).toHaveBeenCalledWith({ journeyId: 1, journeyType: JOURNEY_TYPE.PASSENGER, lat: 48.0, lon: 2.0 });
  });

  it("should just save tracking point if already IN_PROGRESS", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.COMPANION });
    findCompanionJourneyById.mockResolvedValue({ userId: 1, trackingStatus: JOURNEY_TRACKING_STATUS.IN_PROGRESS });
    saveTrackingPoint.mockResolvedValue({ id: 2 });

    await addTrackingPointUsecase({ userId: 1, journeyId: 1, lat: 48.0, lon: 2.0 });

    expect(updateJourneyTrackingStatus).not.toHaveBeenCalled();
    expect(saveTrackingPoint).toHaveBeenCalledWith({ journeyId: 1, journeyType: JOURNEY_TYPE.COMPANION, lat: 48.0, lon: 2.0 });
  });
});
