import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";

import BottomNavigation from "@/components/BottomNavigation.vue";

describe("Unit | Components | BottomNavigation", () => {
  function createWrapper() {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [
        { path: "/", name: "home", component: { template: "<div />" } },
        { path: "/connect", name: "connect", component: { template: "<div />" } },
        { path: "/map", name: "map", component: { template: "<div />" } },
        { path: "/notifications", name: "notifications", component: { template: "<div />" } },
        { path: "/profile", name: "profile", component: { template: "<div />" } },
      ],
    });

    return mount(BottomNavigation, {
      global: {
        plugins: [router],
        stubs: { KIcon: true },
      },
    });
  }

  it("should render the bottom navigation", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".bottom-nav").exists()).toBe(true);
  });

  it("should have correct aria-label", () => {
    const wrapper = createWrapper();
    expect(wrapper.find("nav").attributes("aria-label")).toBe("Navigation principale mobile");
  });

  it("should render all 5 nav items", () => {
    const wrapper = createWrapper();
    const items = wrapper.findAll(".bottom-nav__item");
    expect(items.length).toBe(5);
  });

  it("should render home item", () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain("Accueil");
  });

  it("should render messages item", () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain("Messages");
  });

  it("should render map item", () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain("Carte");
  });

  it("should render notifications item", () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain("Alertes");
  });

  it("should render profile item", () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain("Profil");
  });

  it("should have aria-label on each item", () => {
    const wrapper = createWrapper();
    const items = wrapper.findAll(".bottom-nav__item");
    items.forEach((item) => {
      expect(item.attributes("aria-label")).toBeTruthy();
    });
  });
});
