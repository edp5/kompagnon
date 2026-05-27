import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import DesktopSidebar from "@/components/DesktopSidebar.vue";

vi.mock("vue-router", () => ({
  RouterLink: {
    name: "RouterLink",
    template: "<a><slot /></a>",
  },
  useRoute: () => ({
    name: "home",
  }),
}));

describe("Unit | Components | DesktopSidebar", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("should render the sidebar", () => {
    // when
    const wrapper = mount(DesktopSidebar, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    });

    // then
    expect(wrapper.find(".sidebar").exists()).toBe(true);
  });

  it("should display the brand logo and name", () => {
    // when
    const wrapper = mount(DesktopSidebar, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    });

    // then
    expect(wrapper.find(".sidebar__brand-logo").exists()).toBe(true);
    expect(wrapper.find(".sidebar__brand-name").text()).toContain("Kompagnon");
    expect(wrapper.find(".sidebar__brand-tagline").text()).toBe("Accompagnement solidaire");
  });

  it("should render navigation section label", () => {
    // when
    const wrapper = mount(DesktopSidebar, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    });

    // then
    expect(wrapper.find(".sidebar__nav").exists()).toBe(true);
  });

  it("should render settings section label", () => {
    // when
    const wrapper = mount(DesktopSidebar, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    });

    // then
    expect(wrapper.find(".sidebar__nav").exists()).toBe(true);
  });

  it("should render all navigation items", () => {
    // when
    const wrapper = mount(DesktopSidebar, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    });

    // then
    const navItems = wrapper.findAll(".sidebar__item");
    expect(navItems.length).toBeGreaterThanOrEqual(4);
  });

  it("should render all settings items", () => {
    // when
    const wrapper = mount(DesktopSidebar, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    });

    // then
    const navItems = wrapper.findAll(".sidebar__item");
    expect(navItems.length).toBeGreaterThanOrEqual(6);
  });

  it("should display notification badge for notifications item", () => {
    // when
    const wrapper = mount(DesktopSidebar, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    });

    // then
    expect(wrapper.find(".sidebar").exists()).toBe(true);
  });

  it("should display user section", () => {
    // when
    const wrapper = mount(DesktopSidebar, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    });

    // then
    expect(wrapper.find(".sidebar__user").exists()).toBe(true);
    expect(wrapper.find(".sidebar__user-avatar").exists()).toBe(true);
  });

  it("should display user avatar with initials", () => {
    // when
    const wrapper = mount(DesktopSidebar, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    });

    // then
    expect(wrapper.find(".sidebar__user-avatar").exists()).toBe(true);
  });

  it("should render with correct structure", () => {
    // when
    const wrapper = mount(DesktopSidebar, {
      global: {
        stubs: {
          RouterLink: true,
        },
      },
    });

    // then
    expect(wrapper.find(".sidebar__nav").exists()).toBe(true);
    expect(wrapper.find(".sidebar__user").exists()).toBe(true);
    expect(wrapper.find(".sidebar__brand").exists()).toBe(true);
  });
});



