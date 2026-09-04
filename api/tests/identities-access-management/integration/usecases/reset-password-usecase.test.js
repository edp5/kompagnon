import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import { InvalidOrExpiredPasswordResetTokenError } from "../../../../src/identities-access-management/errors.js";
import usecases from "../../../../src/identities-access-management/usecases/index.js";

describe("Integration | Identities Access Management | Usecases | Reset password usecase", () => {
  describe("success case", () => {
    it("should update user password and mark token as used when token is valid", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ password: "OldPassword123" });
      const resetToken = await databaseBuilder.factory.buildPasswordReset({
        userId: user.id,
        token: "valid-integration-token",
        expiresAt: new Date(Date.now() + 3600000),
      });

      // when
      const result = await usecases.resetPasswordUsecase({
        token: "valid-integration-token",
        password: "NewPassword456",
      });

      // then
      expect(result).toHaveProperty("message");

      const updatedToken = await knex("password_reset_tokens").where({ id: resetToken.id }).first();
      expect(updatedToken.usedAt).not.toBeNull();

      const authResult = await usecases.authenticateUserWithCredentialsUsecase({
        email: user.email,
        password: "NewPassword456",
      });
      expect(authResult.userId).toBe(user.id);
    });
  });

  describe("error cases", () => {
    it("should throw InvalidOrExpiredPasswordResetTokenError when token does not exist", async () => {
      // when & then
      await expect(
        usecases.resetPasswordUsecase({
          token: "non-existent-token",
          password: "NewPassword456",
        }),
      ).rejects.toThrow(InvalidOrExpiredPasswordResetTokenError);
    });

    it("should throw InvalidOrExpiredPasswordResetTokenError when token has expired", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      await databaseBuilder.factory.buildPasswordReset({
        userId: user.id,
        token: "expired-integration-token",
        expiresAt: new Date(Date.now() - 3600000),
      });

      // when & then
      await expect(
        usecases.resetPasswordUsecase({
          token: "expired-integration-token",
          password: "NewPassword456",
        }),
      ).rejects.toThrow(InvalidOrExpiredPasswordResetTokenError);
    });

    it("should throw InvalidOrExpiredPasswordResetTokenError when token has already been used", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      await databaseBuilder.factory.buildPasswordReset({
        userId: user.id,
        token: "already-used-integration-token",
        expiresAt: new Date(Date.now() + 3600000),
        usedAt: new Date(),
      });

      // when & then
      await expect(
        usecases.resetPasswordUsecase({
          token: "already-used-integration-token",
          password: "NewPassword456",
        }),
      ).rejects.toThrow(InvalidOrExpiredPasswordResetTokenError);
    });
  });
});
