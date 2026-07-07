import request from "supertest";
import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../db/database-builder/index.js";
import { knex } from "../../../db/knex-database-connection.js";
import server from "../../../server.js";
import { encodedToken } from "../../../src/identities-access-management/services/token-service.js";
import { generateAuthenticatedUser } from "../../helpers/generate-authenticated-user.js";

describe("Acceptance | Identities Access Management | Routes | Authentication routes", () => {
  describe("POST /api/authentication/register", () => {
    it("should return 201 http code status and create user", async () => {
      // given
      const body = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.net",
        password: "password",
        birthday: "01/01/2001",
      };

      // when
      const response = await request(server).post("/api/authentication/register").send(body);

      // then
      expect(response.status).toBe(201);
      const user = await knex("users").where({ email: body.email }).first();
      expect(user).toBeDefined();
    });

    it("should return 400 if object validation failed", async () => {
      // given
      const body = { firstname: "toto" };

      // when
      const response = await request(server).post("/api/authentication/register").send(body);

      // then
      expect(response.status).toBe(400);
    });
  });

  describe("POST /api/authentication/authenticate", () => {
    it("should return 200 http status code", async () => {
      // given
      const createdUser = await databaseBuilder.factory.buildUser({ email: "test@example.net", isActive: true });
      const body = { email: "test@example.net", password: "kompagnon123" };

      // when
      const response = await request(server).post("/api/authentication/authenticate").send(body);

      // then
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.userId).toEqual(createdUser.id);
    });

    it("should return 400 if schema is not ok", async () => {
      // given
      const body = { email: "test", password: "password" };

      // when
      const response = await request(server).post("/api/authentication/authenticate").send(body);

      // then
      expect(response.status).toBe(400);
    });
  });

  describe("GET /api/authentication/activate", () => {
    it("should activate user and return 201 when token is valid and user is inactive", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({
        email: "activate-test-1@example.com",
        isActive: false,
      });
      const token = encodedToken({ userId: user.id });

      // when
      const response = await request(server).get("/api/authentication/activate").set("authorization", `Bearer ${token}`);

      // then
      expect(response.status).toBe(201);
    });

    it("should return 400 when token is missing", async () => {
      // when
      const response = await request(server).get("/api/authentication/activate");

      // then
      expect(response.status).toBe(400);
    });

    it("should return 404 when user does not exist", async () => {
      // given
      const token = encodedToken({ userId: 999999 });

      // when
      const response = await request(server).get("/api/authentication/activate").set("authorization", `Bearer ${token}`);

      // then
      expect(response.status).toBe(404);
    });

    it("should return 409 when user is already active", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({
        email: "activate-test-already-active@example.com",
        isActive: true,
      });
      const token = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server).get("/api/authentication/activate").set("authorization", token);

      // then
      expect(response.status).toBe(409);
    });
  });
});
