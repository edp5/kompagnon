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
const mockRoute = {
  query: {},
};

vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useRoute: () => mockRoute,
  RouterLink: {
    template: "<a><slot /></a>",
  },
}));

async function fillForm(wrapper) {
  await wrapper.get("input[name=\"email\"]").setValue("john.doe@example.com");
  await wrapper.get("input[name=\"password\"]").setValue("password123");
}

function mountLoginView() {
  return mount(LoginView, {
    global: {
      stubs: {
        RouterLink: {
          template: "<a><slot /></a>",
        },
      },
    },
  });
}

describe("Unit | Views | Authentication | LoginView", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.clearAllMocks();
    mockRoute.query = {};
  });

  it("should redirect to home page after a successful login", async () => {
    // given
    loginUser.mockResolvedValue({ success: true, token: "jwt-token", userId: 1 });

    // when
    const wrapper = mountLoginView();
    const authStore = useAuthStore();
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(loginUser).toHaveBeenCalledWith({
      email: "john.doe@example.com",
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
    const wrapper = mountLoginView();
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Identifiants incorrects.");
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("should redirect to the requested protected route after a successful login", async () => {
    // given
    mockRoute.query = { redirect: "/profile" };
    loginUser.mockResolvedValue({ success: true, token: "jwt-token", userId: 1 });

    // when
    const wrapper = mountLoginView();
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(mockPush).toHaveBeenCalledWith("/profile");
  });

  it("should show fallback error message when login fails without message", async () => {
    // given
    loginUser.mockResolvedValue({
      success: false,
    });

    // when
    const wrapper = mountLoginView();
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Une erreur est survenue lors de la connexion.");
  });

  it("should render registration link", async () => {
    // when
    const wrapper = mountLoginView();

    // then
    const link = wrapper.find("p.register-link");
    expect(link.exists()).toBe(true);
    expect(link.text()).toContain("Pas encore de compte ?  S'inscrire");
  });
});
