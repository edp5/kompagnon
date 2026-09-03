import { afterEach, describe, expect, it, vi } from "vitest";

import { getUserProfile, getUserReviews } from "@/adapters/users.js";

describe("Unit | Adapters | Users", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("#getUserProfile", () => {
    it("should return profile data on success", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ data: { firstname: "John", lastname: "Doe", email: "john@example.com", birthday: "1990-05-15" } }),
      });

      // when
      const result = await getUserProfile({ token: "valid-token" });

      // then
      expect(result).toEqual({
        success: true,
        profile: {
          firstname: "John",
          lastname: "Doe",
          email: "john@example.com",
          birthday: "1990-05-15",
        },
      });
      expect(fetch).toHaveBeenCalledWith("/api/users/profile", {
        method: "GET",
        headers: {
          Authorization: "Bearer valid-token",
        },
      });
    });

    it("should return a dedicated message when token is invalid", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 401,
      });

      // when
      const result = await getUserProfile({ token: "invalid-token" });

      // then
      expect(result).toEqual({
        success: false,
        errorCode: "SESSION_EXPIRED",
        message: "Session expirée. Merci de vous reconnecter.",
      });
    });
  });

  describe("#getUserReviews", () => {
    it("should fetch reviews and statistics for the given user id", async () => {
      // given
      const mockReviewsData = {
        averageRating: 4.9,
        reviewCount: 3,
        reviews: [
          { id: 1, rating: 5, comment: "Top", authorFirstname: "Ada", authorLastname: "Lovelace" },
        ],
      };
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: () => Promise.resolve({ data: mockReviewsData }),
      });

      // when
      const result = await getUserReviews({ token: "auth-token", userId: 15, limit: 5, offset: 0 });

      // then
      expect(result).toEqual({
        success: true,
        averageRating: 4.9,
        reviewCount: 3,
        reviews: mockReviewsData.reviews,
      });
      expect(fetchSpy).toHaveBeenCalledWith("/api/users/15/reviews?limit=5&offset=0", {
        method: "GET",
        headers: {
          Authorization: "Bearer auth-token",
        },
      });
    });

    it("should return error message when response is not ok", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false, status: 500 });

      // when
      const result = await getUserReviews({ userId: 15 });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de charger les avis utilisateur.");
    });

    it("should handle network exceptions gracefully", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await getUserReviews({ userId: 15 });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });
});

