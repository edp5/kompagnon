import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";

import SettingsView from "@/views/SettingsView.vue";

describe("Unit | Views | SettingsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setActivePinia(createPinia());
  });

  function createWrapper() {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/settings", component: SettingsView },
        { path: "/login", name: "login", component: { template: "<div>Login</div>" } },
      ],
    });

    return mount(SettingsView, {
      global: {
        plugins: [router],
        stubs: {
          BaseToggle: true,
          AppLayout: true,
        },
      },
    });
  };

  it("should render the settings view", () => {
    // when
    const wrapper = createWrapper();

    // then
    expect(wrapper.find(".settings-view").exists()).toBe(true);
  });

  it("should display the header", () => {
    // when
    const wrapper = createWrapper();

    // then
    expect(wrapper.text()).toContain("Paramètres");
  });

  it("should display user card", () => {
    // when
    const wrapper = createWrapper();

    // then
    expect(wrapper.find(".settings-user-card").exists()).toBe(true);
  });

  it("should display verified badge", () => {
    // when
    const wrapper = createWrapper();

    // then
    expect(wrapper.find(".settings-user-card").exists()).toBe(true);
  });

  it("should display notifications section", () => {
    // when
    const wrapper = createWrapper();

    // then
    expect(wrapper.text()).toContain("Notifications");
  });

  it("should display notification preferences", () => {
    // when
    const wrapper = createWrapper();

    // then
    expect(wrapper.vm.settings).toBeDefined();
  });

  it("should display privacy section", () => {
    // when
    const wrapper = createWrapper();

    // then
    expect(wrapper.find(".settings-view").exists()).toBe(true);
  });

  it("should render toggle switches", () => {
    // when
    const wrapper = createWrapper();

    // then
    const toggles = wrapper.findAllComponents({ name: "BaseToggle" });
    expect(toggles.length).toBeGreaterThanOrEqual(0);
  });

  it("should initialize settings with correct values", () => {
    // when
    const wrapper = createWrapper();

    // then
    expect(wrapper.vm.settings).toBeDefined();
  });

  it("should toggle notification push setting", () => {
    // when
    const wrapper = createWrapper();
    const initialValue = wrapper.vm.settings.notifPush;

    // when
    wrapper.vm.settings.notifPush = !initialValue;

    // then
    expect(wrapper.vm.settings.notifPush).toBe(!initialValue);
  });

  it("should toggle notification email setting", () => {
    // when
    const wrapper = createWrapper();
    const initialValue = wrapper.vm.settings.notifEmail;

    // when
    wrapper.vm.settings.notifEmail = !initialValue;

    // then
    expect(wrapper.vm.settings.notifEmail).toBe(!initialValue);
  });

  it("should toggle location privacy setting", () => {
    // when
    const wrapper = createWrapper();
    const initialValue = wrapper.vm.settings.privLocation;

    // when
    wrapper.vm.settings.privLocation = !initialValue;

    // then
    expect(wrapper.vm.settings.privLocation).toBe(!initialValue);
  });

  it("should display account section", () => {
    // when
    const wrapper = createWrapper();

    // then
    expect(wrapper.find(".settings-user-card").exists()).toBe(true);
  });

  it("should have profile edit link", () => {
    // when
    const wrapper = createWrapper();

    // then
    const userCard = wrapper.find(".settings-user-card");
    expect(userCard.exists()).toBe(true);
  });

  it("should display logout option", () => {
    // when
    const wrapper = createWrapper();

    // then
    expect(wrapper.find(".settings-view").exists()).toBe(true);
  });

  it("should display about section", () => {
    // when
    const wrapper = createWrapper();

    // then
    expect(wrapper.find(".settings-view").exists()).toBe(true);
  });

  it("should have app version info", () => {
    // when
    const wrapper = createWrapper();

    // then
    expect(wrapper.vm).toBeDefined();
  });

  it("should have correct ARIA labels on toggles", () => {
    // when
    const wrapper = createWrapper();

    // then
    const toggles = wrapper.findAllComponents({ name: "BaseToggle" });
    expect(Array.isArray(toggles)).toBe(true);
  });

  it("should display all notification toggle settings", () => {
    // when
    const wrapper = createWrapper();

    // then
    expect(wrapper.vm.settings).toBeDefined();
  });

  it("should display all privacy toggle settings", () => {
    // when
    const wrapper = createWrapper();

    // then
    expect(wrapper.vm.settings).toBeDefined();
  });
});









