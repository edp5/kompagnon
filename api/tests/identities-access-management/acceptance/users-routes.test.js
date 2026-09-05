import request from "supertest";
import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../db/database-builder/index.js";
import server from "../../../server.js";
import { generateAuthenticatedUser } from "../../helpers/generate-authenticated-user.js";

describe("Acceptance | Routes | Users routes", () => {
  describe("GET /api/users/profile", () => {
    it("should return 200 and user profile when token is valid", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({
        firstname: "Jane",
        lastname: "Doe",
        email: "jane.doe@example.com",
        birthday: "1990-05-15",
        isActive: true,
      });
      const token = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server)
        .get("/api/users/profile")
        .set("Authorization", token);

      // then
      expect(response.status).toBe(200);
      expect(response.body.data).toEqual({
        userId: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
        birthday: "1990-05-15",
        role: null,
        genre: null,
        disabilities: null,
        trustedContact: null,
      });
    });

    it("should return 401 when authorization header is missing", async () => {
      // when
      const response = await request(server).get("/api/users/profile");

      // then
      expect(response.status).toBe(401);
      expect(response.body).toEqual({ status: "error", message: "Authentication is required" });
    });
  });

  describe("PUT /api/users/trusted-contact", () => {
    it("should record the contact and give it back on the profile", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ isActive: true });
      const token = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server)
        .put("/api/users/trusted-contact")
        .set("Authorization", token)
        .send({ name: "Camille", phoneNumber: "0612345678" });

      // then
      expect(response.status).toBe(200);
      expect(response.body.data.trustedContact).toEqual({ name: "Camille", phoneNumber: "0612345678" });

      const profile = await request(server).get("/api/users/profile").set("Authorization", token);
      expect(profile.body.data.trustedContact).toEqual({ name: "Camille", phoneNumber: "0612345678" });
    });

    it("should let the user take the contact back", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ isActive: true });
      const token = generateAuthenticatedUser(user.id, user.userType);
      await request(server)
        .put("/api/users/trusted-contact")
        .set("Authorization", token)
        .send({ name: "Camille", phoneNumber: "0612345678" });

      // when
      const response = await request(server)
        .put("/api/users/trusted-contact")
        .set("Authorization", token)
        .send({ name: null, phoneNumber: null });

      // then
      expect(response.status).toBe(200);
      expect(response.body.data.trustedContact).toBeNull();

      const profile = await request(server).get("/api/users/profile").set("Authorization", token);
      expect(profile.body.data.trustedContact).toBeNull();
    });

    it("should refuse a number that is not a French mobile one", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ isActive: true });
      const token = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server)
        .put("/api/users/trusted-contact")
        .set("Authorization", token)
        .send({ name: "Camille", phoneNumber: "12345" });

      // then
      expect(response.status).toBe(400);
    });

    it("should refuse an unauthenticated call", async () => {
      // when
      const response = await request(server)
        .put("/api/users/trusted-contact")
        .send({ name: "Camille", phoneNumber: "0612345678" });

      // then
      expect(response.status).toBe(401);
    });
  });
});
