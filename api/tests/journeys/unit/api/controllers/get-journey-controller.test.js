import { beforeEach, describe, expect, it, vi } from "vitest";

import { getJourneyController } from "../../../../../src/journeys/api/controllers/get-journey-controller.js";
import { USER_ROLE } from "../../../../../src/shared/constants.js";
import { DomainError } from "../../../../../src/shared/domain/models/domain-error.js";

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
    it("should forward a 404 DomainError to next", async () => {
      // given
      const req = { auth: { userId: 123 }, params: { journeyId: "7" } };
      findUserRepository.mockResolvedValue({ id: 123, role: USER_ROLE.INVALID });
      getPassengerJourney.mockResolvedValue(null);

      // when
      await getJourneyController(req, res, next, getPassengerJourney, getCompanionJourney, findUserRepository);

      // then
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(DomainError);
      expect(error.statusCode).toBe(404);
    });
  });

  describe("user without role", () => {
    it("should forward a 400 DomainError to next and call no usecase", async () => {
      // given
      const req = { auth: { userId: 123 }, params: { journeyId: "7" } };
      findUserRepository.mockResolvedValue({ id: 123 });

      // when
      await getJourneyController(req, res, next, getPassengerJourney, getCompanionJourney, findUserRepository);

      // then
      expect(getPassengerJourney).not.toHaveBeenCalled();
      expect(getCompanionJourney).not.toHaveBeenCalled();
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(DomainError);
      expect(error.statusCode).toBe(400);
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
