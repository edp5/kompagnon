import { afterEach, describe, expect, it, vi } from "vitest";

import { loginUser, registerNewUser } from "@/adapters/authentication.js";

describe("Unit | Adapters | Authentication", () => {
  describe("#registerNewUser", () => {
    const payload = {
      firstname: "John",
      lastname: "Doe",
      email: "john.doe@example.com",
      password: "password123",
      birthday: "2000-01-01",
    };

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should call the registration endpoint with provided payload", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({ ok: true });

      // when
      const result = await registerNewUser(payload);

      // then
      expect(result).toEqual({ success: true });
      expect(fetchSpy).toHaveBeenCalledWith("/api/authentication/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    });

    it("should return a failure message if response is not ok", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false });

      // when
      const result = await registerNewUser(payload);

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Registration failed. Please try again.");
    });

    it("should handle network errors gracefully", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await registerNewUser(payload);

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Unable to reach the server. Please try again later.");
    });
  });

  describe("#loginUser", () => {
    const payload = {
      email: "john.doe@example.com",
      password: "password123",
    };

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should call the login endpoint with provided payload and return user on success", async () => {
      // given
      const mockUser = { id: 1, email: "john.doe@example.com" };
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ user: mockUser }),
      });

      // when
      const result = await loginUser(payload);

      // then
      expect(result).toEqual({ success: true, user: mockUser });
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
