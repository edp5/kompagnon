import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { NotificationIsNotOfThisUser, NotificationNotFound } from "../../../../src/notifications/errors.js";
import { findNotificationById } from "../../../../src/notifications/repositories/notifications-repository.js";
import usecases from "../../../../src/notifications/usecases/index.js";

describe("Integration | Notifications | Usecases | Mark notification as read", () => {
  it("should mark the notification as read when it belongs to the user", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser();
    const notification = await databaseBuilder.factory.buildNotification({ userId: user.id, isRead: false });

    // when
    await usecases.markNotificationAsReadUsecase({ userId: user.id, notificationId: notification.id });

    // then
    const updated = await findNotificationById(notification.id);
    expect(updated.isRead).toBe(true);
  });

  it("should throw a NotificationNotFound when the notification does not exist", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser();

    // when / then
    await expect(usecases.markNotificationAsReadUsecase({ userId: user.id, notificationId: 999999 }))
      .rejects.toThrow(NotificationNotFound);
  });

  it("should throw a NotificationIsNotOfThisUser when the notification belongs to someone else", async () => {
    // given
    const owner = await databaseBuilder.factory.buildUser();
    const otherUser = await databaseBuilder.factory.buildUser();
    const notification = await databaseBuilder.factory.buildNotification({ userId: owner.id });

    // when / then
    await expect(usecases.markNotificationAsReadUsecase({ userId: otherUser.id, notificationId: notification.id }))
      .rejects.toThrow(NotificationIsNotOfThisUser);
  });
});
