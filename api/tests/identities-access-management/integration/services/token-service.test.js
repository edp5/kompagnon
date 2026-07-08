import jwt from "jsonwebtoken";
import { describe, expect, it } from "vitest";

import { config } from "../../../../config.js";
import { decodedToken, encodedToken } from "../../../../src/identities-access-management/services/token-service.js";

describe("Integration | Identities Access Management | Services | Token service", () => {
  describe("#encodedToken", () => {
    it("should return jwt with data", () => {
      // given
      const data = { userId: 1, birthday: "01/01/1970", firstname: "firstname" };

      // when
      const token = encodedToken(data);

      // then
      expect(token).toBeDefined();
      const decodedData = jwt.verify(token, config.jwt.tokenSecret);
      expect(data.userId).toEqual(decodedData.userId);
      expect(data.firstname).toEqual(decodedData.firstname);
      expect(data.birthday).toEqual(decodedData.birthday);
    });

    it("should handle empty object in encodedToken", () => {
      // given
      const data = {};

      // when
      const token = encodedToken(data);

      // then
      expect(token).toBeDefined();
      const decodedData = jwt.verify(token, config.jwt.tokenSecret);
      expect(decodedData).toMatchObject(data);
    });

    it("should handle complex nested object in encodedToken", () => {
      // given
      const data = {
        user: {
          id: 1,
          profile: {
            name: "Test User",
            settings: {
              theme: "dark",
              notifications: true,
            },
          },
        },
        permissions: ["read", "write"],
      };

      // when
      const token = encodedToken(data);

      // then
      expect(token).toBeDefined();
      const decodedData = jwt.verify(token, config.jwt.tokenSecret);
      expect(decodedData.user).toEqual(data.user);
      expect(decodedData.permissions).toEqual(data.permissions);
    });

    describe("error cases", () => {
      it("should handle null data in encodedToken", () => {
        // when & then
        expect(() => encodedToken(null)).toThrow();
      });

      it("should handle undefined data in encodedToken", () => {
        // when & then
        expect(() => encodedToken(undefined)).toThrow();
      });
    });
  });

  describe("#decodedToken", () => {
    it("should return data from token", () => {
      // given
      const data = { userId: 1, birthday: "01/01/1970", firstname: "firstname" };
      const token = jwt.sign(data, config.jwt.tokenSecret, { expiresIn: config.jwt.expirationTime });

      // when
      const decodedData = decodedToken(token);

      // then
      expect(data.userId).toEqual(decodedData.userId);
      expect(data.firstname).toEqual(decodedData.firstname);
      expect(data.birthday).toEqual(decodedData.birthday);
    });

    describe("error cases", () => {
      function expectDecodedTokenError(token, errorName) {
        try {
          decodedToken(token);
          throw new Error("Expected decodedToken to throw");
        } catch (error) {
          expect(error.name).toBe(errorName);
        }
      }

      it("should throw a TokenExpiredError for an expired token", () => {
        // given
        const data = { userId: 1, birthday: "01/01/1970", firstname: "firstname" };
        const expiredTimestamp = Math.floor(Date.now() / 1000) - 1;
        const token = jwt.sign({ ...data, exp: expiredTimestamp }, config.jwt.tokenSecret);

        // when & then
        expectDecodedTokenError(token, "TokenExpiredError");
      });

      it("should throw a JsonWebTokenError for malformed token", () => {
        // given
        const invalidToken = "invalid.token.here";

        // when & then
        expectDecodedTokenError(invalidToken, "JsonWebTokenError");
      });

      it("should throw a JsonWebTokenError for token signed with another secret", () => {
        // given
        const data = { userId: 1, birthday: "01/01/1970", firstname: "firstname" };
        const invalidSignatureToken = jwt.sign(data, "another-secret", { expiresIn: config.jwt.expirationTime });

        // when & then
        expectDecodedTokenError(invalidSignatureToken, "JsonWebTokenError");
      });

      it("should throw a JsonWebTokenError when token is empty", () => {
        // when & then
        expectDecodedTokenError("", "JsonWebTokenError");
      });

      it("should throw a JsonWebTokenError when token is null", () => {
        // when & then
        expectDecodedTokenError(null, "JsonWebTokenError");
      });

      it("should throw a JsonWebTokenError when token is undefined", () => {
        // when & then
        expectDecodedTokenError(undefined, "JsonWebTokenError");
      });
    });
  });
});
