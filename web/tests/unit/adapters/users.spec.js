import { describe, expect, it, vi } from "vitest";

import { getUserProfile } from "@/adapters/users.js";

describe("Unit | Adapters | Users", () => {
  describe("#getUserProfile", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

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
});
