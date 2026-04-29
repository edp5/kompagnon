import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";

import BaseInput from "@/components/BaseInput.vue";

describe("Unit | Components | BaseInput", () => {
  it("should render input field with label", () => {
    // when
    const wrapper = mount(BaseInput, {
      props: {
        id: "email",
        label: "Email",
        modelValue: "",
      },
    });

    // then
    expect(wrapper.find("label").text()).toBe("Email");
    expect(wrapper.find("input").attributes("id")).toBe("email");
  });

  it("should emit update:modelValue when input value changes", async () => {
    // given
    const wrapper = mount(BaseInput, {
      props: {
        id: "email",
        label: "Email",
        modelValue: "",
      },
    });

    // when
    await wrapper.find("input").setValue("test@example.com");

    // then
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")[0]).toEqual(["test@example.com"]);
  });

  it("should apply required attribute when required prop is true", () => {
    // when
    const wrapper = mount(BaseInput, {
      props: {
        id: "email",
        label: "Email",
        modelValue: "",
        required: true,
      },
    });

    // then
    expect(wrapper.find("input").attributes("required")).toBeDefined();
  });

  it("should apply disabled attribute when disabled prop is true", () => {
    // when
    const wrapper = mount(BaseInput, {
      props: {
        id: "email",
        label: "Email",
        modelValue: "",
        disabled: true,
      },
    });

    // then
    expect(wrapper.find("input").attributes("disabled")).toBeDefined();
  });

  it("should render help text when provided", () => {
    // when
    const wrapper = mount(BaseInput, {
      props: {
        id: "email",
        label: "Email",
        modelValue: "",
        helpText: "Please enter a valid email",
      },
    });

    // then
    expect(wrapper.find("small").text()).toBe("Please enter a valid email");
    expect(wrapper.find("small").classes()).toContain("muted-text");
  });

  it("should not render help text when not provided", () => {
    // when
    const wrapper = mount(BaseInput, {
      props: {
        id: "email",
        label: "Email",
        modelValue: "",
      },
    });

    // then
    expect(wrapper.find("small").exists()).toBe(false);
  });

  it("should set type attribute", () => {
    // when
    const wrapper = mount(BaseInput, {
      props: {
        id: "password",
        label: "Password",
        modelValue: "",
        type: "password",
      },
    });

    // then
    expect(wrapper.find("input").attributes("type")).toBe("password");
  });

  it("should set placeholder attribute", () => {
    // when
    const wrapper = mount(BaseInput, {
      props: {
        id: "email",
        label: "Email",
        modelValue: "",
        placeholder: "Enter your email",
      },
    });

    // then
    expect(wrapper.find("input").attributes("placeholder")).toBe("Enter your email");
  });

  it("should set autocomplete attribute", () => {
    // when
    const wrapper = mount(BaseInput, {
      props: {
        id: "email",
        label: "Email",
        modelValue: "",
        autocomplete: "email",
      },
    });

    // then
    expect(wrapper.find("input").attributes("autocomplete")).toBe("email");
  });

  it("should set name attribute", () => {
    // when
    const wrapper = mount(BaseInput, {
      props: {
        id: "email",
        label: "Email",
        modelValue: "",
        name: "user-email",
      },
    });

    // then
    expect(wrapper.find("input").attributes("name")).toBe("user-email");
  });

  it("should use id as name if name is not provided", () => {
    // when
    const wrapper = mount(BaseInput, {
      props: {
        id: "email",
        label: "Email",
        modelValue: "",
      },
    });

    // then
    expect(wrapper.find("input").attributes("name")).toBe("email");
  });

  it("should set min attribute for number input", () => {
    // when
    const wrapper = mount(BaseInput, {
      props: {
        id: "age",
        label: "Age",
        modelValue: "",
        type: "number",
        min: "0",
      },
    });

    // then
    expect(wrapper.find("input").attributes("min")).toBe("0");
  });

  it("should set max attribute for number input", () => {
    // when
    const wrapper = mount(BaseInput, {
      props: {
        id: "age",
        label: "Age",
        modelValue: "",
        type: "number",
        max: "120",
      },
    });

    // then
    expect(wrapper.find("input").attributes("max")).toBe("120");
  });

  it("should display numeric modelValue", () => {
    // when
    const wrapper = mount(BaseInput, {
      props: {
        id: "age",
        label: "Age",
        modelValue: 25,
        type: "number",
      },
    });

    // then
    expect(wrapper.find("input").element.value).toBe("25");
  });

  it("should render label for attribute correctly", () => {
    // when
    const wrapper = mount(BaseInput, {
      props: {
        id: "email",
        label: "Email Address",
        modelValue: "",
      },
    });

    // then
    expect(wrapper.find("label").attributes("for")).toBe("email");
  });
});

