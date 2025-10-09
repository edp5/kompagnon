import request from "supertest";
import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import server from "../../../../server.js";
import { encodedToken } from "../../../../src/identities-access-management/services/token-service.js";

describe("Acceptance | Authentication | Routes | Activate User", () => {
  describe("GET /api/authentication/activate", () => {
    it("should activate user and return 201 when token is valid and user is inactive", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({
        email: "activate-test-1@example.com",
        isActive: false,
      });
      const token = encodedToken({ userId: user.id });

      // when
      const response = await request(server).get(`/api/authentication/activate?token=${token}`);

      // then
      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "User activated successfully" });
    });

    it("should return 400 when token is missing", async () => {
      // when
      const response = await request(server).get("/api/authentication/activate");

      // then
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Token is required" });
    });

    it("should return 400 when token is invalid", async () => {
      // given
      const invalidToken = "invalid.token.here";

      // when
      const response = await request(server).get(`/api/authentication/activate?token=${invalidToken}`);

      // then
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid or expired token" });
    });

    it("should return 401 when user does not exist", async () => {
      // given
      const token = encodedToken({ userId: 999999 });

      // when
      const response = await request(server).get(`/api/authentication/activate?token=${token}`);

      // then
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "User not found or already active" });
    });

    it("should return 401 when user is already active", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({
        email: "activate-test-already-active@example.com",
        isActive: true,
      });
      const token = encodedToken({ userId: user.id });

      // when
      const response = await request(server).get(`/api/authentication/activate?token=${token}`);

      // then
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ error: "User not found or already active" });
    });
  });
});

