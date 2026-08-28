import { beforeEach, describe, expect, it, vi } from "vitest";

import { deleteNotificationController } from "../../../../../src/notifications/api/controllers/delete-notification-controller.js";
import { NotificationIsNotOfThisUser } from "../../../../../src/notifications/errors.js";

describe("Unit | Notifications | Api | Controller | Delete notification controller", () => {
  let res, next, deleteNotification;

  beforeEach(function() {
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    deleteNotification = vi.fn();
    next = vi.fn();
  });

  it("should delete the notification and return a 204 status", async () => {
    // given
    const req = { auth: { userId: 123 }, params: { notificationId: "7" } };
    deleteNotification.mockResolvedValue();

    // when
    await deleteNotificationController(req, res, next, deleteNotification);

    // then
    expect(deleteNotification).toHaveBeenCalledWith({ userId: 123, notificationId: 7 });
    expect(res.status).toHaveBeenCalledWith(204);
    expect(res.send).toHaveBeenCalled();
    expect(next).not.toHaveBeenCalled();
  });

  it("should forward a NotificationIsNotOfThisUser error to next", async () => {
    // given
    const req = { auth: { userId: 123 }, params: { notificationId: "7" } };
    deleteNotification.mockRejectedValue(new NotificationIsNotOfThisUser());

    // when
    await deleteNotificationController(req, res, next, deleteNotification);

    // then
    expect(next).toHaveBeenCalledWith(new NotificationIsNotOfThisUser());
    expect(res.status).not.toHaveBeenCalled();
  });
});
