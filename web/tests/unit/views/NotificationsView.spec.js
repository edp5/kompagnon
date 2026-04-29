import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import NotificationsView from "@/views/NotificationsView.vue";

describe("Unit | Views | NotificationsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the notifications view", () => {
    // when
    const wrapper = mount(NotificationsView);

    // then
    expect(wrapper.find(".notif-view").exists()).toBe(true);
  });

  it("should display the header", () => {
    // when
    const wrapper = mount(NotificationsView);

    // then
    expect(wrapper.text()).toContain("Notifications");
    expect(wrapper.text()).toContain("Centre de messages");
  });

  it("should display unread badge", () => {
    // when
    const wrapper = mount(NotificationsView);

    // then
    expect(wrapper.text()).toContain("non lue");
  });

  it("should display all notifications", () => {
    // when
    const wrapper = mount(NotificationsView);

    // then
    expect(wrapper.text()).toContain("Accompagnement terminé");
    expect(wrapper.text()).toContain("Nouveau volontaire disponible");
    expect(wrapper.text()).toContain("Rendez-vous dans 30 min");
    expect(wrapper.text()).toContain("Nouvel avis reçu");
    expect(wrapper.text()).toContain("Mise à jour disponible");
  });

  it("should display notification content", () => {
    // when
    const wrapper = mount(NotificationsView);

    // then
    expect(wrapper.text()).toContain("pharmacie");
    expect(wrapper.text()).toContain("Thomas R.");
    expect(wrapper.text()).toContain("Sophie M.");
    expect(wrapper.text()).toContain("Marie L.");
  });

  it("should display notification times", () => {
    // when
    const wrapper = mount(NotificationsView);

    // then
    expect(wrapper.text()).toContain("Il y a 10 min");
    expect(wrapper.text()).toContain("Il y a 1h");
    expect(wrapper.text()).toContain("Il y a 2h");
    expect(wrapper.text()).toContain("Hier");
  });

  it("should render filter buttons", () => {
    // when
    const wrapper = mount(NotificationsView);

    // then
    const buttons = wrapper.findAll(".notif-filter-btn");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should have all filter option", () => {
    // when
    const wrapper = mount(NotificationsView);

    // then
    const allButton = wrapper.findAll(".notif-filter-btn")[0];
    expect(allButton.text()).toContain("Tout");
  });

  it("should have unread filter option", () => {
    // when
    const wrapper = mount(NotificationsView);

    // then
    const unreadButton = wrapper.findAll(".notif-filter-btn")[1];
    expect(unreadButton.text()).toContain("Non lues");
  });

  it("should filter notifications when unread filter is clicked", async () => {
    // given
    const wrapper = mount(NotificationsView);
    const unreadButton = wrapper.findAll(".notif-filter-btn")[1];

    // when
    await unreadButton.trigger("click");

    // then
    expect(wrapper.vm.activeFilter).toBe("unread");
    expect(wrapper.vm.displayed.length).toBeLessThan(wrapper.vm.notifications.length);
  });

  it("should show all notifications when all filter is clicked", async () => {
    // given
    const wrapper = mount(NotificationsView);
    const unreadButton = wrapper.findAll(".notif-filter-btn")[1];
    await unreadButton.trigger("click");

    const allButton = wrapper.findAll(".notif-filter-btn")[0];

    // when
    await allButton.trigger("click");

    // then
    expect(wrapper.vm.activeFilter).toBe("all");
    expect(wrapper.vm.displayed.length).toBe(wrapper.vm.notifications.length);
  });

  it("should have active class on current filter", () => {
    // when
    const wrapper = mount(NotificationsView);

    // then
    const allButton = wrapper.findAll(".notif-filter-btn")[0];
    expect(allButton.classes()).toContain("notif-filter-btn--active");
  });

  it("should have aria-pressed attribute on filter buttons", () => {
    // when
    const wrapper = mount(NotificationsView);

    // then
    const buttons = wrapper.findAll(".notif-filter-btn");
    buttons.forEach((button) => {
      expect(button.attributes("aria-pressed")).toBeDefined();
    });
  });

  it("should render notification items", () => {
    // when
    const wrapper = mount(NotificationsView);

    // then
    const items = wrapper.findAll(".notif-item");
    expect(items.length).toBeGreaterThan(0);
  });
});

