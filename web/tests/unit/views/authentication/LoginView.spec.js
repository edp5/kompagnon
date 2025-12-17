import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { loginUser } from "@/adapters/authentication.js";
import LoginView from "@/views/authentication/LoginView.vue";

vi.mock("@/adapters/authentication.js", () => ({
  loginUser: vi.fn(),
}));

const mockPush = vi.fn();
vi.mock("vue-router", () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  RouterLink: {
    template: "<a><slot /></a>",
  },
}));

async function fillForm(wrapper) {
  await wrapper.get("input[name=\"email\"]").setValue("john.doe@example.com");
  await wrapper.get("input[name=\"password\"]").setValue("password123");
}

describe("Unit | Views | Authentication | LoginView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should redirect to home page after a successful login", async () => {
    // given
    loginUser.mockResolvedValue({ success: true, user: { id: 1 } });

    // when
    const wrapper = mount(LoginView);
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(loginUser).toHaveBeenCalledWith({
      email: "john.doe@example.com",
      password: "password123",
    });
    expect(mockPush).toHaveBeenCalledWith("/");
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

  it("should render registration link", async () => {
    // when
    const wrapper = mount(LoginView);

    // then
    const link = wrapper.find("p.register-link");
    expect(link.exists()).toBe(true);
    expect(link.text()).toContain("Pas encore de compte ?  S'inscrire");
  });
});
