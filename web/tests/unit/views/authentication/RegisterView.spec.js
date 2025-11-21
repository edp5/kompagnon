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
    expect(wrapper.text()).toContain("An email has been sent to activate your account.");
  });

  it("should show an error message if the registration fails", async () => {
    // given
    registerNewUser.mockResolvedValue({
      success: false,
      message: "Registration failed. Please try again.",
    });

    // when
    const wrapper = mount(RegisterView);
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Registration failed. Please try again.");
  });
});

