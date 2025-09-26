import jwt from "jsonwebtoken";
import { describe, expect, it, vi } from "vitest";

import { config } from "../../../../config.js";
import ERRORS from "../../../../src/identities-access-management/errors.js";
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

    it("should throw an error if an error occurred", () => {
      // given
      vi.spyOn(jwt, "sign").mockImplementation(() => { throw new Error("Signing error"); });
      // when & then
      expect(() => encodedToken({ userId: 1 })).toThrow("Signing error");
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
      it(`should throw an ${ERRORS.TOKEN.EXPIRED_TOKEN}`, () => {
        // given
        const data = { userId: 1, birthday: "01/01/1970", firstname: "firstname" };
        // Set expiration to 1 second in the past
        const expiredTimestamp = Math.floor(Date.now() / 1000) - 1;
        const token = jwt.sign({ ...data, exp: expiredTimestamp }, config.jwt.tokenSecret);

        // when & then
        expect(() => decodedToken(token)).toThrow(ERRORS.TOKEN.EXPIRED_TOKEN);
      });

      it(`should throw an ${ERRORS.TOKEN.INVALID_TOKEN}`, () => {
        // given
        const invalidToken = "invalid.token.here";

        // when & then
        expect(() => decodedToken(invalidToken)).toThrow(ERRORS.TOKEN.INVALID_TOKEN);
      });

      it(`should throw an ${ERRORS.TOKEN.INVALID_TOKEN} for malformed token`, () => {
        // given
        const malformedToken = "malformed-token-without-dots";

        // when & then
        expect(() => decodedToken(malformedToken)).toThrow(ERRORS.TOKEN.INVALID_TOKEN);
      });

      it(`should throw an ${ERRORS.TOKEN.INVALID_TOKEN} for token with wrong signature`, () => {
        // given
        const data = { userId: 1, firstname: "test" };
        const tokenWithWrongSecret = jwt.sign(data, "wrong-secret", { expiresIn: "1h" });

        // when & then
        expect(() => decodedToken(tokenWithWrongSecret)).toThrow(ERRORS.TOKEN.INVALID_TOKEN);
      });

      it(`should throw an ${ERRORS.TOKEN.VERIFICATION_FAILED} for generic error`, () => {
        // given
        const originalVerify = jwt.verify;
        jwt.verify = vi.fn(() => {
          const error = new Error("Generic error");
          error.name = "GenericError";
          throw error;
        });

        // when & then
        expect(() => decodedToken("any-token")).toThrow(ERRORS.TOKEN.VERIFICATION_FAILED);

        // cleanup
        jwt.verify = originalVerify;
      });
    });
  });
});
