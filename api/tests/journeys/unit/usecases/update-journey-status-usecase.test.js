import { beforeEach, describe, expect, it, vi } from "vitest";

import { findUserById } from "../../../../src/identities-access-management/repositories/user-repository.js";
import { JOURNEY_TRACKING_STATUS, JOURNEY_TYPE } from "../../../../src/journeys/constants.js";
import {
  InvalidJourneyStatusTransitionError,
  JourneyIsNotOfThisUser,
  JourneyNotFound,
  UserHasNoRole,
} from "../../../../src/journeys/errors.js";
import { findJourneyById as findCompanionJourneyById } from "../../../../src/journeys/repositories/companion-users-repository.js";
import {
  findAcceptedFoundJourneysByJourneyId,
  updateFoundJourneyStatuses,
} from "../../../../src/journeys/repositories/found-journeys-repository.js";
import { updateJourneyTrackingStatus } from "../../../../src/journeys/repositories/journey-tracking-repository.js";
import { findJourneyById as findPassengerJourneyById } from "../../../../src/journeys/repositories/passenger-users-repository.js";
import { updateJourneyStatusUsecase } from "../../../../src/journeys/usecases/update-journey-status-usecase.js";
import { JOURNEY_STATUS, USER_ROLE } from "../../../../src/shared/constants.js";

vi.mock("../../../../src/identities-access-management/repositories/user-repository.js");
vi.mock("../../../../src/journeys/repositories/companion-users-repository.js");
vi.mock("../../../../src/journeys/repositories/found-journeys-repository.js");
vi.mock("../../../../src/journeys/repositories/journey-tracking-repository.js");
vi.mock("../../../../src/journeys/repositories/passenger-users-repository.js");

describe("Unit | Journeys | UseCases | updateJourneyStatusUsecase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    findAcceptedFoundJourneysByJourneyId.mockResolvedValue([]);
  });

  it("should throw UserHasNoRole if user has no role", async () => {
    findUserById.mockResolvedValue({ id: 1, role: null });

    await expect(
      updateJourneyStatusUsecase({ userId: 1, journeyId: 1, status: JOURNEY_TRACKING_STATUS.IN_PROGRESS }),
    ).rejects.toThrow(UserHasNoRole);
  });

  it("should throw JourneyNotFound if journey does not exist", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.COMPANION });
    findCompanionJourneyById.mockResolvedValue(null);

    await expect(
      updateJourneyStatusUsecase({ userId: 1, journeyId: 1, status: JOURNEY_TRACKING_STATUS.IN_PROGRESS }),
    ).rejects.toThrow(JourneyNotFound);
  });

  it("should throw JourneyIsNotOfThisUser if user is not the owner", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.PASSENGER });
    findPassengerJourneyById.mockResolvedValue({ userId: 2 });

    await expect(
      updateJourneyStatusUsecase({ userId: 1, journeyId: 1, status: JOURNEY_TRACKING_STATUS.IN_PROGRESS }),
    ).rejects.toThrow(JourneyIsNotOfThisUser);
  });

  it("should throw InvalidJourneyStatusTransitionError if transition is invalid", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.PASSENGER });
    findPassengerJourneyById.mockResolvedValue({ userId: 1, trackingStatus: JOURNEY_TRACKING_STATUS.NOT_STARTED });

    const promise = updateJourneyStatusUsecase({
      userId: 1,
      journeyId: 1,
      status: JOURNEY_TRACKING_STATUS.COMPLETED,
    });

    await expect(promise).rejects.toThrow(InvalidJourneyStatusTransitionError);
  });

  it("should update status and sync found journeys when transitioning to COMPLETED", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.COMPANION });
    findCompanionJourneyById.mockResolvedValue({ userId: 1, trackingStatus: JOURNEY_TRACKING_STATUS.IN_PROGRESS });
    findAcceptedFoundJourneysByJourneyId.mockResolvedValue([{ id: 10 }]);

    await updateJourneyStatusUsecase({ userId: 1, journeyId: 1, status: JOURNEY_TRACKING_STATUS.COMPLETED });

    expect(updateJourneyTrackingStatus).toHaveBeenCalledWith({
      journeyId: 1,
      journeyType: JOURNEY_TYPE.COMPANION,
      status: JOURNEY_TRACKING_STATUS.COMPLETED,
    });
    expect(updateFoundJourneyStatuses).toHaveBeenCalledWith({
      foundJourneyId: 10,
      passengerStatus: JOURNEY_STATUS.COMPLETED,
      companionStatus: JOURNEY_STATUS.COMPLETED,
    });
  });

  it("should update status and sync found journeys when transitioning to CANCELLED", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.PASSENGER });
    findPassengerJourneyById.mockResolvedValue({ userId: 1, trackingStatus: JOURNEY_TRACKING_STATUS.NOT_STARTED });
    findAcceptedFoundJourneysByJourneyId.mockResolvedValue([{ id: 12 }]);

    await updateJourneyStatusUsecase({ userId: 1, journeyId: 1, status: JOURNEY_TRACKING_STATUS.CANCELLED });

    expect(updateJourneyTrackingStatus).toHaveBeenCalledWith({
      journeyId: 1,
      journeyType: JOURNEY_TYPE.PASSENGER,
      status: JOURNEY_TRACKING_STATUS.CANCELLED,
    });
    expect(updateFoundJourneyStatuses).toHaveBeenCalledWith({
      foundJourneyId: 12,
      passengerStatus: JOURNEY_STATUS.CANCELLED,
      companionStatus: JOURNEY_STATUS.CANCELLED,
    });
  });
});
