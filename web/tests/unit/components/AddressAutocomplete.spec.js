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
});
