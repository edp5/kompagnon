import { afterEach, describe, expect, it, vi } from "vitest";

import { searchAddress } from "@/adapters/geocoding.js";

describe("Unit | Adapters | Geocoding", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("#searchAddress", () => {
    it("should return an empty list without calling the API for a blank query", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch");

      // when
      const result = await searchAddress("   ");

      // then
      expect(result).toEqual({ success: true, results: [] });
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it("should normalize Nominatim results into label/lat/lon", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve([
          { display_name: "10 Rue de Rivoli, Paris", lat: "48.8566", lon: "2.3522" },
        ]),
      });

      // when
      const result = await searchAddress("rue de rivoli");

      // then
      expect(result).toEqual({
        success: true,
        results: [
          { label: "10 Rue de Rivoli, Paris", lat: 48.8566, lon: 2.3522 },
        ],
      });
    });

    it("should return a failure message when the response is not ok", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false });

      // when
      const result = await searchAddress("paris");

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de rechercher l'adresse. Veuillez réessayer.");
    });

    it("should handle network errors gracefully", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await searchAddress("paris");

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le service d'adresses. Veuillez réessayer plus tard.");
    });
  });
});
