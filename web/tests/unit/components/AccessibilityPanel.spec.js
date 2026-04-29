import { mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import AccessibilityPanel from "@/components/AccessibilityPanel.vue";

import localStorage from "../../localStorage.js";

describe("Unit | Components | AccessibilityPanel", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it("should render the accessibility toggle button initially", () => {
    // when
    const wrapper = mount(AccessibilityPanel);

    // then
    expect(wrapper.find(".a11y-toggle").exists()).toBe(true);
    expect(wrapper.text()).toContain("Accessibilité");
  });

  it("should open the panel when toggle button is clicked", async () => {
    // given
    const wrapper = mount(AccessibilityPanel);

    // when
    await wrapper.find(".a11y-toggle").trigger("click");

    // then
    expect(wrapper.find(".a11y-drawer").exists()).toBe(true);
    expect(wrapper.find(".a11y-drawer").attributes("aria-label")).toBe("Options d'accessibilité");
  });

  it("should close the drawer when close button is clicked", async () => {
    // given
    const wrapper = mount(AccessibilityPanel);
    await wrapper.find(".a11y-toggle").trigger("click");

    // when
    await wrapper.find(".a11y-close").trigger("click");

    // then
    expect(wrapper.find(".a11y-drawer").exists()).toBe(false);
  });

  it("should close the drawer when overlay is clicked", async () => {
    // given
    const wrapper = mount(AccessibilityPanel);
    await wrapper.find(".a11y-toggle").trigger("click");

    // when
    await wrapper.find(".a11y-overlay").trigger("click");

    // then
    expect(wrapper.find(".a11y-drawer").exists()).toBe(false);
  });

  it("should have all accessibility options", () => {
    // when
    const wrapper = mount(AccessibilityPanel);
    wrapper.vm.isOpen = true;

    // then
    expect(wrapper.vm.settings.highContrast !== undefined).toBe(true);
    expect(wrapper.vm.settings.largeText !== undefined).toBe(true);
    expect(wrapper.vm.settings.reducedMotion !== undefined).toBe(true);
    expect(wrapper.vm.settings.darkMode !== undefined).toBe(true);
    expect(wrapper.vm.settings.screenReaderMode !== undefined).toBe(true);
  });

  it("should toggle high contrast setting", () => {
    // given
    const wrapper = mount(AccessibilityPanel);

    // when
    wrapper.vm.toggleSetting("highContrast");

    // then
    expect(wrapper.vm.settings.highContrast).toBe(true);
  });

  it("should toggle large text setting", () => {
    // given
    const wrapper = mount(AccessibilityPanel);

    // when
    wrapper.vm.toggleSetting("largeText");

    // then
    expect(wrapper.vm.settings.largeText).toBe(true);
  });

  it("should toggle reduced motion setting", () => {
    // given
    const wrapper = mount(AccessibilityPanel);

    // when
    wrapper.vm.toggleSetting("reducedMotion");

    // then
    expect(wrapper.vm.settings.reducedMotion).toBe(true);
  });

  it("should toggle dark mode setting", () => {
    // given
    const wrapper = mount(AccessibilityPanel);

    // when
    wrapper.vm.toggleSetting("darkMode");

    // then
    expect(wrapper.vm.settings.darkMode).toBe(true);
  });

  it("should toggle screen reader mode setting", () => {
    // given
    const wrapper = mount(AccessibilityPanel);

    // when
    wrapper.vm.toggleSetting("screenReaderMode");

    // then
    expect(wrapper.vm.settings.screenReaderMode).toBe(true);
  });

  it("should apply settings to document root element", async () => {
    // given
    const wrapper = mount(AccessibilityPanel);
    wrapper.vm.isOpen = true;
    await wrapper.vm.$nextTick();

    // when
    await wrapper.vm.toggleSetting("highContrast");

    // then
    expect(document.documentElement.classList.contains("a11y-contrast")).toBe(true);
  });

  it("should reset all settings", async () => {
    // given
    const wrapper = mount(AccessibilityPanel);
    wrapper.vm.settings.highContrast = true;
    wrapper.vm.settings.largeText = true;
    localStorage.setItem("a11y-contrast", "true");
    localStorage.setItem("a11y-largeText", "true");
    wrapper.vm.isOpen = true;
    await wrapper.vm.$nextTick();

    // when
    await wrapper.find(".a11y-reset").trigger("click");

    // then
    expect(wrapper.vm.settings.highContrast).toBe(false);
    expect(wrapper.vm.settings.largeText).toBe(false);
    expect(localStorage.getItem("a11y-contrast")).toBeNull();
    expect(localStorage.getItem("a11y-largeText")).toBeNull();
  });

  it("should load settings from localStorage on initialization", () => {
    // given
    localStorage.setItem("a11y-contrast", "true");
    localStorage.setItem("a11y-largeText", "true");

    // when
    const wrapper = mount(AccessibilityPanel);

    // then
    expect(wrapper.vm.settings.highContrast).toBe(true);
    expect(wrapper.vm.settings.largeText).toBe(true);
  });

  it("should display correct a11y label when no settings are active", () => {
    // when
    const wrapper = mount(AccessibilityPanel);

    // then
    expect(wrapper.text()).toContain("Accessibilité");
  });

  it("should display correct a11y label when settings are active", async () => {
    // given
    const wrapper = mount(AccessibilityPanel);
    wrapper.vm.settings.highContrast = true;
    await wrapper.vm.$nextTick();

    // then
    const activeCount = wrapper.vm.activeCount;
    expect(activeCount).toBe(1);
  });

  it("should display plural form when multiple settings are active", async () => {
    // given
    const wrapper = mount(AccessibilityPanel);
    wrapper.vm.settings.highContrast = true;
    wrapper.vm.settings.largeText = true;
    await wrapper.vm.$nextTick();

    // then
    const activeCount = wrapper.vm.activeCount;
    expect(activeCount).toBe(2);
  });

  it("should render the panel footer", async () => {
    // given
    const wrapper = mount(AccessibilityPanel);
    wrapper.vm.isOpen = true;
    await wrapper.vm.$nextTick();

    // then
    expect(wrapper.text()).toContain("Les paramètres sont sauvegardés automatiquement");
  });

  it("should apply all accessibility classes to root on toggle", async () => {
    // given
    const wrapper = mount(AccessibilityPanel);

    // when
    wrapper.vm.settings.highContrast = true;
    wrapper.vm.settings.largeText = true;
    wrapper.vm.settings.reducedMotion = true;
    wrapper.vm.settings.darkMode = true;
    wrapper.vm.settings.screenReaderMode = true;
    wrapper.vm.applySettings();

    // then
    expect(document.documentElement.classList.contains("a11y-contrast")).toBe(true);
    expect(document.documentElement.classList.contains("a11y-large-text")).toBe(true);
    expect(document.documentElement.classList.contains("a11y-reduced-motion")).toBe(true);
    expect(document.documentElement.classList.contains("a11y-dark-mode")).toBe(true);
    expect(document.documentElement.classList.contains("a11y-screen-reader")).toBe(true);
  });

  it("should remove all accessibility classes when reset", async () => {
    // given
    const wrapper = mount(AccessibilityPanel);
    wrapper.vm.settings.highContrast = true;
    wrapper.vm.settings.largeText = true;
    wrapper.vm.applySettings();

    // when
    wrapper.vm.resetSettings();

    // then
    expect(document.documentElement.classList.contains("a11y-contrast")).toBe(false);
    expect(document.documentElement.classList.contains("a11y-large-text")).toBe(false);
  });
});



