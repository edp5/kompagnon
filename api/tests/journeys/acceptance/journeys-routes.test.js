import request from "supertest";
import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../db/database-builder/index.js";
import { knex } from "../../../db/knex-database-connection.js";
import server from "../../../server.js";
import { JOURNEY_STATUS, USER_ROLE } from "../../../src/shared/constants.js";
import { generateAuthenticatedUser } from "../../helpers/generate-authenticated-user.js";

describe("Acceptance | Journeys | Journey routes", () => {
  describe("POST /journeys", () => {
    describe("invalid user", () => {
      it("should return 201 http status code", async () => {
        // given
        const user = await databaseBuilder.factory.buildUser({ role: USER_ROLE.INVALID });
        const body = {
          departureTime: new Date("2024-06-01T10:00:00Z"),
          arrivalTime: new Date("2024-06-01T11:00:00Z"),
          departureAddress: "5 avenue des martirs 7502",
          arrivalAddress: "18 rue Pasteur 75015",
          departureLat: "0.0",
          departureLon: "0.0",
          arrivalLon: "0.0",
          arrivalLat: "0.0",
        };
        const auth = generateAuthenticatedUser(user.id, user.userType);

        // when
        const response = await request(server).post("/api/journeys").send(body).set("Authorization", auth);

        // then
        expect(response.status).toBe(201);
        const recordedJourney = await knex("passenger_journeys").where({ id: response.body.data.journeyId }).first();
        expect(recordedJourney).toBeDefined();
      });
    });

    describe("valid user", () => {
      it("should return 201 http status code", async () => {
        // given
        const user = await databaseBuilder.factory.buildUser({ role: USER_ROLE.VALID });
        const body = {
          departureTime: new Date("2024-06-01T10:00:00Z"),
          arrivalTime: new Date("2024-06-01T11:00:00Z"),
          departureAddress: "5 avenue des martirs 7502",
          arrivalAddress: "18 rue Pasteur 75015",
          departureLat: "0.0",
          departureLon: "0.0",
          arrivalLon: "0.0",
          arrivalLat: "0.0",
        };
        const auth = generateAuthenticatedUser(user.id, user.userType);

        // when
        const response = await request(server).post("/api/journeys").send(body).set("Authorization", auth);

        // then
        expect(response.status).toBe(201);
        const recordedJourney = await knex("companion_journeys").where({ id: response.body.data.journeyId }).first();
        expect(recordedJourney).toBeDefined();
      });
    });

    describe("user without role", () => {
      it("should return 400 http status code", async () => {
        // given
        const user = await databaseBuilder.factory.buildUser();
        const body = {
          departureTime: new Date("2024-06-01T10:00:00Z"),
          arrivalTime: new Date("2024-06-01T11:00:00Z"),
          departureAddress: "5 avenue des martirs 7502",
          arrivalAddress: "18 rue Pasteur 75015",
          departureLat: "0.0",
          departureLon: "0.0",
          arrivalLon: "0.0",
          arrivalLat: "0.0",
        };
        const auth = generateAuthenticatedUser(user.id, user.userType);

        // when
        const response = await request(server).post("/api/journeys").send(body).set("Authorization", auth);

        // then
        expect(response.status).toBe(400);
      });
    });

    describe("body check", () => {
      it("should return 400 http status code if one body field is not present", async () => {
        // given
        const user = await databaseBuilder.factory.buildUser({ role: USER_ROLE.INVALID });
        const body = {
          departureTime: new Date("2024-06-01T10:00:00Z"),
          arrivalTime: new Date("2024-06-01T11:00:00Z"),
          departureAddress: "5 avenue des martirs 7502",
          arrivalAddress: "18 rue Pasteur 75015",
          departureLat: "0.0",
          departureLon: "0.0",
          arrivalLon: "0.0",
        };
        const auth = generateAuthenticatedUser(user.id, user.userType);

        // when
        const response = await request(server).post("/api/journeys").send(body).set("Authorization", auth);

        // then
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("Validation failed");
      });

      it("should return 400 http status code if one body field has an incorrect format", async () => {
        // given
        const user = await databaseBuilder.factory.buildUser({ role: USER_ROLE.INVALID });
        const body = {
          departureTime: new Date("2024-06-01T10:00:00Z"),
          arrivalTime: new Date("2024-06-01T11:00:00Z"),
          departureAddress: "5 avenue des martirs 7502",
          arrivalAddress: "18 rue Pasteur 75015",
          departureLat: "not-a-coordinate",
          departureLon: "0.0",
          arrivalLon: "0.0",
          arrivalLat: "0.0",
        };
        const auth = generateAuthenticatedUser(user.id, user.userType);

        // when
        const response = await request(server).post("/api/journeys").send(body).set("Authorization", auth);

        // then
        expect(response.status).toBe(400);
        expect(response.body.message).toEqual("Validation failed");
      });
    });
  });

  describe("GET /journeys/:journeyId", () => {
    it("should return 200 and the journey for its owner (passenger)", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ role: USER_ROLE.INVALID });
      const journey = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });
      const auth = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server).get(`/api/journeys/${journey.id}`).set("Authorization", auth);

      // then
      expect(response.status).toBe(200);
      expect(Number(response.body.data.id)).toBe(Number(journey.id));
    });

    it("should return 200 and the journey for its owner (companion)", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ role: USER_ROLE.VALID });
      const journey = await databaseBuilder.factory.buildCompanionJourney({ userId: user.id });
      const auth = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server).get(`/api/journeys/${journey.id}`).set("Authorization", auth);

      // then
      expect(response.status).toBe(200);
      expect(Number(response.body.data.id)).toBe(Number(journey.id));
    });

    it("should return 404 when the journey belongs to another user", async () => {
      // given
      const owner = await databaseBuilder.factory.buildUser({
        role: USER_ROLE.INVALID,
        email: `owner-${crypto.randomUUID()}@example.net`,
      });
      const otherUser = await databaseBuilder.factory.buildUser({
        role: USER_ROLE.INVALID,
        email: `other-${crypto.randomUUID()}@example.net`,
      });
      const journey = await databaseBuilder.factory.buildPassengerJourney({ userId: owner.id });
      const auth = generateAuthenticatedUser(otherUser.id, otherUser.userType);

      // when
      const response = await request(server).get(`/api/journeys/${journey.id}`).set("Authorization", auth);

      // then
      expect(response.status).toBe(404);
    });

    it("should return 404 when the journey does not exist", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser({ role: USER_ROLE.INVALID });
      const auth = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server).get("/api/journeys/9999999").set("Authorization", auth);

      // then
      expect(response.status).toBe(404);
    });

    it("should return 401 without authentication", async () => {
      // when
      const response = await request(server).get("/api/journeys/1");

      // then
      expect(response.status).toBe(401);
    });
  });
  describe("PUT /journeys/found/:id", () => {
    describe("valid users", () => {
      describe("success cases", () => {
        it("should return http 201 status code if user accepts journey", async () => {
          // given
          const validUser = await databaseBuilder.factory.buildUser({ role: USER_ROLE.VALID });
          const validJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: validUser.id });

          const foundJourney = await databaseBuilder.factory.buildFoundJourney({ companionJourneyId: validJourney.id });
          const authorization = generateAuthenticatedUser(validUser.id, validUser.userType);

          const body = { updatedStatus: true };

          // when
          const response = await request(server).put(`/api/journeys/found/${foundJourney.id}`).set("Authorization", authorization).send(body);

          // then
          expect(response.status).toBe(201);
          const updatedFoundJourney = await knex("found_journeys").where({ id: foundJourney.id }).first();
          expect(updatedFoundJourney.companionStatus).toBe(JOURNEY_STATUS.ACCEPTED);
        });

        it("should return http 201 status code if user refuses journey", async () => {
          // given
          const validUser = await databaseBuilder.factory.buildUser({ role: USER_ROLE.VALID });
          const validJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: validUser.id });

          const foundJourney = await databaseBuilder.factory.buildFoundJourney({ companionJourneyId: validJourney.id });
          const authorization = generateAuthenticatedUser(validUser.id, validUser.userType);

          const body = { updatedStatus: false };

          // when
          const response = await request(server).put(`/api/journeys/found/${foundJourney.id}`).set("Authorization", authorization).send(body);

          // then
          expect(response.status).toBe(201);
          const updatedFoundJourney = await knex("found_journeys").where({ id: foundJourney.id }).first();
          expect(updatedFoundJourney.companionStatus).toBe(JOURNEY_STATUS.REJECTED);
        });
      });

      describe("error cases", () => {
        it("should throw an error if foundJourneyId param is not a number", async () => {
          // given
          const user = await databaseBuilder.factory.buildUser({ role: USER_ROLE.VALID });
          const journey = await databaseBuilder.factory.buildCompanionJourney({ userId: user.id });
          await databaseBuilder.factory.buildFoundJourney({ companionJourneyId: journey.id });
          const authorization = generateAuthenticatedUser(user.id, user.userType);
          const body = { updatedStatus: true };

          // when
          const response = await request(server).put("/api/journeys/found/foundJourneyId").send(body).set("Authorization", authorization);

          // then
          expect(response.status).toEqual(400);
          expect(response.body.message).toBe("Validation failed");
        });

        it("should throw an error if updatedStatus is not a boolean", async () => {
          // given
          const user = await databaseBuilder.factory.buildUser({ role: USER_ROLE.VALID });
          const journey = await databaseBuilder.factory.buildCompanionJourney({ userId: user.id });
          const foundJourney = await databaseBuilder.factory.buildFoundJourney({ companionJourneyId: journey.id });
          const authorization = generateAuthenticatedUser(user.id, user.userType);
          const body = { updatedStatus: "test" };

          // when
          const response = await request(server).put(`/api/journeys/found/${foundJourney.id}`).send(body).set("Authorization", authorization);

          // then
          expect(response.status).toEqual(400);
          expect(response.body.message).toBe("Validation failed");
        });
      });
    });

    describe("invalid users", () => {
      describe("success cases", () => {
        it("should return http 201 status code if user accepts journey", async () => {
          // given
          const invalidUser = await databaseBuilder.factory.buildUser({ role: USER_ROLE.INVALID });
          const invalidJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: invalidUser.id });

          const foundJourney = await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: invalidJourney.id });
          const authorization = generateAuthenticatedUser(invalidUser.id, invalidUser.userType);

          const body = { updatedStatus: true };

          // when
          const response = await request(server).put(`/api/journeys/found/${foundJourney.id}`).set("Authorization", authorization).send(body);

          // then
          expect(response.status).toBe(201);
          const updatedFoundJourney = await knex("found_journeys").where({ id: foundJourney.id }).first();
          expect(updatedFoundJourney.passengerStatus).toBe(JOURNEY_STATUS.ACCEPTED);
        });

        it("should return http 201 status code if user refuses journey", async () => {
          // given
          const invalidUser = await databaseBuilder.factory.buildUser({ role: USER_ROLE.INVALID });
          const invalidJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: invalidUser.id });

          const foundJourney = await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: invalidJourney.id });
          const authorization = generateAuthenticatedUser(invalidUser.id, invalidUser.userType);

          const body = { updatedStatus: false };

          // when
          const response = await request(server).put(`/api/journeys/found/${foundJourney.id}`).set("Authorization", authorization).send(body);

          // then
          expect(response.status).toBe(201);
          const updatedFoundJourney = await knex("found_journeys").where({ id: foundJourney.id }).first();
          expect(updatedFoundJourney.passengerStatus).toBe(JOURNEY_STATUS.REJECTED);
        });
      });

      describe("error cases", () => {
        it("should throw an error if foundJourneyId param is not a number", async () => {
          // given
          const user = await databaseBuilder.factory.buildUser({ role: USER_ROLE.INVALID });
          const journey = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });
          await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: journey.id });
          const authorization = generateAuthenticatedUser(user.id, user.userType);
          const body = { updatedStatus: true };

          // when
          const response = await request(server).put("/api/journeys/found/foundJourneyId").send(body).set("Authorization", authorization);

          // then
          expect(response.status).toEqual(400);
          expect(response.body.message).toBe("Validation failed");
        });

        it("should throw an error if updatedStatus is not a boolean", async () => {
          // given
          const user = await databaseBuilder.factory.buildUser({ role: USER_ROLE.INVALID });
          const journey = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });
          const foundJourney = await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: journey.id });
          const authorization = generateAuthenticatedUser(user.id, user.userType);
          const body = { updatedStatus: "test" };

          // when
          const response = await request(server).put(`/api/journeys/found/${foundJourney.id}`).send(body).set("Authorization", authorization);

          // then
          expect(response.status).toEqual(400);
          expect(response.body.message).toBe("Validation failed");
        });
      });
    });

    describe("general cases", () => {
      it("should return 401 error if token is missing", async () => {
        // when
        const response = await request(server).put("/api/journeys/found/123");

        // then
        expect(response.status).toBe(401);
      });
    });
  });
});
