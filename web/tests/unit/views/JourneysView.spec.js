import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getJourneys } from "@/adapters/journeys.js";
import { useAuthStore } from "@/stores/auth.js";
import JourneysView from "@/views/JourneysView.vue";

vi.mock("@/adapters/journeys.js", () => ({
  getJourneys: vi.fn(),
}));

vi.mock("vue-router", () => ({
  RouterLink: { template: "<a><slot /></a>", props: ["to"] },
  useRoute: () => ({ name: "journeys" }),
  useRouter: () => ({}),
}));

const now = new Date();
const inTwoHours = new Date(now.getTime() + 2 * 60 * 60 * 1000);
const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const yesterdayEnd = new Date(yesterday.getTime() + 2 * 60 * 60 * 1000);
const inThirtyMin = new Date(now.getTime() - 30 * 60 * 1000);
const inNinetyMin = new Date(now.getTime() + 90 * 60 * 1000);

const journeysList = [
  {
    id: 1,
    departureAddress: "Paris Gare de Lyon",
    arrivalAddress: "Lyon Part-Dieu",
    departureTime: inTwoHours.toISOString(),
    arrivalTime: new Date(inTwoHours.getTime() + 2 * 60 * 60 * 1000).toISOString(),
    isMatched: false,
  },
  {
    id: 2,
    departureAddress: "Marseille Saint-Charles",
    arrivalAddress: "Aix-en-Provence",
    departureTime: yesterday.toISOString(),
    arrivalTime: yesterdayEnd.toISOString(),
    isMatched: false,
  },
  {
    id: 3,
    departureAddress: "Nantes",
    arrivalAddress: "Rennes",
    departureTime: inThirtyMin.toISOString(),
    arrivalTime: inNinetyMin.toISOString(),
    isMatched: true,
  },
];

function mountView() {
  return mount(JourneysView, { global: {} });
}

describe("Unit | Views | JourneysView", () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
    const authStore = useAuthStore();
    authStore.setAuth("jwt-token", 1);
    vi.clearAllMocks();
  });

  it("should display a loading indicator while fetching journeys", () => {
    // given
    getJourneys.mockReturnValue(new Promise(() => {}));

    // when
    const wrapper = mountView();

    // then
    expect(wrapper.text()).toContain("Chargement de vos trajets");
  });

  it("should call getJourneys with the user token", async () => {
    // given
    getJourneys.mockResolvedValue({ success: true, journeys: [] });

    // when
    mountView();
    await flushPromises();

    // then
    expect(getJourneys).toHaveBeenCalledWith({ token: "jwt-token" });
  });

  it("should display the tabs after loading", async () => {
    // given
    getJourneys.mockResolvedValue({ success: true, journeys: journeysList });

    // when
    const wrapper = mountView();
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Planifiés");
    expect(wrapper.text()).toContain("En cours");
    expect(wrapper.text()).toContain("Passés");
  });

  it("should show the planned journey by default", async () => {
    // given
    getJourneys.mockResolvedValue({ success: true, journeys: journeysList });

    // when
    const wrapper = mountView();
    await flushPromises();

    // then — journey 1 departs in the future
    expect(wrapper.text()).toContain("Paris Gare de Lyon");
    expect(wrapper.text()).toContain("Lyon Part-Dieu");
  });

  it("should show ongoing journeys only when they are matched", async () => {
    // given — journey 3 is in its time window AND matched
    getJourneys.mockResolvedValue({ success: true, journeys: journeysList });
    const wrapper = mountView();
    await flushPromises();

    // when — switch to En cours tab
    const tabs = wrapper.findAll("[role=\"tab\"]");
    const ongoingTab = tabs.find((t) => t.text().includes("En cours"));
    await ongoingTab.trigger("click");

    // then — journey 3 (Nantes → Rennes, matched) appears
    expect(wrapper.text()).toContain("Nantes");
    expect(wrapper.text()).toContain("Rennes");
  });

  it("should keep an unmatched in-progress journey in Planifiés", async () => {
    // given — a journey in its time window but NOT matched
    const unmatchedOngoing = {
      id: 99,
      departureAddress: "Bordeaux",
      arrivalAddress: "Toulouse",
      departureTime: inThirtyMin.toISOString(),
      arrivalTime: inNinetyMin.toISOString(),
      isMatched: false,
    };
    getJourneys.mockResolvedValue({ success: true, journeys: [unmatchedOngoing] });
    const wrapper = mountView();
    await flushPromises();

    // then — it stays in Planifiés
    expect(wrapper.text()).toContain("Bordeaux");

    // when — check En cours tab
    const tabs = wrapper.findAll("[role=\"tab\"]");
    const ongoingTab = tabs.find((t) => t.text().includes("En cours"));
    await ongoingTab.trigger("click");

    // then — not visible in En cours
    expect(wrapper.text()).not.toContain("Bordeaux");
  });

  it("should switch to past journeys when the Passés tab is clicked", async () => {
    // given
    getJourneys.mockResolvedValue({ success: true, journeys: journeysList });
    const wrapper = mountView();
    await flushPromises();

    // when
    const tabs = wrapper.findAll("[role=\"tab\"]");
    const pastTab = tabs.find((t) => t.text().includes("Passés"));
    await pastTab.trigger("click");

    // then
    expect(wrapper.text()).toContain("Marseille Saint-Charles");
    expect(wrapper.text()).toContain("Aix-en-Provence");
  });

  it("should show an empty state when a tab has no journeys", async () => {
    // given — only planned journeys
    getJourneys.mockResolvedValue({ success: true, journeys: [journeysList[0]] });
    const wrapper = mountView();
    await flushPromises();

    // when — switch to Passés tab
    const tabs = wrapper.findAll("[role=\"tab\"]");
    const pastTab = tabs.find((t) => t.text().includes("Passés"));
    await pastTab.trigger("click");

    // then
    expect(wrapper.text()).toContain("Aucun trajet passé");
  });

  it("should display an error message when the fetch fails", async () => {
    // given
    getJourneys.mockResolvedValue({ success: false, message: "Session expirée." });

    // when
    const wrapper = mountView();
    await flushPromises();

    // then
    expect(wrapper.text()).toContain("Session expirée.");
  });
});
