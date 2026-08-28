import { beforeEach, describe, expect, it, vi } from "vitest";

import { markNotificationAsReadController } from "../../../../../src/notifications/api/controllers/mark-notification-as-read-controller.js";
import { NotificationNotFound } from "../../../../../src/notifications/errors.js";

describe("Unit | Notifications | Api | Controller | Mark notification as read controller", () => {
  let res, next, markNotificationAsRead;

  beforeEach(function() {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    markNotificationAsRead = vi.fn();
    next = vi.fn();
  });

  it("should mark the notification as read and return a 204 status", async () => {
    // given
    const req = { auth: { userId: 123 }, params: { notificationId: "7" } };
    markNotificationAsRead.mockResolvedValue();

    // when
    await markNotificationAsReadController(req, res, next, markNotificationAsRead);

    // then
    expect(markNotificationAsRead).toHaveBeenCalledWith({ userId: 123, notificationId: 7 });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should forward a NotificationNotFound error to next", async () => {
    // given
    const req = { auth: { userId: 123 }, params: { notificationId: "7" } };
    markNotificationAsRead.mockRejectedValue(new NotificationNotFound());

    // when
    await markNotificationAsReadController(req, res, next, markNotificationAsRead);

    // then
    expect(next).toHaveBeenCalledWith(new NotificationNotFound());
    expect(res.status).not.toHaveBeenCalled();
  });
});
