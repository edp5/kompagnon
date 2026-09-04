import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { knex } from "../../../../db/knex-database-connection.js";
import * as resetTokenRepository from "../../../../src/identities-access-management/repositories/password-reset-token-repository.js";

describe("Integration | Identities Access Management | Repositories | Password reset token repository", () => {
  describe("#createPasswordResetToken", () => {
    it("should insert a password reset token into the database", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const token = "secure-random-token-1";
      const expiresAt = new Date(Date.now() + 3600 * 1000);

      // when
      const tokenId = await resetTokenRepository.createPasswordResetToken({
        userId: user.id,
        token,
        expiresAt,
      });

      // then
      expect(tokenId).toBeDefined();
      const saved = await knex("password_reset_tokens").where({ id: tokenId }).first();
      expect(saved).toBeDefined();
      expect(saved.userId).toBe(user.id);
      expect(saved.token).toBe(resetTokenRepository.hashResetToken(token));
      expect(saved.usedAt).toBeNull();
    });
  });

  describe("#findValidPasswordResetToken", () => {
    it("should return the token when it exists, is not used, and not expired", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const token = "valid-token-lookup";
      const expiresAt = new Date(Date.now() + 3600 * 1000);
      await resetTokenRepository.createPasswordResetToken({
        userId: user.id,
        token,
        expiresAt,
      });

      // when
      const found = await resetTokenRepository.findValidPasswordResetToken(token);

      // then
      expect(found).toBeDefined();
      expect(found.userId).toBe(user.id);
      expect(found.token).toBe(resetTokenRepository.hashResetToken(token));
    });

    it("should return null when the token has already been used", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const token = "already-used-token";
      const expiresAt = new Date(Date.now() + 3600 * 1000);
      const tokenId = await resetTokenRepository.createPasswordResetToken({
        userId: user.id,
        token,
        expiresAt,
      });
      await resetTokenRepository.markPasswordResetTokenAsUsed(tokenId);

      // when
      const found = await resetTokenRepository.findValidPasswordResetToken(token);

      // then
      expect(found).toBeNull();
    });

    it("should return null when the token has expired", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const token = "expired-token";
      const expiresAt = new Date(Date.now() - 3600 * 1000); // 1 hour ago
      await resetTokenRepository.createPasswordResetToken({
        userId: user.id,
        token,
        expiresAt,
      });

      // when
      const found = await resetTokenRepository.findValidPasswordResetToken(token);

      // then
      expect(found).toBeNull();
    });

    it("should return null for non-existent token", async () => {
      // when
      const found = await resetTokenRepository.findValidPasswordResetToken("non-existent-token");

      // then
      expect(found).toBeNull();
    });
  });

  describe("#markPasswordResetTokenAsUsed", () => {
    it("should update usedAt timestamp", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const token = "token-to-mark-used";
      const expiresAt = new Date(Date.now() + 3600 * 1000);
      const tokenId = await resetTokenRepository.createPasswordResetToken({
        userId: user.id,
        token,
        expiresAt,
      });

      // when
      await resetTokenRepository.markPasswordResetTokenAsUsed(tokenId);

      // then
      const updated = await knex("password_reset_tokens").where({ id: tokenId }).first();
      expect(updated.usedAt).not.toBeNull();
    });
  });

  describe("#findPasswordResetTokenByToken", () => {
    it("should find token even if used or expired", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const token = "used-token-to-find";
      const expiresAt = new Date(Date.now() - 3600 * 1000);
      const tokenId = await resetTokenRepository.createPasswordResetToken({
        userId: user.id,
        token,
        expiresAt,
      });
      await resetTokenRepository.markPasswordResetTokenAsUsed(tokenId);

      // when
      const found = await resetTokenRepository.findPasswordResetTokenByToken(token);

      // then
      expect(found).toBeDefined();
      expect(found.id).toBe(tokenId);
    });
  });
});
