import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { loginUser } from "@/adapters/authentication.js";
import { useAuthStore } from "@/stores/auth.js";
import LoginView from "@/views/authentication/LoginView.vue";

vi.mock("@/adapters/authentication.js", () => ({
  loginUser: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

async function fillForm(wrapper) {
  await wrapper.get("input[name=\"email\"]").setValue("admin@example.com");
  await wrapper.get("input.password-input").setValue("password123");
}

describe("Unit | Views | Authentication | LoginView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
  });

  it("should store the token and redirect to home after a successful login", async () => {
    // given
    loginUser.mockResolvedValue({ success: true, token: "jwt-token", userId: 1 });

    // when
    const wrapper = mount(LoginView);
    const authStore = useAuthStore();
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(loginUser).toHaveBeenCalledWith({
      email: "admin@example.com",
      password: "password123",
    });
    expect(authStore.token).toBe("jwt-token");
    expect(authStore.userId).toBe(1);
    expect(mockPush).toHaveBeenCalledWith({ name: "home" });
  });

  it("should show an error message if the login fails", async () => {
    // given
    loginUser.mockResolvedValue({
      success: false,
      message: "Identifiants incorrects.",
    });

    // when
    const wrapper = mount(LoginView);
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Identifiants incorrects.");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should show fallback error message when login fails without message", async () => {
    // given
    loginUser.mockResolvedValue({
      success: false,
    });

    // when
    const wrapper = mount(LoginView);
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Une erreur est survenue lors de la connexion.");
  });
});
