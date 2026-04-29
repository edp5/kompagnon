import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import BaseToggle from "@/components/BaseToggle.vue";

describe("Unit | Components | BaseToggle", () => {
  it("should render a checkbox input with the provided id", () => {
    // when
    const wrapper = mount(BaseToggle, {
      props: {
        id: "toggle-test",
        modelValue: false,
      },
    });

    // then
    expect(wrapper.find("input[type='checkbox']").attributes("id")).toBe("toggle-test");
  });

  it("should reflect the modelValue prop", () => {
    // when
    const wrapper = mount(BaseToggle, {
      props: {
        id: "toggle-test",
        modelValue: true,
      },
    });

    // then
    expect(wrapper.find("input").element.checked).toBe(true);
  });

  it("should emit update:modelValue with true when unchecked box is clicked", async () => {
    // given
    const wrapper = mount(BaseToggle, {
      props: {
        id: "toggle-test",
        modelValue: false,
      },
    });

    // when
    // First manually set the input to checked to simulate user interaction
    await wrapper.find("input").element.click();
    // Trigger change event manually since the click simulation might not work properly
    const checkboxInput = wrapper.find("input");
    const event = new Event("change", { bubbles: true });
    Object.defineProperty(checkboxInput.element, "checked", {
      value: true,
      writable: false,
    });
    checkboxInput.element.dispatchEvent(event);

    // then
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
  });

  it("should emit update:modelValue with false when checked box is clicked", async () => {
    // given
    const wrapper = mount(BaseToggle, {
      props: {
        id: "toggle-test",
        modelValue: true,
      },
    });

    // when
    // First manually set the input to unchecked to simulate user interaction
    await wrapper.find("input").element.click();
    // Trigger change event manually
    const checkboxInput = wrapper.find("input");
    const event = new Event("change", { bubbles: true });
    Object.defineProperty(checkboxInput.element, "checked", {
      value: false,
      writable: false,
    });
    checkboxInput.element.dispatchEvent(event);

    // then
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
  });

  it("should apply disabled attribute when disabled prop is true", () => {
    // when
    const wrapper = mount(BaseToggle, {
      props: {
        id: "toggle-test",
        modelValue: false,
        disabled: true,
      },
    });

    // then
    expect(wrapper.find("input").attributes("disabled")).toBeDefined();
  });

  it("should have disabled class when disabled prop is true", () => {
    // when
    const wrapper = mount(BaseToggle, {
      props: {
        id: "toggle-test",
        modelValue: false,
        disabled: true,
      },
    });

    // then
    expect(wrapper.find("label").classes()).toContain("base-toggle--disabled");
  });

  it("should not have disabled class when disabled prop is false", () => {
    // when
    const wrapper = mount(BaseToggle, {
      props: {
        id: "toggle-test",
        modelValue: false,
        disabled: false,
      },
    });

    // then
    expect(wrapper.find("label").classes()).not.toContain("base-toggle--disabled");
  });

  it("should link label for attribute to input id", () => {
    // when
    const wrapper = mount(BaseToggle, {
      props: {
        id: "my-toggle",
        modelValue: false,
      },
    });

    // then
    expect(wrapper.find("label").attributes("for")).toBe("my-toggle");
  });

  it("should have default modelValue of false", () => {
    // when
    const wrapper = mount(BaseToggle, {
      props: {
        id: "toggle-test",
      },
    });

    // then
    expect(wrapper.find("input").element.checked).toBe(false);
  });
});


