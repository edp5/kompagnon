import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  deleteNotification,
  getNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/adapters/notifications.js";
import { useAuthStore } from "@/stores/auth.js";
import NotificationsView from "@/views/NotificationsView.vue";

vi.mock("@/adapters/notifications.js", () => ({
  deleteNotification: vi.fn(),
  getNotifications: vi.fn(),
  markAllNotificationsAsRead: vi.fn(),
  markNotificationAsRead: vi.fn(),
}));

const now = new Date();

const readNotification = {
  id: 1,
  type: "journey_match_found",
  title: "Nouvelle correspondance",
  message: "Une correspondance a été trouvée avec un accompagnateur pour votre trajet.",
  isRead: true,
  created_at: now.toISOString(),
};

const unreadNotification = {
  id: 2,
  type: "journey_match_found",
  title: "Autre correspondance",
  message: "Une correspondance a été trouvée avec une personne à accompagner pour votre trajet.",
  isRead: false,
  created_at: now.toISOString(),
};

async function mountView() {
  const wrapper = mount(NotificationsView);
  await flushPromises();
  return wrapper;
}

describe("Unit | Views | NotificationsView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    const authStore = useAuthStore();
    authStore.setAuth("jwt-token", 1);

    vi.clearAllMocks();
    getNotifications.mockResolvedValue({ success: true, notifications: [] });
  });

  it("should display a loading indicator while fetching notifications", () => {
    // given
    getNotifications.mockReturnValue(new Promise(() => {}));

    // when
    const wrapper = mount(NotificationsView);

    // then
    expect(wrapper.text()).toContain("Chargement des notifications");
  });

  it("should request the notifications with the authenticated token", async () => {
    // when
    await mountView();

    // then
    expect(getNotifications).toHaveBeenCalledWith({ token: "jwt-token" });
  });

  it("should display an error message when the fetch fails", async () => {
    // given
    getNotifications.mockResolvedValue({ success: false, message: "Impossible de récupérer vos notifications." });

    // when
    const wrapper = await mountView();

    // then
    expect(wrapper.text()).toContain("Impossible de récupérer vos notifications.");
  });

  it("should display a generic error message when the fetch fails without a message", async () => {
    // given
    getNotifications.mockResolvedValue({ success: false });

    // when
    const wrapper = await mountView();

    // then
    expect(wrapper.text()).toContain("Impossible de récupérer vos notifications.");
  });

  it("should display the notifications returned by the API", async () => {
    // given
    getNotifications.mockResolvedValue({ success: true, notifications: [readNotification, unreadNotification] });

    // when
    const wrapper = await mountView();

    // then
    expect(wrapper.text()).toContain("Nouvelle correspondance");
    expect(wrapper.text()).toContain("Autre correspondance");
    expect(wrapper.findAll(".notif-item")).toHaveLength(2);
  });

  it("should display the unread count in the header and the unread banner", async () => {
    // given
    getNotifications.mockResolvedValue({ success: true, notifications: [readNotification, unreadNotification] });

    // when
    const wrapper = await mountView();

    // then
    expect(wrapper.find(".notif-header__badge").text()).toContain("1 non lue");
    expect(wrapper.find(".notif-banner").exists()).toBe(true);
  });

  it("should not display the unread banner when every notification is read", async () => {
    // given
    getNotifications.mockResolvedValue({ success: true, notifications: [readNotification] });

    // when
    const wrapper = await mountView();

    // then
    expect(wrapper.find(".notif-banner").exists()).toBe(false);
    expect(wrapper.find(".notif-header__badge").exists()).toBe(false);
  });

  it("should only display unread notifications when the unread filter is active", async () => {
    // given
    getNotifications.mockResolvedValue({ success: true, notifications: [readNotification, unreadNotification] });
    const wrapper = await mountView();

    // when
    await wrapper.findAll(".notif-filter-btn")[1].trigger("click");

    // then
    expect(wrapper.findAll(".notif-item")).toHaveLength(1);
    expect(wrapper.text()).toContain("Autre correspondance");
    expect(wrapper.text()).not.toContain("Nouvelle correspondance");
  });

  it("should show every notification again when the all filter is clicked back", async () => {
    // given
    getNotifications.mockResolvedValue({ success: true, notifications: [readNotification, unreadNotification] });
    const wrapper = await mountView();
    await wrapper.findAll(".notif-filter-btn")[1].trigger("click");

    // when
    await wrapper.findAll(".notif-filter-btn")[0].trigger("click");

    // then
    expect(wrapper.findAll(".notif-item")).toHaveLength(2);
  });

  it("should format notification times relative to their age", async () => {
    // given
    const minutesAgo = new Date(Date.now() - 15 * 60 * 1000);
    const hoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const yesterday = new Date(Date.now() - 25 * 60 * 60 * 1000);
    const daysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    const longAgo = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000);
    getNotifications.mockResolvedValue({
      success: true,
      notifications: [
        { ...readNotification, id: 10, created_at: minutesAgo.toISOString() },
        { ...readNotification, id: 11, created_at: hoursAgo.toISOString() },
        { ...readNotification, id: 12, created_at: yesterday.toISOString() },
        { ...readNotification, id: 13, created_at: daysAgo.toISOString() },
        { ...readNotification, id: 14, created_at: longAgo.toISOString() },
      ],
    });

    // when
    const wrapper = await mountView();

    // then
    const times = wrapper.findAll(".notif-item__time").map((t) => t.text());
    expect(times[0]).toBe("il y a 15 min");
    expect(times[1]).toBe("il y a 3 h");
    expect(times[2]).toBe("hier");
    expect(times[3]).toBe("il y a 3 j");
    expect(times[4]).toBe(longAgo.toLocaleDateString("fr-FR", { day: "numeric", month: "long" }));
  });

  it("should mark a single notification as read when clicked", async () => {
    // given
    getNotifications.mockResolvedValue({ success: true, notifications: [unreadNotification] });
    markNotificationAsRead.mockResolvedValue({ success: true });
    const wrapper = await mountView();

    // when
    await wrapper.find(".notif-item__mark").trigger("click");
    await flushPromises();

    // then
    expect(markNotificationAsRead).toHaveBeenCalledWith({ token: "jwt-token", notificationId: 2 });
    expect(wrapper.find(".notif-item__mark").exists()).toBe(false);
  });

  it("should keep the notification unread when marking it as read fails", async () => {
    // given
    getNotifications.mockResolvedValue({ success: true, notifications: [unreadNotification] });
    markNotificationAsRead.mockResolvedValue({ success: false, message: "Impossible de marquer la notification comme lue." });
    const wrapper = await mountView();

    // when
    await wrapper.find(".notif-item__mark").trigger("click");
    await flushPromises();

    // then
    expect(wrapper.find(".notif-item__mark").exists()).toBe(true);
  });

  it("should mark every notification as read when the banner link is clicked", async () => {
    // given
    getNotifications.mockResolvedValue({ success: true, notifications: [unreadNotification] });
    markAllNotificationsAsRead.mockResolvedValue({ success: true });
    const wrapper = await mountView();

    // when
    await wrapper.find(".notif-banner__link").trigger("click");
    await flushPromises();

    // then
    expect(markAllNotificationsAsRead).toHaveBeenCalledWith({ token: "jwt-token" });
    expect(wrapper.find(".notif-banner").exists()).toBe(false);
  });

  it("should keep notifications unread when marking all as read fails", async () => {
    // given
    getNotifications.mockResolvedValue({ success: true, notifications: [unreadNotification] });
    markAllNotificationsAsRead.mockResolvedValue({ success: false, message: "Impossible de marquer les notifications comme lues." });
    const wrapper = await mountView();

    // when
    await wrapper.find(".notif-banner__link").trigger("click");
    await flushPromises();

    // then
    expect(wrapper.find(".notif-banner").exists()).toBe(true);
  });

  it("should not display a time when the notification has no valid date", async () => {
    // given
    getNotifications.mockResolvedValue({
      success: true,
      notifications: [{ ...readNotification, created_at: "not-a-date" }],
    });

    // when
    const wrapper = await mountView();

    // then
    expect(wrapper.find(".notif-item__time").text()).toBe("");
  });

  it("should fall back to the default presentation for an unknown notification type", async () => {
    // given
    getNotifications.mockResolvedValue({
      success: true,
      notifications: [{ ...readNotification, type: "some_future_type" }],
    });

    // when
    const wrapper = await mountView();

    // then
    expect(wrapper.find(".notif-item__icon").attributes("style")).toContain("rgba(15, 23, 42, 0.06)");
  });

  it("should use the plural form when several notifications are unread", async () => {
    // given
    const secondUnread = { ...unreadNotification, id: 3, title: "Troisième correspondance" };
    getNotifications.mockResolvedValue({ success: true, notifications: [unreadNotification, secondUnread] });

    // when
    const wrapper = await mountView();

    // then
    expect(wrapper.find(".notif-header__badge").text()).toContain("2 non lues");
    expect(wrapper.find(".notif-banner__left").text()).toContain("2 notifications non lues");
  });

  it("should remove a notification from the list once deleted", async () => {
    // given
    getNotifications.mockResolvedValue({ success: true, notifications: [readNotification] });
    deleteNotification.mockResolvedValue({ success: true });
    const wrapper = await mountView();

    // when
    await wrapper.find(".notif-item__del").trigger("click");
    await flushPromises();

    // then
    expect(deleteNotification).toHaveBeenCalledWith({ token: "jwt-token", notificationId: 1 });
    expect(wrapper.findAll(".notif-item")).toHaveLength(0);
  });

  it("should keep the notification in the list when deletion fails", async () => {
    // given
    getNotifications.mockResolvedValue({ success: true, notifications: [readNotification] });
    deleteNotification.mockResolvedValue({ success: false, message: "Impossible de supprimer la notification." });
    const wrapper = await mountView();

    // when
    await wrapper.find(".notif-item__del").trigger("click");
    await flushPromises();

    // then
    expect(wrapper.findAll(".notif-item")).toHaveLength(1);
  });

  it("should mark the active filter button with aria-pressed", async () => {
    // when
    const wrapper = await mountView();

    // then
    const [allButton, unreadButton] = wrapper.findAll(".notif-filter-btn");
    expect(allButton.attributes("aria-pressed")).toBe("true");
    expect(unreadButton.attributes("aria-pressed")).toBe("false");
  });
});
