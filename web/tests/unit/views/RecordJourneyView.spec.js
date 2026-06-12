import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { recordJourney } from "@/adapters/journeys.js";
import { useAuthStore } from "@/stores/auth.js";
import RecordJourneyView from "@/views/RecordJourneyView.vue";

vi.mock("@/adapters/journeys.js", () => ({
  recordJourney: vi.fn(),
}));

const mockPush = vi.fn();

vi.mock("vue-router", () => ({
  useRouter: () => ({ push: mockPush }),
}));

const AddressStub = {
  name: "AddressAutocomplete",
  props: ["id", "modelValue"],
  emits: ["update:modelValue"],
  template: `<div>
    <button type="button" :data-test="id" @click="$emit('update:modelValue', { label: id + ' address', lat: 1, lon: 2 })">set-{{ id }}</button>
    <span :data-value="id">{{ modelValue ? modelValue.label : '' }}</span>
  </div>`,
};

function mountView() {
  return mount(RecordJourneyView, {
    global: {
      stubs: { AddressAutocomplete: AddressStub },
    },
  });
}

async function fillForm(wrapper) {
  await wrapper.get("[data-test=\"departure\"]").trigger("click");
  await wrapper.get("[data-test=\"arrival\"]").trigger("click");
  await wrapper.get("input[name=\"departureTime\"]").setValue("2026-05-16T08:30");
  await wrapper.get("input[name=\"arrivalTime\"]").setValue("2026-05-16T09:00");
}

describe("Unit | Views | RecordJourneyView", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    const authStore = useAuthStore();
    authStore.setAuth("jwt-token", 1);
    vi.clearAllMocks();
  });

  it("should pre-fill departure time with the current date and time", () => {
    // given
    const before = new Date();

    // when
    const wrapper = mountView();
    const after = new Date();

    // then
    const depValue = wrapper.get("input[name=\"departureTime\"]").element.value;
    const arrValue = wrapper.get("input[name=\"arrivalTime\"]").element.value;

    const depDate = new Date(depValue);
    const arrDate = new Date(arrValue);

    expect(depDate.getTime()).toBeGreaterThanOrEqual(before.getTime() - 60000);
    expect(depDate.getTime()).toBeLessThanOrEqual(after.getTime() + 60000);
    expect(arrDate.getTime() - depDate.getTime()).toBeCloseTo(60 * 60 * 1000, -4);
  });

  it("should redirect to the journey page after a successful submission", async () => {
    // given
    recordJourney.mockResolvedValue({ success: true, journeyId: "journey-1" });

    // when
    const wrapper = mountView();
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(recordJourney).toHaveBeenCalledWith({
      token: "jwt-token",
      departureAddress: "departure address",
      arrivalAddress: "arrival address",
      departureLat: 1,
      departureLon: 2,
      arrivalLat: 1,
      arrivalLon: 2,
      departureTime: new Date("2026-05-16T08:30").toISOString(),
      arrivalTime: new Date("2026-05-16T09:00").toISOString(),
    });
    expect(mockPush).toHaveBeenCalledWith({ name: "journey", params: { journeyId: "journey-1" } });
  });

  it("should block submission and warn when required fields are missing", async () => {
    // when
    const wrapper = mountView();
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(recordJourney).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain("Veuillez renseigner le départ, l'arrivée et les horaires.");
  });

  it("should block submission when arrival is not after departure", async () => {
    // given
    const wrapper = mountView();
    await wrapper.get("[data-test=\"departure\"]").trigger("click");
    await wrapper.get("[data-test=\"arrival\"]").trigger("click");
    await wrapper.get("input[name=\"departureTime\"]").setValue("2026-05-16T09:00");
    await wrapper.get("input[name=\"arrivalTime\"]").setValue("2026-05-16T08:30");

    // when
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(recordJourney).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain("L'heure d'arrivée doit être postérieure à l'heure de départ.");
  });

  it("should show an error message when the recording fails", async () => {
    // given
    recordJourney.mockResolvedValue({ success: false, message: "Impossible d'enregistrer le trajet. Veuillez réessayer." });

    // when
    const wrapper = mountView();
    await fillForm(wrapper);
    await wrapper.find("form").trigger("submit");
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Impossible d'enregistrer le trajet. Veuillez réessayer.");
  });
});
