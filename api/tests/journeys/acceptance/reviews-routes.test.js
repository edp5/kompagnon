import request from "supertest";
import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../db/database-builder/index.js";
import { knex } from "../../../db/knex-database-connection.js";
import server from "../../../server.js";
import { JOURNEY_STATUS } from "../../../src/shared/constants.js";
import { generateAuthenticatedUser } from "../../helpers/generate-authenticated-user.js";

describe("Acceptance | Journeys | Reviews routes", () => {
  describe("POST /api/journeys/found/:foundJourneyId/reviews", () => {
    it("should return 401 when token is missing", async () => {
      // when
      const response = await request(server)
        .post("/api/journeys/found/1/reviews")
        .send({ rating: 5 });

      // then
      expect(response.status).toBe(401);
    });

    it("should return 400 when rating is missing or invalid", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const auth = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server)
        .post("/api/journeys/found/1/reviews")
        .set("Authorization", auth)
        .send({ rating: 10 });

      // then
      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should return 404 when found journey does not exist", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const auth = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server)
        .post("/api/journeys/found/999999/reviews")
        .set("Authorization", auth)
        .send({ rating: 5, comment: "Super trajet !" });

      // then
      expect(response.status).toBe(404);
    });

    it("should return 400 when found journey is still waiting and not confirmed or completed", async () => {
      // given
      const companion = await databaseBuilder.factory.buildUser();
      const passenger = await databaseBuilder.factory.buildUser();
      const cj = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id });
      const pj = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id });
      const fj = await databaseBuilder.factory.buildFoundJourney({
        companionJourneyId: cj.id,
        passengerJourneyId: pj.id,
        companionStatus: JOURNEY_STATUS.WAITING,
        passengerStatus: JOURNEY_STATUS.WAITING,
      });
      const auth = generateAuthenticatedUser(companion.id, companion.userType);

      // when
      const response = await request(server)
        .post(`/api/journeys/found/${fj.id}/reviews`)
        .set("Authorization", auth)
        .send({ rating: 5 });

      // then
      expect(response.status).toBe(400);
    });

    it("should return 201 when found journey is confirmed (both accepted)", async () => {
      // given
      const companion = await databaseBuilder.factory.buildUser();
      const passenger = await databaseBuilder.factory.buildUser();
      const cj = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id });
      const pj = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id });
      const fj = await databaseBuilder.factory.buildFoundJourney({
        companionJourneyId: cj.id,
        passengerJourneyId: pj.id,
        companionStatus: JOURNEY_STATUS.ACCEPTED,
        passengerStatus: JOURNEY_STATUS.ACCEPTED,
      });
      const auth = generateAuthenticatedUser(companion.id, companion.userType);

      // when
      const response = await request(server)
        .post(`/api/journeys/found/${fj.id}/reviews`)
        .set("Authorization", auth)
        .send({ rating: 5, comment: "Superbe expérience !" });

      // then
      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject({
        foundJourneyId: Number(fj.id),
        authorId: Number(companion.id),
        targetUserId: Number(passenger.id),
        rating: 5,
        comment: "Superbe expérience !",
      });
    });

    it("should return 403 when authenticated user is not a participant of the journey", async () => {
      // given
      const companion = await databaseBuilder.factory.buildUser();
      const passenger = await databaseBuilder.factory.buildUser();
      const outsider = await databaseBuilder.factory.buildUser();
      const cj = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id });
      const pj = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id });
      const fj = await databaseBuilder.factory.buildFoundJourney({
        companionJourneyId: cj.id,
        passengerJourneyId: pj.id,
        companionStatus: JOURNEY_STATUS.COMPLETED,
        passengerStatus: JOURNEY_STATUS.COMPLETED,
      });
      const auth = generateAuthenticatedUser(outsider.id, outsider.userType);

      // when
      const response = await request(server)
        .post(`/api/journeys/found/${fj.id}/reviews`)
        .set("Authorization", auth)
        .send({ rating: 5 });

      // then
      expect(response.status).toBe(403);
    });

    it("should return 201 and create review targeting passenger when companion reviews", async () => {
      // given
      const companion = await databaseBuilder.factory.buildUser();
      const passenger = await databaseBuilder.factory.buildUser();
      const cj = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id });
      const pj = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id });
      const fj = await databaseBuilder.factory.buildFoundJourney({
        companionJourneyId: cj.id,
        passengerJourneyId: pj.id,
        companionStatus: JOURNEY_STATUS.COMPLETED,
        passengerStatus: JOURNEY_STATUS.COMPLETED,
      });
      const auth = generateAuthenticatedUser(companion.id, companion.userType);

      // when
      const response = await request(server)
        .post(`/api/journeys/found/${fj.id}/reviews`)
        .set("Authorization", auth)
        .send({ rating: 5, comment: "Passager très sympathique et ponctuel." });

      // then
      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject({
        foundJourneyId: Number(fj.id),
        authorId: Number(companion.id),
        targetUserId: Number(passenger.id),
        rating: 5,
        comment: "Passager très sympathique et ponctuel.",
      });

      const savedReview = await knex("reviews").where({ id: response.body.data.id }).first();
      expect(savedReview).toBeDefined();
      expect(savedReview.rating).toBe(5);
    });

    it("should return 409 when user attempts to submit a duplicate review", async () => {
      // given
      const companion = await databaseBuilder.factory.buildUser();
      const passenger = await databaseBuilder.factory.buildUser();
      const cj = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id });
      const pj = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id });
      const fj = await databaseBuilder.factory.buildFoundJourney({
        companionJourneyId: cj.id,
        passengerJourneyId: pj.id,
        companionStatus: JOURNEY_STATUS.COMPLETED,
        passengerStatus: JOURNEY_STATUS.COMPLETED,
      });
      const auth = generateAuthenticatedUser(companion.id, companion.userType);

      // submit first review
      await request(server)
        .post(`/api/journeys/found/${fj.id}/reviews`)
        .set("Authorization", auth)
        .send({ rating: 5 });

      // when (duplicate)
      const duplicateResponse = await request(server)
        .post(`/api/journeys/found/${fj.id}/reviews`)
        .set("Authorization", auth)
        .send({ rating: 4, comment: "Second avis" });

      // then
      expect(duplicateResponse.status).toBe(409);
    });
  });

  describe("GET /api/users/:userId/reviews", () => {
    it("should return 401 when token is missing", async () => {
      // when
      const response = await request(server).get("/api/users/1/reviews");

      // then
      expect(response.status).toBe(401);
    });

    it("should return 200 with review stats and reviews list when authenticated", async () => {
      // given
      const targetUser = await databaseBuilder.factory.buildUser({ firstname: "Target", lastname: "User" });
      const author = await databaseBuilder.factory.buildUser({ firstname: "Claire", lastname: "Dufour" });
      const cj = await databaseBuilder.factory.buildCompanionJourney({ userId: author.id });
      const pj = await databaseBuilder.factory.buildPassengerJourney({ userId: targetUser.id });
      const fj = await databaseBuilder.factory.buildFoundJourney({
        companionJourneyId: cj.id,
        passengerJourneyId: pj.id,
        companionStatus: JOURNEY_STATUS.COMPLETED,
        passengerStatus: JOURNEY_STATUS.COMPLETED,
      });
      const auth = generateAuthenticatedUser(targetUser.id, targetUser.userType);

      await knex("reviews").insert({
        foundJourneyId: fj.id,
        authorId: author.id,
        targetUserId: targetUser.id,
        rating: 5,
        comment: "Excellent accompagnement, très rassurant !",
      });

      // when
      const response = await request(server)
        .get(`/api/users/${targetUser.id}/reviews`)
        .set("Authorization", auth);

      // then
      expect(response.status).toBe(200);
      expect(response.body.data.averageRating).toBe(5);
      expect(response.body.data.reviewCount).toBe(1);
      expect(response.body.data.reviews).toHaveLength(1);
      expect(response.body.data.reviews[0]).toMatchObject({
        rating: 5,
        comment: "Excellent accompagnement, très rassurant !",
        authorFirstname: "Claire",
        authorLastname: "Dufour",
      });
    });

    it("should return 200 with empty list and 0 rating when user has no reviews", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const auth = generateAuthenticatedUser(user.id, user.userType);

      // when
      const response = await request(server)
        .get(`/api/users/${user.id}/reviews`)
        .set("Authorization", auth);

      // then
      expect(response.status).toBe(200);
      expect(response.body.data.averageRating).toBe(0);
      expect(response.body.data.reviewCount).toBe(0);
      expect(response.body.data.reviews).toEqual([]);
    });
  });
});
