import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import AppLoader from "@/components/AppLoader.vue";

describe("Unit | Components | AppLoader", () => {
  it("should render the loader", () => {
    const wrapper = mount(AppLoader);
    expect(wrapper.find(".splash").exists()).toBe(true);
  });

  it("should have aria-live polite attribute", () => {
    const wrapper = mount(AppLoader);
    expect(wrapper.find(".splash").attributes("aria-live")).toBe("polite");
  });

  it("should have aria-busy true attribute", () => {
    const wrapper = mount(AppLoader);
    expect(wrapper.find(".splash").attributes("aria-busy")).toBe("true");
  });

  it("should render tagline", () => {
    const wrapper = mount(AppLoader);
    expect(wrapper.text()).toContain("Votre espace solidaire");
  });

  it("should render wordmark", () => {
    const wrapper = mount(AppLoader);
    expect(wrapper.text()).toContain("KOMPAGNON");
  });

  it("should render ripple elements", () => {
    const wrapper = mount(AppLoader);
    expect(wrapper.find(".splash__ripple--1").exists()).toBe(true);
    expect(wrapper.find(".splash__ripple--2").exists()).toBe(true);
  });

  it("should render progress bar", () => {
    const wrapper = mount(AppLoader);
    expect(wrapper.find(".splash__bar").exists()).toBe(true);
  });
});

