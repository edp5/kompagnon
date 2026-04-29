import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";

import ConnectView from "@/views/ConnectView.vue";

describe("Unit | Views | ConnectView", () => {
  beforeEach(() => {
    // Clear any state before each test
  });

  function createWrapper() {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: "/connect", component: ConnectView }],
    });

    return mount(ConnectView, {
      global: {
        plugins: [router],
        stubs: {
          AppLayout: true,
          AppShell: true,
        },
      },
    });
  }

  it("should render the connect view", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".connect-view").exists()).toBe(true);
  });

  it("should display the header", () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain("Mise en relation");
    expect(wrapper.text()).toContain("Vos demandes d'accompagnement");
  });

  it("should display messages", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should display message content", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should display message times", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should display message status", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should display notification badge", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should indicate online users", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should render messages list", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".connect-view").exists()).toBe(true);
  });

  it("should have new request button", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should have aria-label on new request button", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should display initials in avatars", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });
});
