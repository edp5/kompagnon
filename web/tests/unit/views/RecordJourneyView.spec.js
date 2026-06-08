import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { recordJourney } from "@/adapters/journeys.js";
import { useAuthStore } from "@/stores/auth.js";
import RecordJourneyView from "@/views/RecordJourneyView.vue";

vi.mock("@/adapters/journeys.js", () => ({
  recordJourney: vi.fn(),
}));

const AddressStub = {
  name: "AddressAutocomplete",
  props: ["id", "modelValue"],
  emits: ["update:modelValue"],
  template: "<button type=\"button\" :data-test=\"id\" @click=\"$emit('update:modelValue', { label: id + ' address', lat: 1, lon: 2 })\">set-{{ id }}</button>",
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

  it("should record the journey with the resolved addresses and ISO times", async () => {
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
    expect(wrapper.text()).toContain("Vos informations de trajet ont bien été enregistrées.");
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
