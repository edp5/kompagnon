import { flushPromises, mount } from "@vue/test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { searchAddress } from "@/adapters/geocoding.js";
import AddressAutocomplete from "@/components/AddressAutocomplete.vue";

vi.mock("@/adapters/geocoding.js", () => ({
  searchAddress: vi.fn(),
}));

function mountComponent() {
  return mount(AddressAutocomplete, {
    props: {
      id: "departure",
      label: "Adresse de départ",
    },
  });
}

describe("Unit | Components | AddressAutocomplete", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should not search when the query is shorter than the minimum length", async () => {
    // given
    const wrapper = mountComponent();

    // when
    await wrapper.get("input").setValue("ab");
    await vi.runAllTimersAsync();

    // then
    expect(searchAddress).not.toHaveBeenCalled();
  });

  it("should show suggestions returned by the geocoding service", async () => {
    // given
    searchAddress.mockResolvedValue({
      success: true,
      results: [{ label: "10 Rue de Rivoli, Paris", lat: 48.8566, lon: 2.3522 }],
    });
    const wrapper = mountComponent();

    // when
    await wrapper.get("input").setValue("rue de rivoli");
    await vi.runAllTimersAsync();
    await flushPromises();

    // then
    expect(searchAddress).toHaveBeenCalledWith("rue de rivoli");
    expect(wrapper.find("[role=\"listbox\"]").exists()).toBe(true);
    expect(wrapper.text()).toContain("10 Rue de Rivoli, Paris");
  });

  it("should expose the combobox role and state on the input itself", () => {
    // given
    const wrapper = mountComponent();

    // when
    const input = wrapper.get("input");

    // then
    expect(input.attributes("role")).toBe("combobox");
    expect(input.attributes("aria-expanded")).toBe("false");
    expect(input.attributes("aria-autocomplete")).toBe("list");
    expect(input.attributes("aria-controls")).toBe("departure-listbox");
  });

  it("should clear the displayed address when the parent resets the selection", async () => {
    // given
    const place = { label: "10 Rue de Rivoli, Paris", lat: 48.8566, lon: 2.3522 };
    const wrapper = mount(AddressAutocomplete, {
      props: { id: "departure", label: "Adresse de départ", modelValue: place },
    });
    expect(wrapper.get("input").element.value).toBe(place.label);

    // when
    await wrapper.setProps({ modelValue: null });

    // then
    expect(wrapper.get("input").element.value).toBe("");
  });

  it("should emit the selected place when a suggestion is clicked", async () => {
    // given
    const place = { label: "10 Rue de Rivoli, Paris", lat: 48.8566, lon: 2.3522 };
    searchAddress.mockResolvedValue({ success: true, results: [place] });
    const wrapper = mountComponent();

    // when
    await wrapper.get("input").setValue("rue de rivoli");
    await vi.runAllTimersAsync();
    await flushPromises();
    await wrapper.get("[role=\"option\"]").trigger("click");

    // then
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([place]);
    expect(wrapper.find("[role=\"listbox\"]").exists()).toBe(false);
  });

  it("should select a suggestion with the keyboard", async () => {
    // given
    const place = { label: "10 Rue de Rivoli, Paris", lat: 48.8566, lon: 2.3522 };
    searchAddress.mockResolvedValue({ success: true, results: [place] });
    const wrapper = mountComponent();

    // when
    await wrapper.get("input").setValue("rue de rivoli");
    await vi.runAllTimersAsync();
    await flushPromises();
    await wrapper.get("[role=\"option\"]").trigger("keydown.enter");

    // then
    expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([place]);
    expect(wrapper.find("[role=\"listbox\"]").exists()).toBe(false);
  });

  it("should select a suggestion with the space key", async () => {
    // given
    const place = { label: "10 Rue de Rivoli, Paris", lat: 48.8566, lon: 2.3522 };
    searchAddress.mockResolvedValue({ success: true, results: [place] });
    const wrapper = mountComponent();

    // when
    await wrapper.get("input").setValue("rue de rivoli");
    await vi.runAllTimersAsync();
    await flushPromises();
    await wrapper.get("[role=\"option\"]").trigger("keydown.space");

    // then
    expect(wrapper.emitted("update:modelValue").at(-1)).toEqual([place]);
  });

  it("should reflect a place set by the parent", async () => {
    // given
    const place = { label: "5 Avenue Anatole France, Paris", lat: 48.8584, lon: 2.2945 };
    const wrapper = mountComponent();

    // when
    await wrapper.setProps({ modelValue: place });

    // then
    expect(wrapper.get("input").element.value).toBe(place.label);
  });

  it("should show an error message when the geocoding service fails", async () => {
    // given
    searchAddress.mockResolvedValue({ success: false, message: "Service indisponible." });
    const wrapper = mountComponent();

    // when
    await wrapper.get("input").setValue("rue de rivoli");
    await vi.runAllTimersAsync();
    await flushPromises();

    // then
    expect(wrapper.get("[role=\"alert\"]").text()).toBe("Service indisponible.");
    expect(wrapper.find("[role=\"listbox\"]").exists()).toBe(false);
  });

  it("should invalidate the selection and debounce when the field is edited", async () => {
    // given
    const place = { label: "10 Rue de Rivoli, Paris", lat: 48.8566, lon: 2.3522 };
    searchAddress.mockResolvedValue({ success: true, results: [] });
    const wrapper = mount(AddressAutocomplete, {
      props: { id: "departure", label: "Adresse de départ", modelValue: place },
    });

    // when - editing twice quickly resets the resolved coordinates and debounces
    await wrapper.get("input").setValue("rue de");
    await wrapper.get("input").setValue("rue de r");
    await vi.runAllTimersAsync();
    await flushPromises();

    // then
    expect(wrapper.emitted("update:modelValue")[0]).toEqual([null]);
    expect(searchAddress).toHaveBeenCalledTimes(1);
  });
});
