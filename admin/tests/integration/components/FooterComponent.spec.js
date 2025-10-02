import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import FooterComponent from "@/components/FooterComponent.vue";

import packageInfo from "../../../../package.json";

describe("Integration | Components | FooterComponent", () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(FooterComponent);
  });

  it("should display version", () => {
    // then
    expect(wrapper.text()).toContain(`Version: ${packageInfo.version}`);
  });

  it("should display date and author", () => {
    // then
    expect(wrapper.text()).toContain(`© ${new Date().getFullYear()} ${packageInfo.author}`);
  });
});
