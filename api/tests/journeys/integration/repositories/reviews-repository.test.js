import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import * as reviewsRepository from "../../../../src/journeys/repositories/reviews-repository.js";
import { JOURNEY_STATUS } from "../../../../src/shared/constants.js";

describe("Integration | Journeys | Repositories | Reviews repository", () => {
  describe("#saveReview and #findReviewsByUserId", () => {
    it("should insert a review and retrieve it with author details", async () => {
      // given
      const author = await databaseBuilder.factory.buildUser({ firstname: "Alice", lastname: "Smith" });
      const targetUser = await databaseBuilder.factory.buildUser({ firstname: "Bob", lastname: "Jones" });
      const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: author.id });
      const companionJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: targetUser.id });
      const foundJourney = await databaseBuilder.factory.buildFoundJourney({
        passengerJourneyId: passengerJourney.id,
        companionJourneyId: companionJourney.id,
        passengerStatus: JOURNEY_STATUS.COMPLETED,
        companionStatus: JOURNEY_STATUS.COMPLETED,
      });

      // when
      const savedReview = await reviewsRepository.saveReview({
        foundJourneyId: foundJourney.id,
        authorId: author.id,
        targetUserId: targetUser.id,
        rating: 5,
        comment: "Excellent voyage !",
      });

      // then
      expect(savedReview).toBeDefined();
      expect(savedReview.rating).toBe(5);
      expect(savedReview.comment).toBe("Excellent voyage !");

      const reviews = await reviewsRepository.findReviewsByUserId(targetUser.id);
      expect(reviews).toHaveLength(1);
      expect(reviews[0].authorFirstname).toBe("Alice");
      expect(reviews[0].authorLastname).toBe("Smith");
      expect(reviews[0].rating).toBe(5);
      expect(reviews[0].comment).toBe("Excellent voyage !");
    });
  });

  describe("#getAverageRatingAndCountByUserId", () => {
    it("should return correct count and rounded average rating", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();
      const author1 = await databaseBuilder.factory.buildUser();
      const author2 = await databaseBuilder.factory.buildUser();

      const pj1 = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });
      const cj1 = await databaseBuilder.factory.buildCompanionJourney({ userId: author1.id });
      const fj1 = await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: pj1.id, companionJourneyId: cj1.id });

      const pj2 = await databaseBuilder.factory.buildPassengerJourney({ userId: user.id });
      const cj2 = await databaseBuilder.factory.buildCompanionJourney({ userId: author2.id });
      const fj2 = await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: pj2.id, companionJourneyId: cj2.id });

      await reviewsRepository.saveReview({
        foundJourneyId: fj1.id,
        authorId: author1.id,
        targetUserId: user.id,
        rating: 4,
      });
      await reviewsRepository.saveReview({
        foundJourneyId: fj2.id,
        authorId: author2.id,
        targetUserId: user.id,
        rating: 5,
      });

      // when
      const stats = await reviewsRepository.getAverageRatingAndCountByUserId(user.id);

      // then
      expect(stats.reviewCount).toBe(2);
      expect(stats.averageRating).toBe(4.5);
    });

    it("should return 0 count and 0 rating when user has no reviews", async () => {
      // given
      const user = await databaseBuilder.factory.buildUser();

      // when
      const stats = await reviewsRepository.getAverageRatingAndCountByUserId(user.id);

      // then
      expect(stats.reviewCount).toBe(0);
      expect(stats.averageRating).toBe(0);
    });
  });

  describe("#hasUserReviewedFoundJourney", () => {
    it("should return true when review exists and false when it does not", async () => {
      // given
      const author = await databaseBuilder.factory.buildUser();
      const targetUser = await databaseBuilder.factory.buildUser();
      const pj = await databaseBuilder.factory.buildPassengerJourney({ userId: author.id });
      const cj = await databaseBuilder.factory.buildCompanionJourney({ userId: targetUser.id });
      const fj = await databaseBuilder.factory.buildFoundJourney({ passengerJourneyId: pj.id, companionJourneyId: cj.id });

      // before save
      const before = await reviewsRepository.hasUserReviewedFoundJourney({ foundJourneyId: fj.id, authorId: author.id });
      expect(before).toBe(false);

      // after save
      await reviewsRepository.saveReview({
        foundJourneyId: fj.id,
        authorId: author.id,
        targetUserId: targetUser.id,
        rating: 5,
      });

      const after = await reviewsRepository.hasUserReviewedFoundJourney({ foundJourneyId: fj.id, authorId: author.id });
      expect(after).toBe(true);
    });
  });

  describe("#findFoundJourneyWithParticipants", () => {
    it("should return found journey with companion and passenger user ids", async () => {
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

      // when
      const result = await reviewsRepository.findFoundJourneyWithParticipants(fj.id);

      // then
      expect(result).toBeDefined();
      expect(result.id).toBe(Number(fj.id));
      expect(result.companionUserId).toBe(Number(companion.id));
      expect(result.passengerUserId).toBe(Number(passenger.id));
      expect(result.companionStatus).toBe(JOURNEY_STATUS.COMPLETED);
      expect(result.passengerStatus).toBe(JOURNEY_STATUS.COMPLETED);
    });
  });
});
