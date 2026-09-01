import { beforeEach, describe, expect, it, vi } from "vitest";

import { updateFoundJourneyStatusController } from "../../../../../src/journeys/api/controllers/update-found-journey-status-controller.js";

describe("Unit | Journeys | Api | Controller | Update found journey status controller", () => {
  let res, next, updateFoundJourneyStatus;

  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    next = vi.fn();
    updateFoundJourneyStatus = vi.fn();
  });

  describe("Success cases", () => {
    it("should accept journey and return 204 http status code", async () => {
      // given
      const req = {
        auth: { userId: 123 },
        params: { foundJourneyId: 999 },
        body: { updatedStatus: true },
      };

      // when
      await updateFoundJourneyStatusController(req, res, next, updateFoundJourneyStatus);

      // then
      expect(updateFoundJourneyStatus).toHaveBeenCalledWith({
        userId: 123,
        foundJourneyId: 999,
        updatedStatus: true,
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it("should reject journey and return 204 http status code", async () => {
      // given
      const req = {
        auth: { userId: 123 },
        params: { foundJourneyId: 999 },
        body: { updatedStatus: false },
      };

      // when
      await updateFoundJourneyStatusController(req, res, next, updateFoundJourneyStatus);

      // then
      expect(updateFoundJourneyStatus).toHaveBeenCalledWith({
        userId: 123,
        foundJourneyId: 999,
        updatedStatus: false,
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("Error cases", () => {
    it("should call next middleware when usecase throws an error", async () => {
      // given
      const req = {
        auth: { userId: 123 },
        params: { foundJourneyId: 999 },
        body: { updatedStatus: true },
      };
      const error = new Error("Something went wrong");
      updateFoundJourneyStatus.mockRejectedValue(error);

      // when
      await updateFoundJourneyStatusController(req, res, next, updateFoundJourneyStatus);

      // then
      expect(updateFoundJourneyStatus).toHaveBeenCalledWith({
        userId: 123,
        foundJourneyId: 999,
        updatedStatus: true,
      });
      expect(next).toHaveBeenCalledWith(error);
      expect(res.status).not.toHaveBeenCalled();
    });
  });
});
