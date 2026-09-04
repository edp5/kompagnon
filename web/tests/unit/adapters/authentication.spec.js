import { afterEach, describe, expect, it, vi } from "vitest";

import {
  activateAccount,
  loginUser,
  registerNewUser,
  requestPasswordReset,
  submitPasswordReset,
} from "@/adapters/authentication.js";

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

  describe("#loginUser", () => {
    const payload = {
      email: "john.doe@example.com",
      password: "password123",
    };

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should call the login endpoint with provided payload and return token and userId on success", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ data: { token: "jwt-token", userId: 1 } }),
      });

      // when
      const result = await loginUser(payload);

      // then
      expect(result).toEqual({ success: true, token: "jwt-token", userId: 1 });
      expect(fetchSpy).toHaveBeenCalledWith("/api/authentication/authenticate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
    });

    it("should return a specific failure message if response status is 401", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 401,
      });

      // when
      const result = await loginUser(payload);

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Identifiants incorrects.");
    });

    it("should return a general failure message if response is not ok and status is not 401", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 500,
      });

      // when
      const result = await loginUser(payload);

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Échec de la connexion. Veuillez réessayer.");
    });

    it("should handle network errors gracefully", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await loginUser(payload);

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });

  describe("#activateAccount", () => {
    it("should call the activation endpoint with the token, phone number and role", async () => {
      // given
      const token = "test-activation-token";
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({ status: 201 });

      // when
      const result = await activateAccount({ token, phoneNumber: "0612345678", role: "passenger" });

      // then
      expect(result).toEqual({ success: true, message: "Compte activé avec succès !" });
      expect(fetchSpy).toHaveBeenCalledWith("/api/authentication/activate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer test-activation-token",
        },
        body: JSON.stringify({ phoneNumber: "0612345678", role: "passenger" }),
      });
    });

    it("should return a specific failure message if response status is 400 (invalid phone or expired link)", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        status: 400,
      });

      // when
      const result = await activateAccount({ token: "some-token", phoneNumber: "bad" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Numéro de téléphone invalide ou lien d'activation expiré.");
    });

    it("should return a specific failure message if response status is 404 (user not found)", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        status: 404,
      });

      // when
      const result = await activateAccount({ token: "some-token", phoneNumber: "0612345678" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Utilisateur introuvable.");
    });

    it("should return a specific failure message if response status is 409 (account already active)", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        status: 409,
      });

      // when
      const result = await activateAccount({ token: "some-token", phoneNumber: "0612345678" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Ce compte est déjà activé.");
    });

    it("should return a general failure message if response is not ok and status is not handled", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        status: 500,
      });

      // when
      const result = await activateAccount({ token: "some-token", phoneNumber: "0612345678" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Échec de l'activation. Veuillez réessayer.");
    });

    it("should handle network errors gracefully", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await activateAccount({ token: "some-token", phoneNumber: "0612345678" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });

  describe("#requestPasswordReset", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should call forgot-password endpoint and return success with message", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ data: { message: "Email sent" } }),
      });

      // when
      const result = await requestPasswordReset({ email: "john@example.com" });

      // then
      expect(result).toEqual({ success: true, message: "Email sent" });
      expect(fetchSpy).toHaveBeenCalledWith("/api/authentication/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: "john@example.com" }),
      });
    });

    it("should return failure when response is not ok", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({ ok: false });

      // when
      const result = await requestPasswordReset({ email: "bad-request" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Échec de la demande de réinitialisation. Veuillez réessayer.");
    });

    it("should handle network error", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await requestPasswordReset({ email: "john@example.com" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });

  describe("#submitPasswordReset", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should call reset-password endpoint with token and new password", async () => {
      // given
      const fetchSpy = vi.spyOn(global, "fetch").mockResolvedValue({
        ok: true,
        json: async () => ({ data: { message: "Password updated" } }),
      });

      // when
      const result = await submitPasswordReset({ token: "token-123", password: "newPassword" });

      // then
      expect(result).toEqual({ success: true, message: "Password updated" });
      expect(fetchSpy).toHaveBeenCalledWith("/api/authentication/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: "token-123", password: "newPassword" }),
      });
    });

    it("should return specific message when status is 400 (invalid or expired token)", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 400,
      });

      // when
      const result = await submitPasswordReset({ token: "expired-token", password: "newPassword" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Le lien de réinitialisation est invalide ou a expiré.");
    });

    it("should return general error message for other error statuses", async () => {
      // given
      vi.spyOn(global, "fetch").mockResolvedValue({
        ok: false,
        status: 500,
      });

      // when
      const result = await submitPasswordReset({ token: "token-123", password: "newPassword" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Échec de la réinitialisation du mot de passe. Veuillez réessayer.");
    });

    it("should handle network error", async () => {
      // given
      vi.spyOn(global, "fetch").mockRejectedValue(new Error("Network error"));

      // when
      const result = await submitPasswordReset({ token: "token-123", password: "newPassword" });

      // then
      expect(result.success).toBe(false);
      expect(result.message).toBe("Impossible de joindre le serveur. Veuillez réessayer plus tard.");
    });
  });
});

