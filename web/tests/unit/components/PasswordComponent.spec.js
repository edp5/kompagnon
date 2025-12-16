import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import PasswordComponent from "@/components/PasswordComponent.vue";

describe("Unit | Components | PasswordComponent", () => {
  it("should render password field with label", () => {
    // when
    const wrapper = mount(PasswordComponent, {
      props: {
        id: "password",
        label: "Mot de passe",
        modelValue: "",
      },
    });

    // then
    expect(wrapper.find("label").text()).toBe("Mot de passe");
    expect(wrapper.find("input").attributes("type")).toBe("password");
    expect(wrapper.find("input").attributes("id")).toBe("password");
  });

  it("should toggle password visibility when button is clicked", async () => {
    // given
    const wrapper = mount(PasswordComponent, {
      props: {
        id: "password",
        label: "Mot de passe",
        modelValue: "",
      },
    });

    // when
    const toggleButton = wrapper.find("button");
    await toggleButton.trigger("click");

    // then
    expect(wrapper.find("input").attributes("type")).toBe("text");
    expect(toggleButton.text()).toBe("Masquer");

    // when
    await toggleButton.trigger("click");

    // then
    expect(wrapper.find("input").attributes("type")).toBe("password");
    expect(toggleButton.text()).toBe("Afficher");
  });

  it("should emit update:modelValue when input changes", async () => {
    // given
    const wrapper = mount(PasswordComponent, {
      props: {
        id: "password",
        label: "Mot de passe",
        modelValue: "",
      },
    });

    // when
    const input = wrapper.find("input");
    await input.setValue("newpassword123");

    // then
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["newpassword123"]);
  });

  it("should apply required attribute when required prop is true", () => {
    // when
    const wrapper = mount(PasswordComponent, {
      props: {
        id: "password",
        label: "Mot de passe",
        modelValue: "",
        required: true,
      },
    });

    // then
    expect(wrapper.find("input").attributes("required")).toBeDefined();
  });

  it("should apply disabled attribute when disabled prop is true", () => {
    // when
    const wrapper = mount(PasswordComponent, {
      props: {
        id: "password",
        label: "Mot de passe",
        modelValue: "",
        disabled: true,
      },
    });

    // then
    expect(wrapper.find("input").attributes("disabled")).toBeDefined();
  });
});

