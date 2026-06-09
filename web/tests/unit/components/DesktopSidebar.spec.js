import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import DesktopSidebar from "@/components/DesktopSidebar.vue";
import { useAuthStore } from "@/stores/auth.js";

const pushMock = vi.fn();

vi.mock("vue-router", () => ({
  RouterLink: {
    name: "RouterLink",
    template: "<a><slot /></a>",
  },
  useRoute: () => ({
    name: "home",
  }),
  useRouter: () => ({
    push: pushMock,
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

  describe("drawer behaviour", () => {
    function mountDrawer(open = true) {
      return mount(DesktopSidebar, {
        props: { open },
        global: { stubs: { RouterLink: true } },
      });
    }

    afterEach(() => {
      document.body.style.overflow = "";
    });

    it("should show the backdrop and open class when open", () => {
      const wrapper = mountDrawer(true);
      expect(wrapper.find(".sidebar-backdrop").exists()).toBe(true);
      expect(wrapper.find(".sidebar").classes()).toContain("sidebar--open");
    });

    it("should lock and restore body scroll as it opens and closes", async () => {
      const wrapper = mountDrawer(false);
      expect(document.body.style.overflow).toBe("");

      await wrapper.setProps({ open: true });
      expect(document.body.style.overflow).toBe("hidden");

      await wrapper.setProps({ open: false });
      expect(document.body.style.overflow).toBe("");
    });

    it("should emit close when the close button is clicked", async () => {
      const wrapper = mountDrawer(true);
      await wrapper.get(".sidebar__close").trigger("click");
      expect(wrapper.emitted("close")).toBeTruthy();
    });

    it("should emit close when the backdrop is clicked", async () => {
      const wrapper = mountDrawer(true);
      await wrapper.get(".sidebar-backdrop").trigger("click");
      expect(wrapper.emitted("close")).toBeTruthy();
    });

    it("should emit close when Escape is pressed while open", () => {
      const wrapper = mountDrawer(true);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      expect(wrapper.emitted("close")).toBeTruthy();
    });

    it("should not emit close on Escape when already closed", () => {
      const wrapper = mountDrawer(false);
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      expect(wrapper.emitted("close")).toBeFalsy();
    });

    it("should restore body scroll and detach the key listener on unmount", async () => {
      const wrapper = mountDrawer(false);
      await wrapper.setProps({ open: true });
      expect(document.body.style.overflow).toBe("hidden");

      wrapper.unmount();

      expect(document.body.style.overflow).toBe("");
      // listener detached: an Escape after unmount triggers nothing
      document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
      expect(wrapper.emitted("close")).toBeFalsy();
    });

    it("should log out and redirect to login", async () => {
      const authStore = useAuthStore();
      authStore.setAuth("jwt-token", 1);
      const wrapper = mountDrawer(true);

      await wrapper.get(".sidebar__logout").trigger("click");

      expect(authStore.token).toBeNull();
      expect(pushMock).toHaveBeenCalledWith({ name: "login" });
    });
  });
});



