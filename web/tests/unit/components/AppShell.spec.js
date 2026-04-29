import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import AppShell from "@/components/AppShell.vue";

describe("Unit | Components | AppShell", () => {
  it("should render the app shell", () => {
    const wrapper = mount(AppShell, { slots: { default: "<p>Content</p>" } });
    expect(wrapper.find(".app-shell").exists()).toBe(true);
  });

  it("should render slot content", () => {
    const wrapper = mount(AppShell, { slots: { default: "<p>Hello</p>" } });
    expect(wrapper.text()).toContain("Hello");
  });

  it("should render skip link", () => {
    const wrapper = mount(AppShell, { slots: { default: "<div />" } });
    expect(wrapper.find(".app-shell__skip-link").exists()).toBe(true);
  });

  it("should have correct skip link text", () => {
    const wrapper = mount(AppShell, { slots: { default: "<div />" } });
    expect(wrapper.find(".app-shell__skip-link").text()).toContain("Aller au contenu principal");
  });

  it("should call focusMainContent when skip link is clicked", async () => {
    const mockFocus = vi.fn();
    document.getElementById = vi.fn().mockReturnValue({ focus: mockFocus });

    const wrapper = mount(AppShell, { slots: { default: "<div />" } });
    await wrapper.find(".app-shell__skip-link").trigger("click");

    expect(document.getElementById).toHaveBeenCalledWith("main-content");
  });

  it("should render ambient elements", () => {
    const wrapper = mount(AppShell, { slots: { default: "<div />" } });
    expect(wrapper.find(".app-shell__ambient--top").exists()).toBe(true);
    expect(wrapper.find(".app-shell__ambient--bottom").exists()).toBe(true);
  });

  it("should have aria-hidden on ambient elements", () => {
    const wrapper = mount(AppShell, { slots: { default: "<div />" } });
    expect(wrapper.find(".app-shell__ambient--top").attributes("aria-hidden")).toBe("true");
  });
});

