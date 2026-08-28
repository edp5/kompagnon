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
