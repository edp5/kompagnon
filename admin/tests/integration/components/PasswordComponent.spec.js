import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import PasswordComponent from "@/components/PasswordComponent.vue";

describe("Integration | Components | PasswordComponent", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PasswordComponent);
  });

  it("should display default label", () => {
    // then
    const label = wrapper.find("label");
    expect(label.text()).toBe("mot de passe");
  });

  it("should display custom label", () => {
    // given & when
    wrapper = mount(PasswordComponent, {
      props: {
        label: "New Password",
      },
    });

    // then
    const label = wrapper.find("label");
    expect(label.text()).toBe("New Password");
  });

  it("should have password input type by default", () => {
    // then
    const input = wrapper.find("input");
    expect(input.attributes("type")).toBe("password");
  });

  it("should toggle password visibility when button is clicked", async () => {
    // given
    const input = wrapper.find("input");
    const button = wrapper.find("button");

    // when
    await button.trigger("click");

    // then
    expect(input.attributes("type")).toBe("text");
  });

  it("should toggle back to password type when button is clicked twice", async () => {
    // given
    const input = wrapper.find("input");
    const button = wrapper.find("button");

    // when
    await button.trigger("click");

    // then
    expect(input.attributes("type")).toBe("text");
    wrapper.vm.showPassword = true;

    // when
    await button.trigger("click");

    // then
    expect(input.attributes("type")).toBe("password");
  });

  it("should update aria-label when password is visible", async () => {
    // given
    const button = wrapper.find("button");

    // when
    await button.trigger("click");

    // then
    expect(button.attributes("aria-label")).toBe("Masquer le mot de passe");
  });

  it("should update aria-label when password is hidden", () => {
    // then
    const button = wrapper.find("button");
    expect(button.attributes("aria-label")).toBe("Afficher le mot de passe");
  });

  it("should emit update:modelValue when input value changes", async () => {
    // given
    const input = wrapper.find("input");

    // when
    await input.setValue("test123");

    // then
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["test123"]);
  });

  it("should bind modelValue to input value", () => {
    // given
    wrapper = mount(PasswordComponent, {
      props: {
        modelValue: "initialValue",
      },
    });

    // then
    const input = wrapper.find("input");
    expect(input.element.value).toBe("initialValue");
  });

  it("should have correct input id based on label", () => {
    // given
    wrapper = mount(PasswordComponent, {
      props: {
        label: "custom-password",
      },
    });

    // then
    const input = wrapper.find("input");
    expect(input.attributes("id")).toBe("password-custom-password");
  });
});

