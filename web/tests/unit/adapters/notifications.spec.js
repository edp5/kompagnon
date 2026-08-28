import { afterEach, describe, expect, it, vi } from "vitest";

import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/adapters/notifications.js";

describe("Unit | Adapters | Notifications", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("#getNotifications", () => {
    const notificationsList = [
      {
        id: 1,
        type: "journey_match_found",
        title: "Nouvelle correspondance",
        message: "Une correspondance a été trouvée pour votre trajet.",
        isRead: false,
        created_at: "2026-06-13T11:32:38.325Z",
      },
    ];

    it("should GET the notifications with the bearer token and return them", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: notificationsList }),
      });

      // when
      const result = await getNotifications({ token: "jwt-token" });

      // then
      expect(result).toEqual({ success: true, notifications: notificationsList });
      expect(fetchSpy).toHaveBeenCalledWith("/api/notifications", {
        method: "GET",
        headers: { Authorization: "Bearer jwt-token" },
      });
    });

    it("should return an empty array when the API returns no notifications", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });

      // when
      const result = await getNotifications({ token: "jwt-token" });

      // then
      expect(result).toEqual({ success: true, notifications: [] });
    });

    it("should default to an empty array when the response has no data field", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({}),
      });

      // when
      const result = await getNotifications({ token: "jwt-token" });

      // then
      expect(result).toEqual({ success: true, notifications: [] });
    });

    it("should return a session expired message on 401", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 401 });

      // when
      const result = await getNotifications({ token: "jwt-token" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Session expirée. Merci de vous reconnecter.");
    });

    it("should return a generic failure message on other errors", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 500 });

      // when
      const result = await getNotifications({ token: "jwt-token" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de récupérer vos notifications. Veuillez réessayer.");
    });

    it("should handle network errors gracefully", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await getNotifications({ token: "jwt-token" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });

  describe("#markNotificationAsRead", () => {
    it("should PATCH the notification as read with the bearer token", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({ ok: true });

      // when
      const result = await markNotificationAsRead({ token: "jwt-token", notificationId: 7 });

      // then
      expect(fetchSpy).toHaveBeenCalledWith("/api/notifications/7/read", {
        method: "PATCH",
        headers: { Authorization: "Bearer jwt-token" },
      });
      expect(result).toEqual({ success: true });
    });

    it("should return a failure message when the response is not ok", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 404 });

      // when
      const result = await markNotificationAsRead({ token: "jwt-token", notificationId: 7 });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de marquer la notification comme lue.");
    });

    it("should handle network errors gracefully", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await markNotificationAsRead({ token: "jwt-token", notificationId: 7 });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });

  describe("#markAllNotificationsAsRead", () => {
    it("should PATCH all notifications as read with the bearer token", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({ ok: true });

      // when
      const result = await markAllNotificationsAsRead({ token: "jwt-token" });

      // then
      expect(fetchSpy).toHaveBeenCalledWith("/api/notifications/read-all", {
        method: "PATCH",
        headers: { Authorization: "Bearer jwt-token" },
      });
      expect(result).toEqual({ success: true });
    });

    it("should return a failure message when the response is not ok", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 500 });

      // when
      const result = await markAllNotificationsAsRead({ token: "jwt-token" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de marquer les notifications comme lues.");
    });

    it("should handle network errors gracefully", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await markAllNotificationsAsRead({ token: "jwt-token" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });

  describe("#deleteNotification", () => {
    it("should DELETE the notification with the bearer token", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({ ok: true });

      // when
      const result = await deleteNotification({ token: "jwt-token", notificationId: 7 });

      // then
      expect(fetchSpy).toHaveBeenCalledWith("/api/notifications/7", {
        method: "DELETE",
        headers: { Authorization: "Bearer jwt-token" },
      });
      expect(result).toEqual({ success: true });
    });

    it("should return a failure message when the response is not ok", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 403 });

      // when
      const result = await deleteNotification({ token: "jwt-token", notificationId: 7 });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de supprimer la notification.");
    });

    it("should handle network errors gracefully", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await deleteNotification({ token: "jwt-token", notificationId: 7 });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });
});
