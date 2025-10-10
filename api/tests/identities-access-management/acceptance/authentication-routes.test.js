import request from "supertest";
import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../db/database-builder/index.js";
import { knex } from "../../../db/knex-database-connection.js";
import server from "../../../server.js";
import { DEFAULT_USER_TYPE } from "../../../src/shared/constants.js";

describe("Acceptance | Identities Access Management | Routes | Authentication routes", () => {
  describe("POST /api/authentication/register", () => {
    it("should return 201 http code status and create user", async () => {
      // given
      const body = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.net",
        password: "password",
        userType: DEFAULT_USER_TYPE,
        birthday: "01/01/2001",
      };

      // when
      const response = await request(server).post("/api/authentication/register").send(body);

      // then
      expect(response.status).toBe(201);
      const user = await knex("users").where({ email: body.email }).first();
      expect(user).toBeDefined();
    });

    it("should return 500 if object validation failed", async () => {
      // given
      const body = { firstname: "toto" };

      // when
      const response = await request(server).post("/api/authentication/register").send(body);

      // then
      expect(response.status).toBe(500);
    });

    it("should return 500 if user type does not exists", async () => {
      // given
      const body = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.net",
        password: "password",
        userType: "useeeeer",
        birthday: "01/01/2001",
      };

      // when
      const response = await request(server).post("/api/authentication/register").send(body);

      // then
      expect(response.status).toBe(500);
    });
  });

  describe("POST /api/authentication/authenticate", () => {
    it("should return 200 http status code", async () => {
      // given
      const createdUser = await databaseBuilder.factory.buildUser({ email: "test@example.net", isActive: true });
      const body = { email: "test@example.net", password: "password" };

      // when
      const response = await request(server).post("/api/authentication/authenticate").send(body);

      // then
      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty("token");
      expect(response.body.data.userId).toEqual(createdUser.id);
    });

    it("should return 500 if schema is not ok", async () => {
      // given
      const body = { email: "test", password: "password" };

      // when
      const response = await request(server).post("/api/authentication/authenticate").send(body);

      // then
      expect(response.status).toBe(500);
    });
  });
});
