import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";

import AppLayout from "@/components/AppLayout.vue";

const SidebarStub = {
  name: "DesktopSidebar",
  props: ["open"],
  emits: ["close"],
  template: "<aside data-test=\"sidebar\" :data-open=\"open\"><button data-test=\"sidebar-close\" @click=\"$emit('close')\" /></aside>",
};

const BottomStub = {
  name: "BottomNavigation",
  emits: ["open-menu"],
  template: "<nav><button data-test=\"open-menu\" @click=\"$emit('open-menu')\" /></nav>",
};

const TopStub = { name: "TopBar", template: "<header />" };

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: "/", name: "home", component: { template: "<div />" } },
    { path: "/map", name: "map", component: { template: "<div />" } },
  ],
});

function mountLayout() {
  return mount(AppLayout, {
    global: {
      plugins: [router],
      stubs: { DesktopSidebar: SidebarStub, TopBar: TopStub, BottomNavigation: BottomStub },
    },
  });
}

function sidebarOpen(wrapper) {
  return wrapper.get("[data-test=\"sidebar\"]").attributes("data-open");
}

describe("Unit | Components | AppLayout", () => {
  beforeEach(async () => {
    await router.push("/");
    await router.isReady();
  });

  it("keeps the drawer closed by default", () => {
    const wrapper = mountLayout();
    expect(sidebarOpen(wrapper)).toBe("false");
  });

  it("opens the drawer when the bottom navigation requests it", async () => {
    const wrapper = mountLayout();
    await wrapper.get("[data-test=\"open-menu\"]").trigger("click");
    expect(sidebarOpen(wrapper)).toBe("true");
  });

  it("closes the drawer when the sidebar emits close", async () => {
    const wrapper = mountLayout();
    await wrapper.get("[data-test=\"open-menu\"]").trigger("click");
    await wrapper.get("[data-test=\"sidebar-close\"]").trigger("click");
    expect(sidebarOpen(wrapper)).toBe("false");
  });

  it("closes the drawer on route change", async () => {
    const wrapper = mountLayout();
    await wrapper.get("[data-test=\"open-menu\"]").trigger("click");
    expect(sidebarOpen(wrapper)).toBe("true");

    await router.push("/map");
    await flushPromises();

    expect(sidebarOpen(wrapper)).toBe("false");
  });
});
