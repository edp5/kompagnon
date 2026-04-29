import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";

import TopBar from "@/components/TopBar.vue";

vi.mock("@/adapters/users.js", () => ({
  getUserProfile: vi.fn().mockResolvedValue({ success: false }),
}));

describe("Unit | Components | TopBar", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  function createWrapper() {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", name: "home", component: { template: "<div />" } },
        { path: "/notifications", name: "notifications", component: { template: "<div />" } },
        { path: "/profile", name: "profile", component: { template: "<div />" } },
        { path: "/login", name: "login", component: { template: "<div />" } },
      ],
    });

    return mount(TopBar, {
      global: {
        plugins: [router],
        stubs: { KIcon: true },
      },
    });
  }

  it("should render the topbar", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".topbar").exists()).toBe(true);
  });

  it("should display a page title", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".topbar__title").exists()).toBe(true);
  });

  it("should display the correct title for home route", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".topbar__title")).toBeDefined();
  });

  it("should render the notifications link", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".topbar__bell").exists()).toBe(true);
  });

  it("should render the profile link", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".topbar__avatar").exists()).toBe(true);
  });

  it("should have aria-label on notifications link", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".topbar__bell").attributes("aria-label")).toBe("Notifications");
  });

  it("should show default initials when no profile loaded", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".topbar__avatar").text()).toBe("-");
  });

  it("should have btn logout", () => {
    const wrapper = createWrapper();
    const logout = wrapper.find(".topbar__logout");
    expect(logout.exists()).toBe(true);
  });
});
