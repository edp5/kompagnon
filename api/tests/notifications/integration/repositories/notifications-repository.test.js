import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import {
  findNotificationById,
  findNotificationsByUserId,
  markAllNotificationsAsReadByUserId,
  markNotificationAsReadByNotificationId,
  removeNotificationByNotificationId,
  saveNotification,
} from "../../../../src/notifications/repositories/notifications-repository.js";

describe("Integration | Notifications | Repositories | Notifications repository", () => {
  describe("#saveNotification", () => {
    it("should persist a new notification and return its id", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();

      // when
      const notificationId = await saveNotification({
        userId: user.id,
        type: "journey_match_found",
        title: "Nouvelle correspondance",
        message: "Une correspondance a été trouvée.",
      });

      // then
      const notification = await findNotificationById(notificationId);
      expect(notification.userId).toBe(user.id);
      expect(notification.title).toBe("Nouvelle correspondance");
      expect(notification.isRead).toBe(false);
    });
  });

  describe("#findNotificationsByUserId", () => {
    it("should return only the notifications of the given user, most recent first", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const otherUser = await databaseBuilder.factory.buildUser();
      await databaseBuilder.factory.buildNotification({ userId: user.id, title: "Première" });
      const mostRecent = await databaseBuilder.factory.buildNotification({ userId: user.id, title: "Seconde" });
      await databaseBuilder.factory.buildNotification({ userId: otherUser.id, title: "Pas la mienne" });

      // when
      const result = await findNotificationsByUserId(user.id);

      // then
      expect(result).toHaveLength(2);
      expect(Number(result[0].id)).toBe(Number(mostRecent.id));
    });
  });

  describe("#findNotificationById", () => {
    it("should return null when the notification does not exist", async () => {
      // when
      const result = await findNotificationById(999999);

      // then
      expect(result).toBeNull();
    });
  });

  describe("#markNotificationAsReadByNotificationId", () => {
    it("should mark the notification as read", async () => {
      // given
      const notification = await databaseBuilder.factory.buildNotification({ isRead: false });

      // when
      await markNotificationAsReadByNotificationId(notification.id);

      // then
      const updated = await findNotificationById(notification.id);
      expect(updated.isRead).toBe(true);
    });
  });

  describe("#markAllNotificationsAsReadByUserId", () => {
    it("should mark every unread notification of the user as read without touching other users' notifications", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const otherUser = await databaseBuilder.factory.buildUser();
      const notification1 = await databaseBuilder.factory.buildNotification({ userId: user.id, isRead: false });
      const notification2 = await databaseBuilder.factory.buildNotification({ userId: user.id, isRead: false });
      const otherNotification = await databaseBuilder.factory.buildNotification({ userId: otherUser.id, isRead: false });

      // when
      await markAllNotificationsAsReadByUserId(user.id);

      // then
      expect((await findNotificationById(notification1.id)).isRead).toBe(true);
      expect((await findNotificationById(notification2.id)).isRead).toBe(true);
      expect((await findNotificationById(otherNotification.id)).isRead).toBe(false);
    });
  });

  describe("#removeNotificationByNotificationId", () => {
    it("should delete the notification", async () => {
      // given
      const notification = await databaseBuilder.factory.buildNotification();

      // when
      await removeNotificationByNotificationId(notification.id);

      // then
      expect(await findNotificationById(notification.id)).toBeNull();
    });
  });
});
