import { afterEach, describe, expect, it, vi } from "vitest";

import { registerNewUser } from "@/adapters/authentication.js";

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
});
