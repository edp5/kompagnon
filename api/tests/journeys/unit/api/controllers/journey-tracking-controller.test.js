import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  addTrackingPointController,
  getTrackingPointsController,
  updateJourneyStatusController,
} from "../../../../../src/journeys/api/controllers/journey-tracking-controller.js";

describe("Unit | Journey | Api | Controller | Journey tracking controller", () => {
  let res, next;

  beforeEach(() => {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn().mockReturnThis(),
    };
    next = vi.fn();
  });

  // ── addTrackingPointController ──────────────────────────────────────────────

  describe("#addTrackingPointController", () => {
    it("should return 201 with the created tracking point", async () => {
      // given
      const req = { auth: { userId: 1 }, params: { journeyId: "5" }, body: { lat: 48.8566, lon: 2.3522 } };
      const addTrackingPoint = vi.fn().mockResolvedValue({ id: 42, journeyId: 5, lat: 48.8566, lon: 2.3522 });

      // when
      await addTrackingPointController(req, res, next, addTrackingPoint);

      // then
      expect(addTrackingPoint).toHaveBeenCalledWith({ userId: 1, journeyId: 5, lat: 48.8566, lon: 2.3522 });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: { id: 42, journeyId: 5, lat: 48.8566, lon: 2.3522 } });
    });

    it("should forward errors to next", async () => {
      // given
      const req = { auth: { userId: 1 }, params: { journeyId: "5" }, body: { lat: 48.8566, lon: 2.3522 } };
      const error = new Error("boom");
      const addTrackingPoint = vi.fn().mockRejectedValue(error);

      // when
      await addTrackingPointController(req, res, next, addTrackingPoint);

      // then
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ── getTrackingPointsController ─────────────────────────────────────────────

  describe("#getTrackingPointsController", () => {
    it("should return 200 with the list of tracking points", async () => {
      // given
      const req = { auth: { userId: 1 }, params: { journeyId: "5" } };
      const points = [{ id: 1, lat: 48.8, lon: 2.3 }];
      const getTrackingPoints = vi.fn().mockResolvedValue(points);

      // when
      await getTrackingPointsController(req, res, next, getTrackingPoints);

      // then
      expect(getTrackingPoints).toHaveBeenCalledWith({ userId: 1, journeyId: 5 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: points });
    });

    it("should forward errors to next", async () => {
      // given
      const req = { auth: { userId: 1 }, params: { journeyId: "5" } };
      const error = new Error("not found");
      const getTrackingPoints = vi.fn().mockRejectedValue(error);

      // when
      await getTrackingPointsController(req, res, next, getTrackingPoints);

      // then
      expect(next).toHaveBeenCalledWith(error);
    });
  });

  // ── updateJourneyStatusController ───────────────────────────────────────────

  describe("#updateJourneyStatusController", () => {
    it("should return 204 on success", async () => {
      // given
      const req = { auth: { userId: 1 }, params: { journeyId: "5" }, body: { status: "in_progress" } };
      const updateJourneyStatus = vi.fn().mockResolvedValue(undefined);

      // when
      await updateJourneyStatusController(req, res, next, updateJourneyStatus);

      // then
      expect(updateJourneyStatus).toHaveBeenCalledWith({ userId: 1, journeyId: 5, status: "in_progress" });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("should forward errors to next", async () => {
      // given
      const req = { auth: { userId: 1 }, params: { journeyId: "5" }, body: { status: "completed" } };
      const error = new Error("invalid transition");
      const updateJourneyStatus = vi.fn().mockRejectedValue(error);

      // when
      await updateJourneyStatusController(req, res, next, updateJourneyStatus);

      // then
      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
