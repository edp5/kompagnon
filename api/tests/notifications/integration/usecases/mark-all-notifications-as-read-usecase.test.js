import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { findNotificationById } from "../../../../src/notifications/repositories/notifications-repository.js";
import usecases from "../../../../src/notifications/usecases/index.js";

describe("Integration | Notifications | Usecases | Mark all notifications as read", () => {
  it("should mark every notification of the user as read", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser();
    const notification1 = await databaseBuilder.factory.buildNotification({ userId: user.id, isRead: false });
    const notification2 = await databaseBuilder.factory.buildNotification({ userId: user.id, isRead: false });

    // when
    await usecases.markAllNotificationsAsReadUsecase({ userId: user.id });

    // then
    expect((await findNotificationById(notification1.id)).isRead).toBe(true);
    expect((await findNotificationById(notification2.id)).isRead).toBe(true);
  });
});
