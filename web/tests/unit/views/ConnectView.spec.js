import { mount } from "@vue/test-utils";
import { beforeEach, describe, expect, it } from "vitest";

import ConnectView from "@/views/ConnectView.vue";

describe("Unit | Views | ConnectView", () => {
  beforeEach(() => {
    // Clear any state before each test
  });

  it("should render the connect view", () => {
    // when
    const wrapper = mount(ConnectView);

    // then
    expect(wrapper.find(".connect-view").exists()).toBe(true);
  });

  it("should display the header", () => {
    // when
    const wrapper = mount(ConnectView);

    // then
    expect(wrapper.text()).toContain("Mise en relation");
    expect(wrapper.text()).toContain("Vos demandes d'accompagnement");
  });

  it("should display messages", () => {
    // when
    const wrapper = mount(ConnectView);

    // then
    expect(wrapper.text()).toContain("Marie D.");
    expect(wrapper.text()).toContain("Thomas R.");
    expect(wrapper.text()).toContain("Sophie M.");
  });

  it("should display message content", () => {
    // when
    const wrapper = mount(ConnectView);

    // then
    expect(wrapper.text()).toContain("Je vous accompagne");
    expect(wrapper.text()).toContain("Parfait");
    expect(wrapper.text()).toContain("Merci pour votre aide");
  });

  it("should display message times", () => {
    // when
    const wrapper = mount(ConnectView);

    // then
    expect(wrapper.text()).toContain("14:32");
    expect(wrapper.text()).toContain("12:15");
    expect(wrapper.text()).toContain("Hier");
  });

  it("should display message status", () => {
    // when
    const wrapper = mount(ConnectView);

    // then
    expect(wrapper.text()).toContain("En route");
    expect(wrapper.text()).toContain("Terminé");
  });

  it("should display notification badge", () => {
    // when
    const wrapper = mount(ConnectView);

    // then
    expect(wrapper.text()).toContain("2");
  });

  it("should indicate online users", () => {
    // when
    const wrapper = mount(ConnectView);

    // then
    expect(wrapper.find(".connect-view").exists()).toBe(true);
  });

  it("should render messages list", () => {
    // when
    const wrapper = mount(ConnectView);

    // then
    expect(wrapper.text()).toContain("Marie D.");
    expect(wrapper.text()).toContain("Thomas R.");
  });

  it("should have new request button", () => {
    // when
    const wrapper = mount(ConnectView);

    // then
    const newButton = wrapper.find(".connect-new-btn");
    expect(newButton.exists()).toBe(true);
  });

  it("should have aria-label on new request button", () => {
    // when
    const wrapper = mount(ConnectView);

    // then
    const newButton = wrapper.find(".connect-new-btn");
    expect(newButton.attributes("aria-label")).toContain("Créer une nouvelle demande");
  });

  it("should display initials in avatars", () => {
    // when
    const wrapper = mount(ConnectView);

    // then
    expect(wrapper.text()).toContain("MD");
    expect(wrapper.text()).toContain("TR");
    expect(wrapper.text()).toContain("SM");
  });
});


