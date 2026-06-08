import { describe, expect, it } from "vitest";

import { DomainError } from "../../../../../src/shared/domain/models/domain-error.js";

describe("Unit | Shared | Domain | Models | Domain error", () => {
  describe("#constructor", () => {
    it("should create an error with message and statusCode", () => {
      // given
      const message = "Test error message";
      const statusCode = 400;

      // when
      const error = new DomainError(message, statusCode);

      // then
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(DomainError);
      expect(error.message).toBe(message);
      expect(error.statusCode).toBe(statusCode);
      expect(error.name).toBe("DomainError");
    });

    it("should have a stack trace", () => {
      // given
      const error = new DomainError("Test error", 500);

      // when & then
      expect(error.stack).toBeDefined();
      expect(error.stack).toContain("DomainError");
    });

    it("should default to 500 when status code is invalid", () => {
      // given
      const statusCode = 200;

      // when
      const error = new DomainError("Test error message", statusCode);

      // then
      expect(error.statusCode).toBe(500);
    });
  });
});
