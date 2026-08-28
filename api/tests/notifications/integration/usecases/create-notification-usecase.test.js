import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { findNotificationById } from "../../../../src/notifications/repositories/notifications-repository.js";
import usecases from "../../../../src/notifications/usecases/index.js";

describe("Integration | Notifications | Usecases | Create notification", () => {
  it("should persist an unread notification for the given user", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser();

    // when
    const notificationId = await usecases.createNotificationUsecase({
      userId: user.id,
      type: "journey_match_found",
      title: "Nouvelle correspondance",
      message: "Une correspondance a été trouvée.",
    });

    // then
    const notification = await findNotificationById(notificationId);
    expect(notification.userId).toBe(user.id);
    expect(notification.type).toBe("journey_match_found");
    expect(notification.isRead).toBe(false);
  });
});
