import { beforeEach, describe, expect, it, vi } from "vitest";

import { findUserById } from "../../../../src/identities-access-management/repositories/user-repository.js";
import { JOURNEY_TYPE } from "../../../../src/journeys/constants.js";
import { JourneyIsNotOfThisUser, JourneyNotFound } from "../../../../src/journeys/errors.js";
import { findJourneyById as findCompanionJourneyById } from "../../../../src/journeys/repositories/companion-users-repository.js";
import { findTrackingPointsByJourneyId } from "../../../../src/journeys/repositories/journey-tracking-repository.js";
import { findJourneyById as findPassengerJourneyById } from "../../../../src/journeys/repositories/passenger-users-repository.js";
import { getTrackingPointsUsecase } from "../../../../src/journeys/usecases/get-tracking-points-usecase.js";
import { USER_ROLE } from "../../../../src/shared/constants.js";

vi.mock("../../../../src/identities-access-management/repositories/user-repository.js");
vi.mock("../../../../src/journeys/repositories/companion-users-repository.js");
vi.mock("../../../../src/journeys/repositories/journey-tracking-repository.js");
vi.mock("../../../../src/journeys/repositories/passenger-users-repository.js");

describe("getTrackingPointsUsecase", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should throw JourneyNotFound if journey does not exist", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.COMPANION });
    findCompanionJourneyById.mockResolvedValue(null);

    await expect(getTrackingPointsUsecase({ userId: 1, journeyId: 1 })).rejects.toThrow(JourneyNotFound);
  });

  it("should throw JourneyIsNotOfThisUser if user is not the owner", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.INVALID });
    findPassengerJourneyById.mockResolvedValue({ userId: 2 });

    await expect(getTrackingPointsUsecase({ userId: 1, journeyId: 1 })).rejects.toThrow(JourneyIsNotOfThisUser);
  });

  it("should return tracking points for a passenger journey", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.INVALID });
    findPassengerJourneyById.mockResolvedValue({ userId: 1 });
    const points = [{ id: 1, lat: 48, lon: 2 }];
    findTrackingPointsByJourneyId.mockResolvedValue(points);

    const result = await getTrackingPointsUsecase({ userId: 1, journeyId: 1 });

    expect(findTrackingPointsByJourneyId).toHaveBeenCalledWith(1, JOURNEY_TYPE.PASSENGER);
    expect(result).toEqual(points);
  });

  it("should return tracking points for a companion journey", async () => {
    findUserById.mockResolvedValue({ role: USER_ROLE.COMPANION });
    findCompanionJourneyById.mockResolvedValue({ userId: 1 });
    const points = [{ id: 2, lat: 49, lon: 3 }];
    findTrackingPointsByJourneyId.mockResolvedValue(points);

    const result = await getTrackingPointsUsecase({ userId: 1, journeyId: 1 });

    expect(findTrackingPointsByJourneyId).toHaveBeenCalledWith(1, JOURNEY_TYPE.COMPANION);
    expect(result).toEqual(points);
  });
});
