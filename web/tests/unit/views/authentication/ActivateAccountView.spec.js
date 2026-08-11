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

describe("Unit | Views | Authentication | ActivateAccountView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRoute.query = {};
  });

  describe("when token is missing", () => {
    it("should display an error message and a registration link, without a form", async () => {
      // given
      mockRoute.query = {};

      // when
      const wrapper = mount(ActivateAccountView);
      await flushPromises();

      // then
      expect(wrapper.text()).toContain("Token d'activation manquant.");
      expect(wrapper.text()).toContain("Retour à l'inscription");
      expect(wrapper.find("form").exists()).toBe(false);
      expect(activateAccount).not.toHaveBeenCalled();
    });
  });

  describe("when token is provided", () => {
    it("should show the phone number form and not activate on mount", async () => {
      // given
      mockRoute.query = { token: "valid-token" };

      // when
      const wrapper = mount(ActivateAccountView);
      await flushPromises();

      // then
      expect(wrapper.find("input#phoneNumber").exists()).toBe(true);
      expect(activateAccount).not.toHaveBeenCalled();
    });

    it("should show a validation error and not call the adapter when the phone number is invalid", async () => {
      // given
      mockRoute.query = { token: "valid-token" };
      const wrapper = mount(ActivateAccountView);

      // when
      await wrapper.find("input#phoneNumber").setValue("not-a-phone");
      await wrapper.find("form").trigger("submit.prevent");
      await flushPromises();

      // then
      expect(wrapper.text()).toContain("Veuillez saisir un numéro de téléphone français valide.");
      expect(activateAccount).not.toHaveBeenCalled();
    });

    it("should activate with the token and phone number, then show the login link on success", async () => {
      // given
      mockRoute.query = { token: "valid-token" };
      activateAccount.mockResolvedValue({ success: true, message: "Compte activé avec succès !" });
      const wrapper = mount(ActivateAccountView);

      // when
      await wrapper.find("input#phoneNumber").setValue("0612345678");
      await wrapper.find("form").trigger("submit.prevent");
      await flushPromises();

      // then
      expect(activateAccount).toHaveBeenCalledWith({ token: "valid-token", phoneNumber: "0612345678" });
      expect(wrapper.text()).toContain("Compte activé avec succès !");
      expect(wrapper.text()).toContain("Aller à la connexion");
    });

    it("should display the error message returned by the adapter on failure", async () => {
      // given
      mockRoute.query = { token: "valid-token" };
      activateAccount.mockResolvedValue({ success: false, message: "Ce compte est déjà activé." });
      const wrapper = mount(ActivateAccountView);

      // when
      await wrapper.find("input#phoneNumber").setValue("0612345678");
      await wrapper.find("form").trigger("submit.prevent");
      await flushPromises();

      // then
      expect(wrapper.text()).toContain("Ce compte est déjà activé.");
    });
  });
});
