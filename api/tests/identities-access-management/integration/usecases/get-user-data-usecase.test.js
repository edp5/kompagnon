import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { UserNotFoundError } from "../../../../src/identities-access-management/errors.js";
import usecases from "../../../../src/identities-access-management/usecases/index.js";
import { USER_GENRES, USER_ROLE } from "../../../../src/shared/constants.js";

describe("Integration | Identities Access Management | Usecases | Get user data usecase", () => {
  describe("success case", () => {
    it("should return some data of user", async () => {
      // given
      const userData = { email: "test@example.net", role: USER_ROLE.VALID, genre: USER_GENRES.F, firstname: "Jeanne", lastname: "Galbon", birthday: "1990-01-01" };
      const user = await databaseBuilder.factory.buildUser(userData);

      // when
      const result = await usecases.getUserDataUsecase(user.id);

      // then
      Object.keys(userData).map((data) => {
        expect(userData[data]).toBe(result[data]);
      });
      expect(user.id).toBe(result.userId);
    });
  });

  describe("error case", () => {
    it("should throw a user not found error", async () => {
      // when
      const result = usecases.getUserDataUsecase(123);

      // then
      await expect(result).rejects.toThrow(UserNotFoundError);
    });
  });
});
