import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { submitPasswordReset } from "@/adapters/authentication.js";
import ResetPasswordView from "@/views/authentication/ResetPasswordView.vue";

vi.mock("@/adapters/authentication.js", () => ({
  submitPasswordReset: vi.fn(),
}));

const mockRoute = {
  query: {},
};

vi.mock("vue-router", () => ({
  useRoute: () => mockRoute,
  RouterLink: {
    template: "<a><slot /></a>",
  },
}));

function mountResetPasswordView() {
  return mount(ResetPasswordView, {
    global: {
      stubs: {
        RouterLink: {
          template: "<a><slot /></a>",
        },
      },
    },
  });
}

describe("Unit | Views | Authentication | ResetPasswordView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute.query = {};
  });

  describe("when token is missing", () => {
    it("should display missing token warning and link to forgot-password", async () => {
      // given
      mockRoute.query = {};

      // when
      const wrapper = mountResetPasswordView();
      await flushPromises();

      // then
      expect(wrapper.text()).toContain("Lien de réinitialisation invalide");
      expect(wrapper.find("form").exists()).toBe(false);
      expect(submitPasswordReset).not.toHaveBeenCalled();
    });
  });

  describe("when token is present", () => {
    it("should render password inputs and form", async () => {
      // given
      mockRoute.query = { token: "valid-token-abc" };

      // when
      const wrapper = mountResetPasswordView();
      await flushPromises();

      // then
      expect(wrapper.find("input#password").exists()).toBe(true);
      expect(wrapper.find("input#confirmPassword").exists()).toBe(true);
      expect(wrapper.find("form").exists()).toBe(true);
    });

    it("should display validation error when password is less than 8 characters", async () => {
      // given
      mockRoute.query = { token: "valid-token-abc" };
      const wrapper = mountResetPasswordView();
      await flushPromises();

      // when
      await wrapper.find("input#password").setValue("short");
      await wrapper.find("input#confirmPassword").setValue("short");
      await wrapper.find("form").trigger("submit.prevent");
      await flushPromises();

      // then
      expect(wrapper.text()).toContain("Le mot de passe doit contenir au moins 8 caractères.");
      expect(submitPasswordReset).not.toHaveBeenCalled();
    });

    it("should display validation error when passwords do not match", async () => {
      // given
      mockRoute.query = { token: "valid-token-abc" };
      const wrapper = mountResetPasswordView();
      await flushPromises();

      // when
      await wrapper.find("input#password").setValue("password123");
      await wrapper.find("input#confirmPassword").setValue("differentPassword");
      await wrapper.find("form").trigger("submit.prevent");
      await flushPromises();

      // then
      expect(wrapper.text()).toContain("Les deux mots de passe ne correspondent pas.");
      expect(submitPasswordReset).not.toHaveBeenCalled();
    });

    it("should submit new password and display success state", async () => {
      // given
      mockRoute.query = { token: "valid-token-abc" };
      submitPasswordReset.mockResolvedValue({
        success: true,
        message: "Votre mot de passe a été réinitialisé avec succès.",
      });
      const wrapper = mountResetPasswordView();
      await flushPromises();

      // when
      await wrapper.find("input#password").setValue("newStrongPassword123");
      await wrapper.find("input#confirmPassword").setValue("newStrongPassword123");
      await wrapper.find("form").trigger("submit.prevent");
      await flushPromises();

      // then
      expect(submitPasswordReset).toHaveBeenCalledWith({
        token: "valid-token-abc",
        password: "newStrongPassword123",
      });
      expect(wrapper.text()).toContain("Mot de passe mis à jour !");
      expect(wrapper.text()).toContain("Votre mot de passe a été réinitialisé avec succès.");
      expect(wrapper.find("form").exists()).toBe(false);
    });

    it("should display error message returned by backend on failure", async () => {
      // given
      mockRoute.query = { token: "expired-token" };
      submitPasswordReset.mockResolvedValue({
        success: false,
        message: "Le lien de réinitialisation est invalide ou a expiré.",
      });
      const wrapper = mountResetPasswordView();
      await flushPromises();

      // when
      await wrapper.find("input#password").setValue("newStrongPassword123");
      await wrapper.find("input#confirmPassword").setValue("newStrongPassword123");
      await wrapper.find("form").trigger("submit.prevent");
      await flushPromises();

      // then
      expect(submitPasswordReset).toHaveBeenCalledWith({
        token: "expired-token",
        password: "newStrongPassword123",
      });
      expect(wrapper.text()).toContain("Le lien de réinitialisation est invalide ou a expiré.");
      expect(wrapper.find("form").exists()).toBe(true);
    });

    it("should toggle password visibility when clicking toggle buttons", async () => {
      // given
      mockRoute.query = { token: "valid-token-abc" };
      const wrapper = mountResetPasswordView();
      await flushPromises();

      const toggleButtons = wrapper.findAll(".reset-view__toggle");
      expect(toggleButtons).toHaveLength(2);

      // before toggle: inputs are password type
      expect(wrapper.find("input#password").attributes("type")).toBe("password");
      expect(wrapper.find("input#confirmPassword").attributes("type")).toBe("password");

      // toggle password
      await toggleButtons[0].trigger("click");
      expect(wrapper.find("input#password").attributes("type")).toBe("text");
      await toggleButtons[0].trigger("click");
      expect(wrapper.find("input#password").attributes("type")).toBe("password");

      // toggle confirmPassword
      await toggleButtons[1].trigger("click");
      expect(wrapper.find("input#confirmPassword").attributes("type")).toBe("text");
      await toggleButtons[1].trigger("click");
      expect(wrapper.find("input#confirmPassword").attributes("type")).toBe("password");
    });

    it("should display default error message when failure has no message", async () => {
      // given
      mockRoute.query = { token: "token-abc" };
      submitPasswordReset.mockResolvedValue({
        success: false,
      });
      const wrapper = mountResetPasswordView();
      await flushPromises();

      // when
      await wrapper.find("input#password").setValue("newStrongPassword123");
      await wrapper.find("input#confirmPassword").setValue("newStrongPassword123");
      await wrapper.find("form").trigger("submit.prevent");
      await flushPromises();

      // then
      expect(wrapper.text()).toContain("Échec de la réinitialisation du mot de passe.");
    });
  });
});

