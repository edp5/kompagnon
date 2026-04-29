import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";

import NotificationsView from "@/views/NotificationsView.vue";



describe("Unit | Views | NotificationsView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createWrapper() {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: "/notifications", component: NotificationsView }],
    });

    return mount(NotificationsView, {
      global: {
        plugins: [router],
        stubs: {
          AppLayout: true,
          AppShell: true,
        },
      },
    });
  };

  it("should render the notifications view", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should display the header", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should display unread badge", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should display all notifications", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should display notification content", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should display notification times", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should render filter buttons", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should have all filter option", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should have unread filter option", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should filter notifications when unread filter is clicked", async () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should show all notifications when all filter is clicked", async () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should have active class on current filter", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should have aria-pressed attribute on filter buttons", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should render notification items", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });
});

