import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getJourney } from "@/adapters/journeys.js";
import { useAuthStore } from "@/stores/auth.js";
import JourneyView from "@/views/JourneyView.vue";

vi.mock("@/adapters/journeys.js", () => ({
  getJourney: vi.fn(),
}));

const mockBack = vi.fn();
const mockRoute = { params: { journeyId: "42" } };

vi.mock("vue-router", () => ({
  useRouter: () => ({ back: mockBack }),
  useRoute: () => mockRoute,
}));

const journey = {
  departureAddress: "10 Rue de Rivoli, Paris",
  arrivalAddress: "5 Avenue Anatole France, Paris",
  departureTime: "2026-05-16T08:30:00.000Z",
  arrivalTime: "2026-05-16T09:00:00.000Z",
  departureLat: "48.85660000",
  departureLon: "2.35220000",
  arrivalLat: "48.85840000",
  arrivalLon: "2.29450000",
};

function mountView() {
  return mount(JourneyView, {
    global: {},
  });
}

describe("Unit | Views | JourneyView", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    const authStore = useAuthStore();
    authStore.setAuth("jwt-token", 1);
    vi.clearAllMocks();
  });

  it("should display a loading indicator while fetching the journey", () => {
    // given
    getJourney.mockReturnValue(new Promise(() => {}));

    // when
    const wrapper = mountView();

    // then
    expect(wrapper.text()).toContain("Chargement du trajet");
  });

  it("should display journey details after successful fetch", async () => {
    // given
    getJourney.mockResolvedValue({ success: true, journey });

    // when
    const wrapper = mountView();
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("10 Rue de Rivoli, Paris");
    expect(wrapper.text()).toContain("5 Avenue Anatole France, Paris");
    expect(wrapper.text()).toContain("Départ");
    expect(wrapper.text()).toContain("Arrivée souhaitée");
  });

  it("should display a duration estimate based on GPS coordinates", async () => {
    // given
    getJourney.mockResolvedValue({ success: true, journey });

    // when
    const wrapper = mountView();
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Durée estimée");
    expect(wrapper.text()).toContain("km en transports en commun");
    expect(wrapper.text()).toContain("26 min");
  });

  it("should display correct duration estimate and label for various distances/durations", async () => {
    const testCases = [
      {
        lat1: "48.8566", lon1: "2.3522",
        lat2: "48.8566", lon2: "2.365",
        expectedDuration: "17 min",
      },
      {
        lat1: "48.8566", lon1: "2.3522",
        lat2: "48.8566", lon2: "2.65",
        expectedDuration: "1h05",
      },
      {
        lat1: "48.8566", lon1: "2.3522",
        lat2: "48.8566", lon2: "3.2",
        expectedDuration: "1h45",
      },
      {
        lat1: "48.8566", lon1: "2.3522",
        lat2: "48.8566", lon2: "2.939",
        expectedDuration: "2h",
      },
    ];

    for (const tc of testCases) {
      const customJourney = {
        ...journey,
        departureLat: tc.lat1,
        departureLon: tc.lon1,
        arrivalLat: tc.lat2,
        arrivalLon: tc.lon2,
      };
      getJourney.mockResolvedValue({ success: true, journey: customJourney });
      const wrapper = mountView();
      await flushPromises();

      expect(wrapper.text()).toContain(tc.expectedDuration);
    }
  });

  it("should display a fallback dash for invalid or missing dates", async () => {
    // given
    const customJourney = {
      ...journey,
      departureTime: null,
      arrivalTime: undefined,
    };
    getJourney.mockResolvedValue({ success: true, journey: customJourney });

    // when
    const wrapper = mountView();
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("—");
  });

  it("should not display duration banner if coordinates are missing or NaN", async () => {
    // given
    const customJourney = {
      ...journey,
      departureLat: "not-a-number",
      departureLon: "2.3522",
    };
    getJourney.mockResolvedValue({ success: true, journey: customJourney });

    // when
    const wrapper = mountView();
    await flushPromises();

    // then
    expect(wrapper.text()).not.toContain("Durée estimée");
  });

  it("should call getJourney with the token and the journeyId from the route", async () => {
    // given
    getJourney.mockResolvedValue({ success: true, journey });

    // when
    mountView();
    await flushPromises();

    // then
    expect(getJourney).toHaveBeenCalledWith({ token: "jwt-token", journeyId: "42" });
  });

  it("should display an error message when the fetch fails", async () => {
    // given
    getJourney.mockResolvedValue({ success: false, message: "Ce trajet est introuvable." });

    // when
    const wrapper = mountView();
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Ce trajet est introuvable.");
  });

  it("should display a generic error message when the fetch fails without a message", async () => {
    // given
    getJourney.mockResolvedValue({ success: false });

    // when
    const wrapper = mountView();
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Une erreur est survenue.");
  });

  it("should navigate back when the back button is clicked", async () => {
    // given
    getJourney.mockResolvedValue({ success: true, journey });
    const wrapper = mountView();
    await flushPromises();

    // when
    await wrapper.find("button").trigger("click");

    // then
    expect(mockBack).toHaveBeenCalledOnce();
  });
});
