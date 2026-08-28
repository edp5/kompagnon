import { beforeEach, describe, expect, it, vi } from "vitest";

import { markAllNotificationsAsReadController } from "../../../../../src/notifications/api/controllers/mark-all-notifications-as-read-controller.js";

describe("Unit | Notifications | Api | Controller | Mark all notifications as read controller", () => {
  let res, next, markAllNotificationsAsRead;

  beforeEach(function() {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    markAllNotificationsAsRead = vi.fn();
    next = vi.fn();
  });

  it("should mark all notifications as read and return a 204 status", async () => {
    // given
    const req = { auth: { userId: 123 } };
    markAllNotificationsAsRead.mockResolvedValue();

    // when
    await markAllNotificationsAsReadController(req, res, next, markAllNotificationsAsRead);

    // then
    expect(markAllNotificationsAsRead).toHaveBeenCalledWith({ userId: 123 });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should forward unexpected errors to next", async () => {
    // given
    const req = { auth: { userId: 123 } };
    const thrownError = new Error("db failure");
    markAllNotificationsAsRead.mockRejectedValue(thrownError);

    // when
    await markAllNotificationsAsReadController(req, res, next, markAllNotificationsAsRead);

    // then
    expect(next).toHaveBeenCalledWith(thrownError);
    expect(res.status).not.toHaveBeenCalled();
  });
});
