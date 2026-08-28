import request from "supertest";
import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../db/database-builder/index.js";
import server from "../../../server.js";
import { generateAuthenticatedUser } from "../../helpers/generate-authenticated-user.js";

describe("Acceptance | Notifications | Notification routes", () => {
  describe("GET /api/notifications", () => {
    it("should return 200 and only the authenticated user's notifications", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const otherUser = await databaseBuilder.factory.buildUser();
      await databaseBuilder.factory.buildNotification({ userId: user.id });
      await databaseBuilder.factory.buildNotification({ userId: otherUser.id });
      const auth = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server).get("/api/notifications").set("Authorization", auth);

      // then
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(1);
    });

    it("should return 401 when no token is provided", async () => {
      // when
      const response = await request(server).get("/api/notifications");

      // then
      expect(response.status).toBe(401);
    });
  });

  describe("PATCH /api/notifications/:notificationId/read", () => {
    it("should return 204 and mark the notification as read", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const notification = await databaseBuilder.factory.buildNotification({ userId: user.id, isRead: false });
      const auth = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server)
        .patch(`/api/notifications/${notification.id}/read`)
        .set("Authorization", auth);

      // then
      expect(response.status).toBe(204);
      const getResponse = await request(server).get("/api/notifications").set("Authorization", auth);
      expect(getResponse.body.data[0].isRead).toBe(true);
    });

    it("should return 403 when the notification belongs to another user", async () => {
      // given
      const owner = await databaseBuilder.factory.buildUser();
      const otherUser = await databaseBuilder.factory.buildUser();
      const notification = await databaseBuilder.factory.buildNotification({ userId: owner.id });
      const auth = generateAuthenticatedUser(otherUser.id, otherUser.userType);

      // when
      const response = await request(server)
        .patch(`/api/notifications/${notification.id}/read`)
        .set("Authorization", auth);

      // then
      expect(response.status).toBe(403);
    });

    it("should return 404 when the notification does not exist", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const auth = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server).patch("/api/notifications/999999/read").set("Authorization", auth);

      // then
      expect(response.status).toBe(404);
    });
  });

  describe("PATCH /api/notifications/read-all", () => {
    it("should return 204 and mark every notification of the user as read", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      await databaseBuilder.factory.buildNotification({ userId: user.id, isRead: false });
      await databaseBuilder.factory.buildNotification({ userId: user.id, isRead: false });
      const auth = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server).patch("/api/notifications/read-all").set("Authorization", auth);

      // then
      expect(response.status).toBe(204);
      const getResponse = await request(server).get("/api/notifications").set("Authorization", auth);
      expect(getResponse.body.data.every((n) => n.isRead)).toBe(true);
    });
  });

  describe("DELETE /api/notifications/:notificationId", () => {
    it("should return 204 and remove the notification", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const notification = await databaseBuilder.factory.buildNotification({ userId: user.id });
      const auth = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server)
        .delete(`/api/notifications/${notification.id}`)
        .set("Authorization", auth);

      // then
      expect(response.status).toBe(204);
      const getResponse = await request(server).get("/api/notifications").set("Authorization", auth);
      expect(getResponse.body.data).toHaveLength(0);
    });

    it("should return 403 when the notification belongs to another user", async () => {
      // given
      const owner = await databaseBuilder.factory.buildUser();
      const otherUser = await databaseBuilder.factory.buildUser();
      const notification = await databaseBuilder.factory.buildNotification({ userId: owner.id });
      const auth = generateAuthenticatedUser(otherUser.id, otherUser.userType);

      // when
      const response = await request(server)
        .delete(`/api/notifications/${notification.id}`)
        .set("Authorization", auth);

      // then
      expect(response.status).toBe(403);
    });
  });
});
