import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getUserProfile, getUserReviews } from "@/adapters/users.js";
import { useAuthStore } from "@/stores/auth.js";
import ProfileView from "@/views/ProfileView.vue";

vi.mock("@/adapters/users.js", () => ({
  getUserProfile: vi.fn(),
  getUserReviews: vi.fn().mockResolvedValue({
    success: true,
    averageRating: 0,
    reviewCount: 0,
    reviews: [],
  }),
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

  it("should display profile data and reviews when request succeeds", async () => {
    // given
    const authStore = useAuthStore();
    authStore.setAuth("valid-token", 1);
    getUserProfile.mockResolvedValue({
      success: true,
      profile: {
        userId: 1,
        firstname: "Jane",
        lastname: "Doe",
        email: "jane.doe@example.com",
        birthday: "1990-05-15",
      },
    });
    getUserReviews.mockResolvedValue({
      success: true,
      averageRating: 4.8,
      reviewCount: 2,
      reviews: [
        {
          id: 1,
          rating: 5,
          comment: "Super accompagnatrice !",
          authorFirstname: "Paul",
          authorLastname: "Valery",
          created_at: "2026-06-01T10:00:00Z",
        },
      ],
    });

    // when
    const wrapper = mount(ProfileView);
    await flushPromises();

    // then
    expect(getUserProfile).toHaveBeenCalledWith({ token: "valid-token" });
    expect(getUserReviews).toHaveBeenCalledWith({ token: "valid-token", userId: 1 });
    expect(wrapper.text()).toContain("Jane");
    expect(wrapper.text()).toContain("Doe");
    expect(wrapper.text()).toContain("jane.doe@example.com");
    expect(wrapper.text()).toContain("★ 4.8");
    expect(wrapper.text()).toContain("Super accompagnatrice !");
    expect(wrapper.text()).toContain("Paul Valery");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should display empty review state when user has no reviews", async () => {
    // given
    const authStore = useAuthStore();
    authStore.setAuth("valid-token", 1);
    getUserProfile.mockResolvedValue({
      success: true,
      profile: {
        userId: 1,
        firstname: "Jane",
        lastname: "Doe",
        email: "jane.doe@example.com",
        birthday: "1990-05-15",
      },
    });
    getUserReviews.mockResolvedValue({
      success: true,
      averageRating: 0,
      reviewCount: 0,
      reviews: [],
    });

    // when
    const wrapper = mount(ProfileView);
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Aucun avis reçu pour le moment");
  });

  it("should handle review with missing or invalid date gracefully", async () => {
    // given
    const authStore = useAuthStore();
    authStore.setAuth("valid-token", 1);
    getUserProfile.mockResolvedValue({
      success: true,
      profile: {
        userId: 1,
        firstname: "Jane",
        lastname: "Doe",
        email: "jane.doe@example.com",
        birthday: "1990-05-15",
      },
    });
    getUserReviews.mockResolvedValue({
      success: true,
      averageRating: 5,
      reviewCount: 1,
      reviews: [
        {
          id: 2,
          rating: 5,
          authorFirstname: "John",
          authorLastname: "Smith",
          created_at: "invalid-date",
        },
      ],
    });

    // when
    const wrapper = mount(ProfileView);
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("John Smith");
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


