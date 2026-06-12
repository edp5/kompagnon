import { beforeEach, describe, expect, it, vi } from "vitest";

import { getJourneysController } from "../../../../../src/journeys/api/controllers/get-journeys-controller.js";
import { UserHasNoRole } from "../../../../../src/journeys/errors.js";
import { USER_ROLE } from "../../../../../src/shared/constants.js";

describe("Unit | Journey | Api | Controller | Get journeys controller", () => {
  let res, next, getPassengerJourneys, getCompanionJourneys, findUserRepository;

  beforeEach(function() {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    getPassengerJourneys = vi.fn();
    getCompanionJourneys = vi.fn();
    findUserRepository = vi.fn();
    next = vi.fn();
  });

  describe("invalid user (passenger)", () => {
    it("should return the passenger journeys with a 200 status", async () => {
      // given
      const req = { auth: { userId: 123 } };
      findUserRepository.mockResolvedValue({ id: 123, role: USER_ROLE.INVALID });
      const mockJourneys = [{ id: 1, userId: 123 }];
      getPassengerJourneys.mockResolvedValue(mockJourneys);

      // when
      await getJourneysController(req, res, next, getPassengerJourneys, getCompanionJourneys, findUserRepository);

      // then
      expect(getPassengerJourneys).toHaveBeenCalledWith({ userId: 123 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockJourneys });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("valid user (companion)", () => {
    it("should return the companion journeys with a 200 status", async () => {
      // given
      const req = { auth: { userId: 123 } };
      findUserRepository.mockResolvedValue({ id: 123, role: USER_ROLE.VALID });
      const mockJourneys = [{ id: 2, userId: 123 }];
      getCompanionJourneys.mockResolvedValue(mockJourneys);

      // when
      await getJourneysController(req, res, next, getPassengerJourneys, getCompanionJourneys, findUserRepository);

      // then
      expect(getCompanionJourneys).toHaveBeenCalledWith({ userId: 123 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: mockJourneys });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("user without role", () => {
    it("should forward a UserHasNoRole error to next and call no usecase", async () => {
      // given
      const req = { auth: { userId: 123 } };
      findUserRepository.mockResolvedValue({ id: 123 });

      // when
      await getJourneysController(req, res, next, getPassengerJourneys, getCompanionJourneys, findUserRepository);

      // then
      expect(getPassengerJourneys).not.toHaveBeenCalled();
      expect(getCompanionJourneys).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new UserHasNoRole());
    });
  });

  describe("unexpected error", () => {
    it("should forward the error to next", async () => {
      // given
      const req = { auth: { userId: 123 } };
      const thrownError = new Error("db failure");
      findUserRepository.mockRejectedValue(thrownError);

      // when
      await getJourneysController(req, res, next, getPassengerJourneys, getCompanionJourneys, findUserRepository);

      // then
      expect(next).toHaveBeenCalledWith(thrownError);
      expect(getPassengerJourneys).not.toHaveBeenCalled();
      expect(getCompanionJourneys).not.toHaveBeenCalled();
    });
  });
});
