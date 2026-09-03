import { afterEach, describe, expect, it, vi } from "vitest";

import { getJourney, getJourneyMatches, getJourneys, getTrackingPoints, postTrackingPoint, recordJourney, updateFoundJourneyStatus, updateJourneyStatus } from "@/adapters/journeys.js";

describe("Unit | Adapters | Journeys", () => {
  const payload = {
    token: "jwt-token",
    departureAddress: "10 Rue de Rivoli, Paris",
    arrivalAddress: "5 Avenue Anatole France, Paris",
    departureLat: 48.8566,
    departureLon: 2.3522,
    arrivalLat: 48.8584,
    arrivalLon: 2.2945,
    departureTime: "2026-05-16T08:30:00.000Z",
    arrivalTime: "2026-05-16T09:00:00.000Z",
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("#recordJourney", () => {
    it("should POST the journey with the bearer token and return the journey id", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: { journeyId: "journey-1" } }),
      });

      // when
      const result = await recordJourney(payload);

      // then
      expect(result).toEqual({ success: true, journeyId: "journey-1" });
      expect(fetchSpy).toHaveBeenCalledWith("/api/journeys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer jwt-token",
        },
        body: JSON.stringify({
          departureAddress: payload.departureAddress,
          arrivalAddress: payload.arrivalAddress,
          departureLat: payload.departureLat,
          departureLon: payload.departureLon,
          arrivalLat: payload.arrivalLat,
          arrivalLon: payload.arrivalLon,
          departureTime: payload.departureTime,
          arrivalTime: payload.arrivalTime,
        }),
      });
    });

    it("should return a session expired message on 401", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 401 });

      // when
      const result = await recordJourney(payload);

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Session expirée. Merci de vous reconnecter.");
    });

    it("should return a generic failure message on other errors", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 500 });

      // when
      const result = await recordJourney(payload);

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible d'enregistrer le trajet. Veuillez réessayer.");
    });

    it("should handle network errors gracefully", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await recordJourney(payload);

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });

  describe("#getJourney", () => {
    const journey = {
      departureAddress: "10 Rue de Rivoli, Paris",
      arrivalAddress: "5 Avenue Anatole France, Paris",
      departureLat: 48.8566,
      departureLon: 2.3522,
      arrivalLat: 48.8584,
      arrivalLon: 2.2945,
      departureTime: "2026-05-16T08:30:00.000Z",
      arrivalTime: "2026-05-16T09:00:00.000Z",
    };

    it("should GET the journey with the bearer token and return journey data", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: journey }),
      });

      // when
      const result = await getJourney({ token: "jwt-token", journeyId: 42 });

      // then
      expect(result).toEqual({ success: true, journey });
      expect(fetchSpy).toHaveBeenCalledWith("/api/journeys/42", {
        method: "GET",
        headers: {
          Authorization: "Bearer jwt-token",
        },
      });
    });

    it("should return a session expired message on 401", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 401 });

      // when
      const result = await getJourney({ token: "jwt-token", journeyId: 42 });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Session expirée. Merci de vous reconnecter.");
    });

    it("should return a not found message on 404", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 404 });

      // when
      const result = await getJourney({ token: "jwt-token", journeyId: 99 });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Ce trajet est introuvable.");
    });

    it("should return a generic failure message on other errors", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 500 });

      // when
      const result = await getJourney({ token: "jwt-token", journeyId: 42 });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de récupérer le trajet. Veuillez réessayer.");
    });

    it("should handle network errors gracefully", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await getJourney({ token: "jwt-token", journeyId: 42 });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });

  describe("#getJourneys", () => {
    const journeysList = [
      {
        id: 1,
        departureAddress: "Paris Gare de Lyon",
        arrivalAddress: "Lyon Part-Dieu",
        departureTime: "2026-06-13T11:32:38.325Z",
        arrivalTime: "2026-06-13T13:32:38.325Z",
      },
    ];

    it("should GET all journeys for the authenticated user", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: journeysList }),
      });

      // when
      const result = await getJourneys({ token: "jwt-token" });

      // then
      expect(result).toEqual({ success: true, journeys: journeysList });
      expect(fetchSpy).toHaveBeenCalledWith("/api/journeys", {
        method: "GET",
        headers: { Authorization: "Bearer jwt-token" },
      });
    });

    it("should return an empty array when the API returns no journeys", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [] }),
      });

      // when
      const result = await getJourneys({ token: "jwt-token" });

      // then
      expect(result).toEqual({ success: true, journeys: [] });
    });

    it("should return a session expired message on 401", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 401 });

      // when
      const result = await getJourneys({ token: "jwt-token" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Session expirée. Merci de vous reconnecter.");
    });

    it("should return a generic failure message on other errors", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 500 });

      // when
      const result = await getJourneys({ token: "jwt-token" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de récupérer vos trajets. Veuillez réessayer.");
    });

    it("should handle network errors gracefully", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await getJourneys({ token: "jwt-token" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });

  describe("#getJourneyMatches", () => {
    it("should GET the matches and return them", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: [{ foundJourneyId: 3 }] }),
      });

      // when
      const result = await getJourneyMatches({ token: "jwt-token", journeyId: 42 });

      // then
      expect(fetchSpy).toHaveBeenCalledWith("/api/journeys/42/matches", {
        method: "GET",
        headers: { Authorization: "Bearer jwt-token" },
      });
      expect(result).toEqual({ success: true, matches: [{ foundJourneyId: 3 }] });
    });

    it("should return a failure message when the response is not ok", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 500 });

      // when
      const result = await getJourneyMatches({ token: "jwt-token", journeyId: 42 });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de récupérer les correspondances.");
    });

    it("should handle network errors gracefully", async () => {
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));
      const result = await getJourneyMatches({ token: "jwt-token", journeyId: 42 });
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });

  describe("#updateFoundJourneyStatus", () => {
    it("should PUT the updated status with the bearer token", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({ ok: true });

      // when
      const result = await updateFoundJourneyStatus({ token: "jwt-token", foundJourneyId: 3, accept: true });

      // then
      expect(fetchSpy).toHaveBeenCalledWith("/api/journeys/found/3", {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: "Bearer jwt-token" },
        body: JSON.stringify({ updatedStatus: true }),
      });
      expect(result).toEqual({ success: true });
    });

    it("should return a failure message when the response is not ok", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 500 });

      // when
      const result = await updateFoundJourneyStatus({ token: "jwt-token", foundJourneyId: 3, accept: false });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de mettre à jour le trajet. Veuillez réessayer.");
    });

    it("should handle network errors gracefully", async () => {
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));
      const result = await updateFoundJourneyStatus({ token: "jwt-token", foundJourneyId: 3, accept: false });
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });

  describe("#postTrackingPoint", () => {
    it("should POST the tracking point and return it", async () => {
      const point = { id: 1, lat: 48, lon: 2 };
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: point }),
      });

      const result = await postTrackingPoint({ token: "jwt", journeyId: 1, lat: 48, lon: 2 });

      expect(fetchSpy).toHaveBeenCalledWith("/api/journeys/1/tracking", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer jwt" },
        body: JSON.stringify({ lat: 48, lon: 2 }),
      });
      expect(result).toEqual({ success: true, point });
    });

    it("should handle error", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false });
      const result = await postTrackingPoint({ token: "jwt", journeyId: 1, lat: 48, lon: 2 });
      expect(result.success).toBe(false);
    });

    it("should handle exception", async () => {
      vi.spyOn(global, "fetch").mockRejectedValue(new Error());
      const result = await postTrackingPoint({ token: "jwt", journeyId: 1, lat: 48, lon: 2 });
      expect(result.success).toBe(false);
    });
  });

  describe("#getTrackingPoints", () => {
    it("should GET the tracking points", async () => {
      const points = [{ id: 1, lat: 48, lon: 2 }];
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: points }),
      });

      const result = await getTrackingPoints({ token: "jwt", journeyId: 1 });

      expect(fetchSpy).toHaveBeenCalledWith("/api/journeys/1/tracking", {
        method: "GET",
        headers: { Authorization: "Bearer jwt" },
      });
      expect(result).toEqual({ success: true, points });
    });

    it("should handle error", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false });
      const result = await getTrackingPoints({ token: "jwt", journeyId: 1 });
      expect(result.success).toBe(false);
    });

    it("should handle exception", async () => {
      vi.spyOn(global, "fetch").mockRejectedValue(new Error());
      const result = await getTrackingPoints({ token: "jwt", journeyId: 1 });
      expect(result.success).toBe(false);
    });
  });

  describe("#updateJourneyStatus", () => {
    it("should PATCH the journey status", async () => {
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({ ok: true });

      const result = await updateJourneyStatus({ token: "jwt", journeyId: 1, status: "in_progress" });

      expect(fetchSpy).toHaveBeenCalledWith("/api/journeys/1/status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: "Bearer jwt" },
        body: JSON.stringify({ status: "in_progress" }),
      });
      expect(result).toEqual({ success: true });
    });

    it("should handle error", async () => {
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false });
      const result = await updateJourneyStatus({ token: "jwt", journeyId: 1, status: "completed" });
      expect(result.success).toBe(false);
    });

    it("should handle exception", async () => {
      vi.spyOn(global, "fetch").mockRejectedValue(new Error());
      const result = await updateJourneyStatus({ token: "jwt", journeyId: 1, status: "completed" });
      expect(result.success).toBe(false);
    });
  });
});
