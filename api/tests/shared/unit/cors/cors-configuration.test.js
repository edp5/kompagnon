import { describe, expect, it } from "vitest";

import { config } from "../../../../config.js";

describe("Unit | Shared | CORS configuration", () => {
  describe("allowedOrigins property", () => {
    it("should have an allowedOrigins property defined", () => {
      expect(config).toHaveProperty("allowedOrigins");
    });

    it("should be an array", () => {
      expect(Array.isArray(config.allowedOrigins)).toBe(true);
    });

    it("should default to an empty array in test environment", () => {
      expect(config.allowedOrigins).toEqual([]);
    });
  });
});
