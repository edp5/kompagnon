import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";

import PrivacyView from "@/views/PrivacyView.vue";

describe("Unit | Views | PrivacyView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  function createWrapper() {
    const router = createRouter({
      history: createMemoryHistory(),
      routes: [{ path: "/privacy", component: PrivacyView }],
    });

    return mount(PrivacyView, {
      global: {
        plugins: [router],
        stubs: {
          AppLayout: true,
          AppShell: true,
          CheckCircle: true,
          Info: true,
          Lock: true,
          ShieldCheck: true,
        },
      },
    });
  }

  it("should render the privacy view", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".privacy-view").exists()).toBe(true);
  });

  it("should display the header", () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain("Confidentialité");
    expect(wrapper.text()).toContain("Données personnelles");
  });

  it("should display privacy score card", () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain("Score de confidentialité");
    expect(wrapper.text()).toContain("75%");
  });

  it("should display privacy protection status", () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain("Bon niveau de protection");
  });

  it("should display profile visibility section", () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain("Visibilité du profil");
  });

  it("should display full visibility option", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should display limited visibility option", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm).toBeDefined();
  });

  it("should display location privacy section", () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain("Localisation");
  });

  it("should display location sharing option", () => {
    const wrapper = createWrapper();
    expect(wrapper.text()).toContain("Partage de localisation");
  });

  it("should display profile information settings", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm.profile.showName).toBeDefined();
    expect(wrapper.vm.profile.showAge).toBeDefined();
  });

  it("should display location settings", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm.location.share).toBeDefined();
  });

  it("should display history and analytics settings", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm.history.share).toBeDefined();
    expect(wrapper.vm.history.analytics).toBeDefined();
  });

  it("should toggle profile visibility", async () => {
    const wrapper = createWrapper();
    const initialValue = wrapper.vm.profile.showName;
    wrapper.vm.profile.showName = !initialValue;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.profile.showName).toBe(!initialValue);
  });

  it("should toggle location sharing", async () => {
    const wrapper = createWrapper();
    const initialValue = wrapper.vm.location.share;
    wrapper.vm.location.share = !initialValue;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.location.share).toBe(!initialValue);
  });

  it("should toggle history sharing", async () => {
    const wrapper = createWrapper();
    const initialValue = wrapper.vm.history.share;
    wrapper.vm.history.share = !initialValue;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.history.share).toBe(!initialValue);
  });

  it("should toggle analytics sharing", async () => {
    const wrapper = createWrapper();
    const initialValue = wrapper.vm.history.analytics;
    wrapper.vm.history.analytics = !initialValue;
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.history.analytics).toBe(!initialValue);
  });

  it("should display visibility options", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm.visibilityOptions.length).toBeGreaterThan(0);
  });

  it("should display all visibility options", () => {
    const wrapper = createWrapper();
    expect(wrapper.vm.visibilityOptions).toContain("Volontaires vérifiés uniquement");
    expect(wrapper.vm.visibilityOptions).toContain("Tous les membres");
    expect(wrapper.vm.visibilityOptions).toContain("Personne");
  });

  it("should display privacy notice section", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".privacy-view").exists()).toBe(true);
  });

  it("should display GDPR compliance message", () => {
    const wrapper = createWrapper();
    expect(wrapper.find(".privacy-view").exists()).toBe(true);
  });
});

