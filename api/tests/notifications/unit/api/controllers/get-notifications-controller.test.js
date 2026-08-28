import { beforeEach, describe, expect, it, vi } from "vitest";

import { getNotificationsController } from "../../../../../src/notifications/api/controllers/get-notifications-controller.js";

describe("Unit | Notifications | Api | Controller | Get notifications controller", () => {
  let res, next, getNotifications;

  beforeEach(function() {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    getNotifications = vi.fn();
    next = vi.fn();
  });

  it("should return the user's notifications with a 200 status", async () => {
    // given
    const req = { auth: { userId: 123 } };
    const mockNotifications = [{ id: 1, userId: 123, title: "Nouvelle correspondance" }];
    getNotifications.mockResolvedValue(mockNotifications);

    // when
    await getNotificationsController(req, res, next, getNotifications);

    // then
    expect(getNotifications).toHaveBeenCalledWith({ userId: 123 });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockNotifications });
    expect(next).not.toHaveBeenCalled();
  });

  it("should forward unexpected errors to next", async () => {
    // given
    const req = { auth: { userId: 123 } };
    const thrownError = new Error("db failure");
    getNotifications.mockRejectedValue(thrownError);

    // when
    await getNotificationsController(req, res, next, getNotifications);

    // then
    expect(next).toHaveBeenCalledWith(thrownError);
    expect(res.status).not.toHaveBeenCalled();
  });
});
