import { flushPromises, mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { registerNewUser } from "@/adapters/authentication.js";
import RegisterView from "@/views/authentication/RegisterView.vue";

vi.mock("@/adapters/authentication.js", () => ({
  registerNewUser: vi.fn(),
}));

async function fillForm(wrapper) {
  await wrapper.get("input[name=\"firstname\"]").setValue("John");
  await wrapper.get("input[name=\"lastname\"]").setValue("Doe");
  await wrapper.get("input[name=\"email\"]").setValue("john.doe@example.com");
  await wrapper.get("input[name=\"password\"]").setValue("password123");
  await wrapper.get("input[name=\"passwordConfirmation\"]").setValue("password123");
  await wrapper.get("input[name=\"birthday\"]").setValue("2000-01-01");
}

describe("Unit | Views | Authentication | RegisterView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should show a success message after a successful registration", async () => {
    // given
    registerNewUser.mockResolvedValue({ success: true });

    // when
    const wrapper = mount(RegisterView);
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(registerNewUser).toHaveBeenCalledWith({
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      birthday: "2000-01-01",
    });
    expect(wrapper.text()).toContain("Un e‑mail a été envoyé pour activer votre compte.");
  });

  it("should show an error message if the registration fails", async () => {
    // given
    registerNewUser.mockResolvedValue({
      success: false,
      message: "Échec de l'inscription. Veuillez réessayer.",
    });

    // when
    const wrapper = mount(RegisterView);
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Échec de l'inscription. Veuillez réessayer.");
  });

  it("should show fallback error message when registration fails without message", async () => {
    // given
    registerNewUser.mockResolvedValue({
      success: false,
    });

    // when
    const wrapper = mount(RegisterView);
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Une erreur est survenue lors de l'inscription. Veuillez réessayer.");
  });

  it("should hide form when registration is successful", async () => {
    // given
    registerNewUser.mockResolvedValue({ success: true });

    // when
    const wrapper = mount(RegisterView);
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(wrapper.find("form").exists()).toBe(false);
    expect(wrapper.find(".feedback.success").exists()).toBe(true);
  });

  it("should show error when passwords do not match", async () => {
    // given
    const wrapper = mount(RegisterView);
    await wrapper.get("input[name=\"firstname\"]").setValue("John");
    await wrapper.get("input[name=\"lastname\"]").setValue("Doe");
    await wrapper.get("input[name=\"email\"]").setValue("john.doe@example.com");
    await wrapper.get("input[name=\"password\"]").setValue("password123");
    await wrapper.get("input[name=\"passwordConfirmation\"]").setValue("different123");
    await wrapper.get("input[name=\"birthday\"]").setValue("2000-01-01");

    // when
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(registerNewUser).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain("Les mots de passe ne correspondent pas.");
  });
});