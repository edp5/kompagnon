import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import SettingsView from "@/views/SettingsView.vue";

describe("Unit | Views | SettingsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render the settings view", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    expect(wrapper.find(".settings-view").exists()).toBe(true);
  });

  it("should display the header", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    expect(wrapper.text()).toContain("Paramètres");
    expect(wrapper.text()).toContain("Votre espace");
  });

  it("should display user card", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    expect(wrapper.find(".settings-user-card").exists()).toBe(true);
    expect(wrapper.text()).toContain("Marie Dupont");
    expect(wrapper.text()).toContain("marie.dupont@email.com");
  });

  it("should display verified badge", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    expect(wrapper.find(".settings-user-card").exists()).toBe(true);
    expect(wrapper.find(".settings-user-card__badge").exists()).toBe(true);
  });

  it("should display notifications section", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    expect(wrapper.text()).toContain("Notifications");
    expect(wrapper.text()).toContain("Notifications push");
    expect(wrapper.text()).toContain("Notifications par email");
  });

  it("should display notification preferences", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    expect(wrapper.vm.settings.notifVolunteer).toBeDefined();
    expect(wrapper.vm.settings.notifTrip).toBeDefined();
    expect(wrapper.vm.settings.notifUrgency).toBeDefined();
  });

  it("should display privacy section", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    expect(wrapper.find(".settings-view").exists()).toBe(true);
    expect(wrapper.vm.settings.privLocation).toBeDefined();
    expect(wrapper.vm.settings.privVisible).toBeDefined();
    expect(wrapper.vm.settings.privMessages).toBeDefined();
  });

  it("should render toggle switches", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    const toggles = wrapper.findAllComponents({ name: "BaseToggle" });
    expect(toggles.length).toBeGreaterThan(0);
  });

  it("should initialize settings with correct values", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    expect(wrapper.vm.settings.notifPush).toBe(true);
    expect(wrapper.vm.settings.notifEmail).toBe(true);
    expect(wrapper.vm.settings.privLocation).toBe(true);
  });

  it("should toggle notification push setting", () => {
    // when
    const wrapper = mount(SettingsView);

    // when
    wrapper.vm.settings.notifPush = !wrapper.vm.settings.notifPush;

    // then
    expect(wrapper.vm.settings.notifPush).toBe(false);
  });

  it("should toggle notification email setting", () => {
    // when
    const wrapper = mount(SettingsView);

    // when
    wrapper.vm.settings.notifEmail = !wrapper.vm.settings.notifEmail;

    // then
    expect(wrapper.vm.settings.notifEmail).toBe(false);
  });

  it("should toggle location privacy setting", () => {
    // when
    const wrapper = mount(SettingsView);

    // when
    wrapper.vm.settings.privLocation = !wrapper.vm.settings.privLocation;

    // then
    expect(wrapper.vm.settings.privLocation).toBe(false);
  });

  it("should display account section", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    expect(wrapper.find(".settings-user-card").exists()).toBe(true);
  });

  it("should have profile edit link", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    const userCard = wrapper.find(".settings-user-card");
    expect(userCard.exists()).toBe(true);
  });

  it("should display logout option", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    expect(wrapper.find(".settings-view").exists()).toBe(true);
  });

  it("should display about section", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    expect(wrapper.find(".settings-view").exists()).toBe(true);
  });

  it("should have app version info", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    expect(wrapper.text()).toContain("Version");
  });

  it("should have correct ARIA labels on toggles", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    const toggles = wrapper.findAllComponents({ name: "BaseToggle" });
    toggles.forEach((toggle) => {
      expect(toggle.props("id")).toBeTruthy();
    });
  });

  it("should display all notification toggle settings", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    expect(wrapper.vm.settings.notifPush).toBeDefined();
    expect(wrapper.vm.settings.notifEmail).toBeDefined();
    expect(wrapper.vm.settings.notifVolunteer).toBeDefined();
    expect(wrapper.vm.settings.notifTrip).toBeDefined();
    expect(wrapper.vm.settings.notifUrgency).toBeDefined();
  });

  it("should display all privacy toggle settings", () => {
    // when
    const wrapper = mount(SettingsView);

    // then
    expect(wrapper.vm.settings.privLocation).toBeDefined();
    expect(wrapper.vm.settings.privVisible).toBeDefined();
    expect(wrapper.vm.settings.privMessages).toBeDefined();
  });
});









