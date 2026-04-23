import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getUserProfile } from "@/adapters/users.js";
import { useAuthStore } from "@/stores/auth.js";
import ProfileView from "@/views/ProfileView.vue";

vi.mock("@/adapters/users.js", () => ({
  getUserProfile: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe("Unit | Views | ProfileView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setActivePinia(createPinia());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should display profile data when request succeeds", async () => {
    // given
    const authStore = useAuthStore();
    authStore.setAuth("valid-token", 1);
    getUserProfile.mockResolvedValue({
      success: true,
      profile: {
        firstname: "Jane",
        lastname: "Doe",
        email: "jane.doe@example.com",
        birthday: "1990-05-15",
      },
    });

    // when
    const wrapper = mount(ProfileView);
    await flushPromises();

    // then
    expect(getUserProfile).toHaveBeenCalledWith({ token: "valid-token" });
    expect(wrapper.text()).toContain("Jane");
    expect(wrapper.text()).toContain("Doe");
    expect(wrapper.text()).toContain("jane.doe@example.com");
    expect(wrapper.text()).toContain("1990-05-15");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should clear token and redirect to login when session is expired", async () => {
    // given
    const authStore = useAuthStore();
    authStore.setAuth("expired-token", 1);
    getUserProfile.mockResolvedValue({
      success: false,
      errorCode: "SESSION_EXPIRED",
      message: "Session expirée. Merci de vous reconnecter.",
    });

    // when
    mount(ProfileView);
    await flushPromises();

    // then
    expect(authStore.token).toBe(null);
    expect(authStore.userId).toBe(null);
    expect(mockPush).toHaveBeenCalledWith({ name: "login" });
  });
});
