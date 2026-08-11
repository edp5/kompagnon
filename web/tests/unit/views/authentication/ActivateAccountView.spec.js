import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { activateAccount } from "@/adapters/authentication.js";
import ActivateAccountView from "@/views/authentication/ActivateAccountView.vue";

vi.mock("@/adapters/authentication.js", () => ({
  activateAccount: vi.fn(),
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

describe("Unit | Views | Authentication | AuthenticationView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute.query = {};
  });

  describe("when token is missing", () => {
    it("should display an error message when no token is provided", async () => {
      // given
      mockRoute.query = {};

      // when
      const wrapper = mount(ActivateAccountView);
      await flushPromises();

      // then
      expect(activateAccount).not.toHaveBeenCalled();
      expect(wrapper.text()).toContain("Token d'activation manquant.");
    });

    it("should show link to registration page when token is missing", async () => {
      // given
      mockRoute.query = {};

      // when
      const wrapper = mount(ActivateAccountView);
      await flushPromises();

      // then
      expect(wrapper.text()).toContain("Retour à l'inscription");
    });
  });

  describe("when token is provided", () => {
    it("should call activateAccount with the token from query params", async () => {
      // given
      const token = "valid-test-token";
      mockRoute.query = { token };
      activateAccount.mockResolvedValue({ success: true, message: "Compte activé avec succès !" });

      // when
      const wrapper = mount(ActivateAccountView);
      await flushPromises();

      // then
      expect(activateAccount).toHaveBeenCalledWith({ token });
      expect(wrapper.text()).toContain("Compte activé avec succès !");
    });

    it("should display loading state while activation is in progress", async () => {
      // given
      mockRoute.query = { token: "test-token" };
      let resolveActivation;
      activateAccount.mockReturnValue(new Promise((resolve) => {
        resolveActivation = resolve;
      }));

      // when
      const wrapper = mount(ActivateAccountView);

      // then
      expect(wrapper.text()).toContain("Activation en cours...");

      // cleanup
      resolveActivation({ success: true, message: "Done" });
      await flushPromises();
    });

    it("should show link to login page on successful activation", async () => {
      // given
      mockRoute.query = { token: "valid-token" };
      activateAccount.mockResolvedValue({ success: true, message: "Compte activé avec succès !" });

      // when
      const wrapper = mount(ActivateAccountView);
      await flushPromises();

      // then
      expect(wrapper.text()).toContain("Aller à la connexion");
    });

    it("should show error message and registration link on activation failure", async () => {
      // given
      mockRoute.query = { token: "invalid-token" };
      activateAccount.mockResolvedValue({ success: false, message: "Token invalide ou expiré." });

      // when
      const wrapper = mount(ActivateAccountView);
      await flushPromises();

      // then
      expect(wrapper.text()).toContain("Token invalide ou expiré.");
      expect(wrapper.text()).toContain("Retour à l'inscription");
    });
  });
});
