import { beforeEach, describe, expect, it, vi } from "vitest";

import { recordJourneyController } from "../../../../../src/journeys/api/controllers/record-journey-controller.js";
import { USER_ROLE } from "../../../../../src/shared/constants.js";

describe("Unit | Journey | Api | Controller | Record journey controller", () => {
  let res, next, usecases, findUserRepository;
  beforeEach(function() {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    usecases = {
      recordCompanionJourneyUsecase: vi.fn(),
      recordPassengerJourneyUsecase: vi.fn(),
    };
    findUserRepository = vi.fn();
    next = vi.fn();
  });

  describe("valid user", () => {
    it("should call functions and 201 status", async () => {
      // given
      const req = {
        auth: {
          userId: 123,
        },
        body: { a: 1 },
      };
      findUserRepository.mockResolvedValue({ id: 123, role: USER_ROLE.VALID });
      usecases.recordCompanionJourneyUsecase.mockResolvedValue({ journeyId: 1 });

      // when
      await recordJourneyController(req, res, next, usecases, findUserRepository);

      // then
      expect(findUserRepository).toHaveBeenCalledWith(123);
      expect(usecases.recordCompanionJourneyUsecase).toHaveBeenCalledWith({ userId: 123, a: 1 });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("invalid user", () => {
    it("should call functions and 201 status", async () => {
      // given
      const req = {
        auth: {
          userId: 123,
        },
        body: { a: 1 },
      };
      findUserRepository.mockResolvedValue({ id: 123, role: USER_ROLE.INVALID });
      usecases.recordPassengerJourneyUsecase.mockResolvedValue({ journeyId: 1 });

      // when
      await recordJourneyController(req, res, next, usecases, findUserRepository);

      // then
      expect(findUserRepository).toHaveBeenCalledWith(123);
      expect(usecases.recordPassengerJourneyUsecase).toHaveBeenCalledWith({ userId: 123, a: 1 });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("user without role", () => {
    it("should not call usecase and 400 status", async () => {
      // given
      const req = {
        auth: {
          userId: 123,
        },
        body: { a: 1 },
      };
      findUserRepository.mockResolvedValue({ id: 123 });

      // when
      await recordJourneyController(req, res, next, usecases, findUserRepository);

      // then
      expect(findUserRepository).toHaveBeenCalledWith(123);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(next).not.toHaveBeenCalled();
      expect(usecases.recordCompanionJourneyUsecase).not.toHaveBeenCalled();
      expect(usecases.recordPassengerJourneyUsecase).not.toHaveBeenCalled();
    });
  });

  describe("error", () => {
    it("call 500 status", async () => {
      // given
      const req = {
        auth: {
          userId: 123,
        },
        body: { a: 1 },
      };
      findUserRepository.mockRejectedValue();

      // when
      await recordJourneyController(req, res, next, usecases, findUserRepository);

      // then
      expect(findUserRepository).toHaveBeenCalledWith(123);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(next).not.toHaveBeenCalled();
      expect(usecases.recordCompanionJourneyUsecase).not.toHaveBeenCalled();
      expect(usecases.recordPassengerJourneyUsecase).not.toHaveBeenCalled();
    });
  });
});
