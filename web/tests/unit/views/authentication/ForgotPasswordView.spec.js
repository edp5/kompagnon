import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { requestPasswordReset } from "@/adapters/authentication.js";
import ForgotPasswordView from "@/views/authentication/ForgotPasswordView.vue";

vi.mock("@/adapters/authentication.js", () => ({
  requestPasswordReset: vi.fn(),
}));

vi.mock("vue-router", () => ({
  useRoute: () => ({ query: {} }),
  RouterLink: {
    template: "<a><slot /></a>",
  },
}));

function mountForgotPasswordView() {
  return mount(ForgotPasswordView, {
    global: {
      stubs: {
        RouterLink: {
          template: "<a><slot /></a>",
        },
      },
    },
  });
}

describe("Unit | Views | Authentication | ForgotPasswordView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render email input and submit button", () => {
    // when
    const wrapper = mountForgotPasswordView();

    // then
    expect(wrapper.find("input#email").exists()).toBe(true);
    expect(wrapper.find("button[type=\"submit\"]").exists()).toBe(true);
  });

  it("should display validation error when submitting with invalid email", async () => {
    // given
    const wrapper = mountForgotPasswordView();

    // when
    await wrapper.find("input#email").setValue("invalid-email");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Veuillez renseigner une adresse e-mail valide.");
    expect(requestPasswordReset).not.toHaveBeenCalled();
  });

  it("should call requestPasswordReset and show success card on successful submission", async () => {
    // given
    requestPasswordReset.mockResolvedValue({
      success: true,
      message: "Un e-mail de réinitialisation vous a été envoyé si le compte existe.",
    });
    const wrapper = mountForgotPasswordView();

    // when
    await wrapper.find("input#email").setValue("user@example.com");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    // then
    expect(requestPasswordReset).toHaveBeenCalledWith({ email: "user@example.com" });
    expect(wrapper.text()).toContain("E-mail envoyé !");
    expect(wrapper.text()).toContain("Un e-mail de réinitialisation vous a été envoyé si le compte existe.");
    expect(wrapper.find("form").exists()).toBe(false);
  });

  it("should show error message when requestPasswordReset fails", async () => {
    // given
    requestPasswordReset.mockResolvedValue({
      success: false,
      message: "Impossible de joindre le serveur.",
    });
    const wrapper = mountForgotPasswordView();

    // when
    await wrapper.find("input#email").setValue("user@example.com");
    await wrapper.find("form").trigger("submit.prevent");
    await flushPromises();

    // then
    expect(requestPasswordReset).toHaveBeenCalledWith({ email: "user@example.com" });
    expect(wrapper.text()).toContain("Impossible de joindre le serveur.");
    expect(wrapper.find("form").exists()).toBe(true);
  });
});
