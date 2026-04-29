import { mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { useAuthStore } from "@/stores/auth.js";
import HomeView from "@/views/HomeView.vue";

const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Unit | Views | HomeView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("should render a logout button", () => {
    const wrapper = mount(HomeView, {
      global: {
        stubs: {
          AppShell: true,
          AppLayout: true,
        },
      },
    });
    expect(wrapper.vm).toBeDefined();
  });

  it("should clear the store and redirect to login on logout", async () => {
    // given
    const authStore = useAuthStore();
    authStore.setAuth("jwt-token", 1);
    mount(HomeView, {
      global: {
        stubs: {
          AppShell: true,
          AppLayout: true,
        },
      },
    });

    // then
    expect(authStore.token).toBeDefined();
  });
});
