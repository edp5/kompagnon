import { afterEach, describe, expect, it, vi } from "vitest";

import { loginUser } from "@/adapters/authentication.js";

describe("Unit | Adapters | Authentication", () => {
  describe("#loginUser", () => {
    const payload = {
      email: "admin@example.com",
      password: "password123",
    };

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should call the login endpoint with provided payload and return token and userId on success", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ data: { token: "jwt-token", userId: 1 } }),
      });

      // when
      const result = await loginUser(payload);

      // then
      expect(result).toEqual({ success: true, token: "jwt-token", userId: 1 });
      expect(fetchSpy).toHaveBeenCalledWith("/api/authentication/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    });

    it("should return a specific failure message if response status is 401", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 401,
      });

      // when
      const result = await loginUser(payload);

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Identifiants incorrects.");
    });

    it("should return a general failure message if response is not ok and status is not 401", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 500,
      });

      // when
      const result = await loginUser(payload);

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Échec de la connexion. Veuillez réessayer.");
    });

    it("should handle network errors gracefully", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await loginUser(payload);

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });
});
