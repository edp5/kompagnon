import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateFoundJourneyStatusController } from "../../../../../src/journeys/api/controllers/update-found-journey-status-controller.js";
import { UserHasNoRole } from "../../../../../src/journeys/errors.js";
import { USER_ROLE } from "../../../../../src/shared/constants.js";

describe("Unit | Journeys | Api | Controller | Update found journey status controller", () => {
  let res, next, acceptCompanionUsecase, rejectCompanionUsecase, acceptPassengerUsecase, rejectPassengerUsecase, findUser;
  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    next = vi.fn();
    acceptCompanionUsecase = vi.fn();
    rejectCompanionUsecase = vi.fn();
    acceptPassengerUsecase = vi.fn();
    rejectPassengerUsecase = vi.fn();
    findUser = vi.fn();
  });
  describe("valid user", () => {
    describe("Success cases", () => {
      it("should accept journey and call 201 http status code", async () => {
        // given
        const req = {
          auth: {
            userId: 123,
          },
          params: {
            foundJourneyId: 234,
          },
          body: {
            updatedStatus: true,
          },
        };
        findUser.mockResolvedValue({ id: 123, role: USER_ROLE.VALID });

        // when
        await updateFoundJourneyStatusController(
          req,
          res,
          next,
          acceptCompanionUsecase,
          rejectCompanionUsecase,
          acceptPassengerUsecase,
          rejectPassengerUsecase,
          findUser,
        );

        // then
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalled();
        expect(acceptCompanionUsecase).toHaveBeenCalledWith({ userId: 123, foundJourneyId: 234 });
        expect(rejectCompanionUsecase).not.toHaveBeenCalled();
        expect(acceptPassengerUsecase).not.toHaveBeenCalled();
        expect(rejectPassengerUsecase).not.toHaveBeenCalled();
        expect(rejectPassengerUsecase).not.toHaveBeenCalled();
      });

      it("should reject journey and call 201 http status code", async () => {
        // given
        const req = {
          auth: {
            userId: 123,
          },
          params: {
            foundJourneyId: 234,
          },
          body: {
            updatedStatus: false,
          },
        };
        findUser.mockResolvedValue({ id: 123, role: USER_ROLE.VALID });

        // when
        await updateFoundJourneyStatusController(
          req,
          res,
          next,
          acceptCompanionUsecase,
          rejectCompanionUsecase,
          acceptPassengerUsecase,
          rejectPassengerUsecase,
          findUser,
        );

        // then
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalled();
        expect(acceptCompanionUsecase).not.toHaveBeenCalled();
        expect(rejectCompanionUsecase).toHaveBeenCalledWith({ userId: 123, foundJourneyId: 234 });
        expect(acceptPassengerUsecase).not.toHaveBeenCalled();
        expect(rejectPassengerUsecase).not.toHaveBeenCalled();
        expect(rejectPassengerUsecase).not.toHaveBeenCalled();
      });
    });

    describe("error cases", () => {
      it("should throw an error and call next middleware", async () => {
        // given
        const req = {
          auth: {
            userId: 123,
          },
          params: {
            foundJourneyId: 234,
          },
          body: {
            updatedStatus: true,
          },
        };
        findUser.mockResolvedValue({ id: 123, role: USER_ROLE.VALID });
        acceptCompanionUsecase.mockRejectedValue(new Error("Error message"));

        // when
        await updateFoundJourneyStatusController(
          req,
          res,
          next,
          acceptCompanionUsecase,
          rejectCompanionUsecase,
          acceptPassengerUsecase,
          rejectPassengerUsecase,
          findUser,
        );

        // then
        expect(acceptCompanionUsecase).toHaveBeenCalledWith({ userId: 123, foundJourneyId: 234 });
        expect(next).toHaveBeenCalledWith(new Error("Error message"));
        expect(res.status).not.toHaveBeenCalled();
        expect(rejectCompanionUsecase).not.toHaveBeenCalled();
        expect(acceptPassengerUsecase).not.toHaveBeenCalled();
        expect(rejectPassengerUsecase).not.toHaveBeenCalled();
        expect(rejectPassengerUsecase).not.toHaveBeenCalled();
      });
    });
  });

  describe("invalid user", () => {
    describe("Success cases", () => {
      it("should accept journey and call 201 http status code", async () => {
        // given
        const req = {
          auth: {
            userId: 123,
          },
          params: {
            foundJourneyId: 234,
          },
          body: {
            updatedStatus: true,
          },
        };
        findUser.mockResolvedValue({ id: 123, role: USER_ROLE.INVALID });

        // when
        await updateFoundJourneyStatusController(
          req,
          res,
          next,
          acceptCompanionUsecase,
          rejectCompanionUsecase,
          acceptPassengerUsecase,
          rejectPassengerUsecase,
          findUser,
        );

        // then
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalled();
        expect(acceptPassengerUsecase).toHaveBeenCalledWith({ userId: 123, foundJourneyId: 234 });
        expect(rejectPassengerUsecase).not.toHaveBeenCalled();
        expect(acceptCompanionUsecase).not.toHaveBeenCalled();
        expect(rejectCompanionUsecase).not.toHaveBeenCalled();
        expect(rejectPassengerUsecase).not.toHaveBeenCalled();
      });

      it("should reject journey and call 201 http status code", async () => {
        // given
        const req = {
          auth: {
            userId: 123,
          },
          params: {
            foundJourneyId: 234,
          },
          body: {
            updatedStatus: false,
          },
        };
        findUser.mockResolvedValue({ id: 123, role: USER_ROLE.INVALID });

        // when
        await updateFoundJourneyStatusController(
          req,
          res,
          next,
          acceptCompanionUsecase,
          rejectCompanionUsecase,
          acceptPassengerUsecase,
          rejectPassengerUsecase,
          findUser,
        );

        // then
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.send).toHaveBeenCalled();
        expect(acceptPassengerUsecase).not.toHaveBeenCalled();
        expect(rejectPassengerUsecase).toHaveBeenCalledWith({ userId: 123, foundJourneyId: 234 });
        expect(acceptCompanionUsecase).not.toHaveBeenCalled();
        expect(rejectCompanionUsecase).not.toHaveBeenCalled();
      });
    });

    describe("error cases", () => {
      it("should throw an error and call next middleware", async () => {
        // given
        const req = {
          auth: {
            userId: 123,
          },
          params: {
            foundJourneyId: 234,
          },
          body: {
            updatedStatus: true,
          },
        };
        findUser.mockResolvedValue({ id: 123, role: USER_ROLE.INVALID });
        acceptPassengerUsecase.mockRejectedValue(new Error("Error message"));

        // when
        await updateFoundJourneyStatusController(
          req,
          res,
          next,
          acceptCompanionUsecase,
          rejectCompanionUsecase,
          acceptPassengerUsecase,
          rejectPassengerUsecase,
          findUser,
        );

        // then
        expect(next).toHaveBeenCalledWith(new Error("Error message"));
        expect(acceptPassengerUsecase).toHaveBeenCalledWith({ userId: 123, foundJourneyId: 234 });
        expect(res.status).not.toHaveBeenCalled();
        expect(acceptCompanionUsecase).not.toHaveBeenCalled();
        expect(rejectCompanionUsecase).not.toHaveBeenCalled();
        expect(rejectPassengerUsecase).not.toHaveBeenCalled();
        expect(rejectPassengerUsecase).not.toHaveBeenCalled();
      });
    });
  });

  describe("user without role", () => {
    it("should throw an error and call next middleware if user has no role", async () => {
      // given
      const req = {
        auth: {
          userId: 123,
        },
        params: {
          foundJourneyId: 234,
        },
        body: {
          updatedStatus: true,
        },
      };
      findUser.mockResolvedValue({ id: 123 });

      // when
      await updateFoundJourneyStatusController(
        req,
        res,
        next,
        acceptCompanionUsecase,
        rejectCompanionUsecase,
        acceptPassengerUsecase,
        rejectPassengerUsecase,
        findUser,
      );

      // then
      expect(findUser).toHaveBeenCalledWith(123);
      expect(next).toHaveBeenCalledWith(new UserHasNoRole);
      expect(acceptPassengerUsecase).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
      expect(acceptCompanionUsecase).not.toHaveBeenCalled();
      expect(rejectCompanionUsecase).not.toHaveBeenCalled();
      expect(rejectPassengerUsecase).not.toHaveBeenCalled();
      expect(rejectPassengerUsecase).not.toHaveBeenCalled();
    });
  });
});
