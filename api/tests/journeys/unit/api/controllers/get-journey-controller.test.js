import { beforeEach, describe, expect, it, vi } from "vitest";

import { getJourneyController } from "../../../../../src/journeys/api/controllers/get-journey-controller.js";
import { JourneyNotFound, UserHasNoRole } from "../../../../../src/journeys/errors.js";
import { USER_ROLE } from "../../../../../src/shared/constants.js";

describe("Unit | Journey | Api | Controller | Get journey controller", () => {
  let res, next, getPassengerJourney, getCompanionJourney, findUserRepository;
  beforeEach(function() {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    getPassengerJourney = vi.fn();
    getCompanionJourney = vi.fn();
    findUserRepository = vi.fn();
    next = vi.fn();
  });

  describe("invalid user", () => {
    it("should return the passenger journey with a 200 status", async () => {
      // given
      const req = { auth: { userId: 123 }, params: { journeyId: "7" } };
      findUserRepository.mockResolvedValue({ id: 123, role: USER_ROLE.INVALID });
      getPassengerJourney.mockResolvedValue({ id: 7, userId: 123 });

      // when
      await getJourneyController(req, res, next, getPassengerJourney, getCompanionJourney, findUserRepository);

      // then
      expect(getPassengerJourney).toHaveBeenCalledWith({ journeyId: 7, userId: 123 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: { id: 7, userId: 123 } });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("valid user", () => {
    it("should return the companion journey with a 200 status", async () => {
      // given
      const req = { auth: { userId: 123 }, params: { journeyId: "7" } };
      findUserRepository.mockResolvedValue({ id: 123, role: USER_ROLE.VALID });
      getCompanionJourney.mockResolvedValue({ id: 7, userId: 123 });

      // when
      await getJourneyController(req, res, next, getPassengerJourney, getCompanionJourney, findUserRepository);

      // then
      expect(getCompanionJourney).toHaveBeenCalledWith({ journeyId: 7, userId: 123 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("journey not found or not owned", () => {
    it("should forward a JourneyNotFound error to next", async () => {
      // given
      const req = { auth: { userId: 123 }, params: { journeyId: "7" } };
      findUserRepository.mockResolvedValue({ id: 123, role: USER_ROLE.INVALID });
      getPassengerJourney.mockResolvedValue(null);

      // when
      await getJourneyController(req, res, next, getPassengerJourney, getCompanionJourney, findUserRepository);

      // then
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new JourneyNotFound());
    });
  });

  describe("user without role", () => {
    it("should forward a UserHasNoRole error to next and call no usecase", async () => {
      // given
      const req = { auth: { userId: 123 }, params: { journeyId: "7" } };
      findUserRepository.mockResolvedValue({ id: 123 });

      // when
      await getJourneyController(req, res, next, getPassengerJourney, getCompanionJourney, findUserRepository);

      // then
      expect(getPassengerJourney).not.toHaveBeenCalled();
      expect(getCompanionJourney).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(new UserHasNoRole());
    });
  });

  describe("unexpected error", () => {
    it("should forward the error to next", async () => {
      // given
      const req = { auth: { userId: 123 }, params: { journeyId: "7" } };
      const thrownError = new Error("boom");
      findUserRepository.mockRejectedValue(thrownError);

      // when
      await getJourneyController(req, res, next, getPassengerJourney, getCompanionJourney, findUserRepository);

      // then
      expect(next).toHaveBeenCalledWith(thrownError);
      expect(getPassengerJourney).not.toHaveBeenCalled();
      expect(getCompanionJourney).not.toHaveBeenCalled();
    });
  });
});
