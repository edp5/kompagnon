import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import SupportView from "@/views/SupportView.vue";

describe("Unit | Views | SupportView", () => {
  beforeEach(() => {
    // Clear any state before each test
  });

  it("should render the support view", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.find(".support-view").exists()).toBe(true);
  });

  it("should display the search bar", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.find(".support-search-input").exists()).toBe(true);
    expect(wrapper.find(".support-search-input").attributes("placeholder")).toContain("Rechercher");
  });

  it("should display online status", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.text()).toContain("En ligne");
    expect(wrapper.find(".support-dot").exists()).toBe(true);
  });

  it("should display the header", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.text()).toContain("Centre d'aide");
    expect(wrapper.text()).toContain("Comment pouvons-nous vous aider");
  });

  it("should display contact section title", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.text()).toContain("Nous contacter");
    expect(wrapper.text()).toContain("Choisissez votre canal");
  });

  it("should render all contact channels", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.text()).toContain("Chat en direct");
    expect(wrapper.text()).toContain("Téléphone");
    expect(wrapper.text()).toContain("Email");
  });

  it("should display contact details", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.text()).toContain("Réponse immédiate");
    expect(wrapper.text()).toContain("0800 123 456");
    expect(wrapper.text()).toContain("support@kompagnon.fr");
  });

  it("should display response time estimates", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.text()).toContain("< 2 min");
    expect(wrapper.text()).toContain("< 5 min");
    expect(wrapper.text()).toContain("< 2h");
  });

  it("should render support categories", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.text()).toContain("Mon compte");
    expect(wrapper.text()).toContain("Réservations");
    expect(wrapper.text()).toContain("Sécurité");
    expect(wrapper.text()).toContain("Paiements");
    expect(wrapper.text()).toContain("Accessibilité");
    expect(wrapper.text()).toContain("Volontaires");
  });

  it("should display category descriptions", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.text()).toContain("Gestion du profil");
    expect(wrapper.text()).toContain("Demande, annulation, modification");
  });

  it("should display FAQ section", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.text()).toContain("Comment demander");
  });

  it("should render FAQ questions", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.text()).toContain("Comment demander un accompagnement");
    expect(wrapper.text()).toContain("L'accompagnement est-il gratuit");
    expect(wrapper.text()).toContain("Comment sont vérifiés les volontaires");
    expect(wrapper.text()).toContain("Que faire en cas d'urgence");
  });

  it("should render resources section", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.text()).toContain("Ressources");
  });

  it("should display resource links", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.text()).toContain("Guide d'utilisation");
    expect(wrapper.text()).toContain("Tutoriels vidéo");
    expect(wrapper.text()).toContain("Conditions d'utilisation");
  });

  it("should have proper ARIA labels for accessibility", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.find(".support-search-input").attributes("aria-label")).toBe("Rechercher dans le centre d'aide");
  });

  it("should render contact buttons", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    const buttons = wrapper.findAll(".contact-card");
    expect(buttons.length).toBeGreaterThan(0);
  });

  it("should render contact buttons with proper aria-labels", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    const buttons = wrapper.findAll(".contact-card");
    buttons.forEach((button) => {
      const ariaLabel = button.attributes("aria-label");
      expect(ariaLabel).toContain("Contacter le support");
    });
  });

  it("should display category count badges", () => {
    // when
    const wrapper = mount(SupportView);

    // then
    expect(wrapper.text()).toContain("12");
    expect(wrapper.text()).toContain("8");
    expect(wrapper.text()).toContain("6");
  });
});




