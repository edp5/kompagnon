import { beforeEach, describe, expect, it, vi } from "vitest";

import { getJourneyController } from "../../../../../src/journeys/api/controllers/get-journey-controller.js";
import { USER_ROLE } from "../../../../../src/shared/constants.js";

describe("Unit | Journey | Api | Controller | Get journey controller", () => {
  let res, next, usecases, findUserRepository;
  beforeEach(function() {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    usecases = {
      getCompanionJourneyUsecase: vi.fn(),
      getPassengerJourneyUsecase: vi.fn(),
    };
    findUserRepository = vi.fn();
    next = vi.fn();
  });

  describe("invalid user", () => {
    it("should return the passenger journey with a 200 status", async () => {
      // given
      const req = { auth: { userId: 123 }, params: { journeyId: "7" } };
      findUserRepository.mockResolvedValue({ id: 123, role: USER_ROLE.INVALID });
      usecases.getPassengerJourneyUsecase.mockResolvedValue({ id: 7, userId: 123 });

      // when
      await getJourneyController(req, res, next, usecases, findUserRepository);

      // then
      expect(usecases.getPassengerJourneyUsecase).toHaveBeenCalledWith({ journeyId: 7, userId: 123 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: { id: 7, userId: 123 } });
    });
  });

  describe("valid user", () => {
    it("should return the companion journey with a 200 status", async () => {
      // given
      const req = { auth: { userId: 123 }, params: { journeyId: "7" } };
      findUserRepository.mockResolvedValue({ id: 123, role: USER_ROLE.VALID });
      usecases.getCompanionJourneyUsecase.mockResolvedValue({ id: 7, userId: 123 });

      // when
      await getJourneyController(req, res, next, usecases, findUserRepository);

      // then
      expect(usecases.getCompanionJourneyUsecase).toHaveBeenCalledWith({ journeyId: 7, userId: 123 });
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe("journey not found or not owned", () => {
    it("should return a 404 status", async () => {
      // given
      const req = { auth: { userId: 123 }, params: { journeyId: "7" } };
      findUserRepository.mockResolvedValue({ id: 123, role: USER_ROLE.INVALID });
      usecases.getPassengerJourneyUsecase.mockResolvedValue(null);

      // when
      await getJourneyController(req, res, next, usecases, findUserRepository);

      // then
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Journey not found" });
    });
  });

  describe("user without role", () => {
    it("should not call any usecase and return a 400 status", async () => {
      // given
      const req = { auth: { userId: 123 }, params: { journeyId: "7" } };
      findUserRepository.mockResolvedValue({ id: 123 });

      // when
      await getJourneyController(req, res, next, usecases, findUserRepository);

      // then
      expect(res.status).toHaveBeenCalledWith(400);
      expect(usecases.getPassengerJourneyUsecase).not.toHaveBeenCalled();
      expect(usecases.getCompanionJourneyUsecase).not.toHaveBeenCalled();
    });
  });

  describe("error", () => {
    it("should return a 500 status", async () => {
      // given
      const req = { auth: { userId: 123 }, params: { journeyId: "7" } };
      findUserRepository.mockRejectedValue(new Error("boom"));

      // when
      await getJourneyController(req, res, next, usecases, findUserRepository);

      // then
      expect(res.status).toHaveBeenCalledWith(500);
      expect(usecases.getPassengerJourneyUsecase).not.toHaveBeenCalled();
      expect(usecases.getCompanionJourneyUsecase).not.toHaveBeenCalled();
    });
  });
});
