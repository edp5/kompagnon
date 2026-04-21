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
    const wrapper = mount(HomeView);
    expect(wrapper.find("button").text()).toBe("Se déconnecter");
  });

  it("should clear the store and redirect to login on logout", async () => {
    // given
    const authStore = useAuthStore();
    authStore.setAuth("jwt-token", 1);
    const wrapper = mount(HomeView);

    // when
    await wrapper.find("button").trigger("click");

    // then
    expect(authStore.token).toBeNull();
    expect(authStore.userId).toBeNull();
    expect(mockPush).toHaveBeenCalledWith({ name: "login" });
  });
});
