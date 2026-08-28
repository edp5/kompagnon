import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ref } from "vue";

import { getJourneys } from "@/adapters/journeys.js";
import { useGeolocation } from "@/composables/useGeolocation.js";
import { useAuthStore } from "@/stores/auth.js";
import MapView from "@/views/MapView.vue";

vi.mock("@/adapters/journeys.js", () => ({
  getJourneys: vi.fn(),
}));

vi.mock("@/composables/useGeolocation.js", () => ({
  useGeolocation: vi.fn(),
}));

function createLayerStub() {
  const layer = {};
  layer.addTo = vi.fn(() => layer);
  layer.bindPopup = vi.fn(() => layer);
  layer.setLatLng = vi.fn(() => layer);
  return layer;
}

const mapInstance = {
  setView: vi.fn(function setView() { return mapInstance; }),
  fitBounds: vi.fn(),
  removeLayer: vi.fn(),
  remove: vi.fn(),
};

vi.mock("leaflet", () => ({
  default: {
    map: vi.fn(() => mapInstance),
    tileLayer: vi.fn(() => createLayerStub()),
    marker: vi.fn(() => createLayerStub()),
    polyline: vi.fn(() => createLayerStub()),
    circleMarker: vi.fn(() => createLayerStub()),
    Icon: {
      Default: {
        prototype: {},
        mergeOptions: vi.fn(),
      },
    },
  },
}));

const journey = {
  departureAddress: "Paris Gare de Lyon",
  arrivalAddress: "Lyon Part-Dieu",
  departureLat: "48.85660000",
  departureLon: "2.35220000",
  arrivalLat: "45.75800000",
  arrivalLon: "4.83200000",
};

function mockGeolocation({ coords = ref(null), error = ref(""), isLoading = ref(false), isSupported = true, locate = vi.fn() } = {}) {
  useGeolocation.mockReturnValue({ coords, error, isLoading, isSupported, locate });
  return { coords, error, isLoading, isSupported, locate };
}

async function mountView() {
  const wrapper = mount(MapView);
  await flushPromises();
  return wrapper;
}

describe("Unit | Views | MapView", () => {
  let L;

  beforeEach(async () => {
    setActivePinia(createPinia());
    const authStore = useAuthStore();
    authStore.setAuth("jwt-token", 1);

    vi.clearAllMocks();
    getJourneys.mockResolvedValue({ success: true, journeys: [] });
    mockGeolocation();

    L = (await import("leaflet")).default;
  });

  it("should initialise a Leaflet map and its tile layer on mount", async () => {
    // when
    await mountView();

    // then
    expect(L.map).toHaveBeenCalledOnce();
    expect(L.tileLayer).toHaveBeenCalledOnce();
    expect(mapInstance.setView).toHaveBeenCalledWith([48.8566, 2.3522], 12);
  });

  it("should request the user's journeys with the authenticated token", async () => {
    // when
    await mountView();

    // then
    expect(getJourneys).toHaveBeenCalledWith({ token: "jwt-token" });
  });

  it("should display a loading indicator while journeys are being fetched", () => {
    // given
    getJourneys.mockReturnValue(new Promise(() => {}));

    // when
    const wrapper = mount(MapView);

    // then
    expect(wrapper.text()).toContain("Chargement des trajets");
  });

  it("should render a departure marker, an arrival marker and a link line for each valid journey", async () => {
    // given
    getJourneys.mockResolvedValue({ success: true, journeys: [journey] });

    // when
    await mountView();

    // then
    expect(L.marker).toHaveBeenCalledTimes(2);
    expect(L.marker).toHaveBeenCalledWith([48.8566, 2.3522]);
    expect(L.marker).toHaveBeenCalledWith([45.758, 4.832]);
    expect(L.polyline).toHaveBeenCalledOnce();
    expect(mapInstance.fitBounds).toHaveBeenCalled();
  });

  it("should skip journeys with missing or invalid coordinates", async () => {
    // given
    getJourneys.mockResolvedValue({
      success: true,
      journeys: [{ ...journey, arrivalLat: "not-a-number" }],
    });

    // when
    await mountView();

    // then
    expect(L.marker).not.toHaveBeenCalled();
    expect(L.polyline).not.toHaveBeenCalled();
  });

  it("should display an error message when journeys fail to load", async () => {
    // given
    getJourneys.mockResolvedValue({ success: false, message: "Impossible de récupérer vos trajets." });

    // when
    const wrapper = await mountView();

    // then
    expect(wrapper.text()).toContain("Impossible de récupérer vos trajets.");
  });

  it("should place a marker for the user's position once geolocation resolves", async () => {
    // given
    const coords = ref(null);
    mockGeolocation({ coords });

    // when
    const wrapper = await mountView();
    coords.value = { latitude: 48.86, longitude: 2.35, accuracy: 15 };
    await flushPromises();
    await wrapper.vm.$nextTick();

    // then
    expect(L.circleMarker).toHaveBeenCalledWith([48.86, 2.35], expect.objectContaining({ fillColor: "#2f8fa8" }));
  });

  it("should call locate on mount and again when the locate button is clicked", async () => {
    // given
    const locate = vi.fn();
    mockGeolocation({ locate });

    // when
    const wrapper = await mountView();
    await wrapper.find(".map-locate-btn").trigger("click");

    // then
    expect(locate).toHaveBeenCalledTimes(2);
  });

  it("should disable the locate button and show a message when geolocation is unsupported", async () => {
    // given
    mockGeolocation({ isSupported: false });

    // when
    const wrapper = await mountView();

    // then
    expect(wrapper.find(".map-locate-btn").attributes("disabled")).toBeDefined();
    expect(wrapper.text()).toContain("n'est pas disponible sur cet appareil");
  });

  it("should display the geolocation error message when locating fails", async () => {
    // given
    mockGeolocation({ error: ref("Vous avez refusé l'accès à votre position.") });

    // when
    const wrapper = await mountView();

    // then
    expect(wrapper.text()).toContain("Vous avez refusé l'accès à votre position.");
  });

  it("should remove the Leaflet map instance when the component is unmounted", async () => {
    // when
    const wrapper = await mountView();
    wrapper.unmount();

    // then
    expect(mapInstance.remove).toHaveBeenCalledOnce();
  });
});
