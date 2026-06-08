import { beforeEach, describe, expect, it, vi } from "vitest";

import { DomainError } from "../../../../../src/shared/domain/models/domain-error.js";
import { errorHandler } from "../../../../../src/shared/infrastructure/middlewares/error-handler.js";
vi.mock("celebrate", async () => {
  const actual = await vi.importActual("celebrate");

  return {
    ...actual,
    isCelebrateError: vi.fn(),
  };
});

import { isCelebrateError } from "celebrate";

describe("Unit | Shared | Infrastructure | Middlewares | Error handler", () => {
  let req, res, next;

  beforeEach(() => {
    isCelebrateError.mockReset();
    isCelebrateError.mockReturnValue(false);
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  describe("#errorHandler", () => {
    it("should handle domain errors with statusCode", () => {
      // given
      const customError = new DomainError("Invalid credentials", 401);

      // when
      errorHandler(customError, req, res, next);

      // then
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Invalid credentials",
      });
    });

    it("should handle celebrate validation errors", () => {
      // given
      isCelebrateError.mockReturnValue(true);
      const validationError = {
        details: new Map([
          ["body", {
            message: "\"departureLat\" must be a number",
            details: [
              {
                path: ["departureLat"],
              },
            ],
          }],
        ]),
      };

      // when
      errorHandler(validationError, req, res, next);

      // then
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Validation failed",
        details: {
          body: {
            source: "body",
            keys: ["departureLat"],
            message: "\"departureLat\" must be a number",
          },
        },
      });
    });

    it("should handle unknown errors with 500 status", () => {
      // given
      const unknownError = new Error("Something went wrong");

      // when
      errorHandler(unknownError, req, res, next);

      // then
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Internal server error",
      });
    });

    it("should handle errors without message with 500 status", () => {
      // given
      const error = new Error();

      // when
      errorHandler(error, req, res, next);

      // then
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Internal server error",
      });
    });
  });
});
