import { mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

import { apiCheck } from "@/adapters/api-check.js";
import App from "@/App.vue";

vi.mock("@/adapters/api-check.js", () => {
  return {
    apiCheck: vi.fn(),
  };
});

describe("Unit | App", () => {
  it("should display app if api is ok", async () => {
    // given
    apiCheck.mockResolvedValue(true);

    // when
    const wrapper = await mount(App);

    // then
    expect(wrapper.text()).not.toBe("");
  });

  it("should not display app if api is not ok", async () => {
    // given
    apiCheck.mockResolvedValue(false);

    // when
    const wrapper = await mount(App);

    // then
    expect(wrapper.text()).toBe("");
  });
});
