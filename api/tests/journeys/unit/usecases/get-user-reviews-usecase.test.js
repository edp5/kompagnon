import { describe, expect, it, vi } from "vitest";

import { getUserReviewsUsecase } from "../../../../src/journeys/usecases/get-user-reviews-usecase.js";

describe("Unit | Journeys | Usecases | Get user reviews usecase", () => {
  it("should aggregate stats and reviews list for target user", async () => {
    // given
    const mockReviews = [
      {
        id: 1,
        rating: 5,
        comment: "Great experience",
        authorFirstname: "Jean",
        authorLastname: "Dupont",
      },
    ];
    const mockStats = {
      averageRating: 4.8,
      reviewCount: 6,
    };

    const findReviewsMock = vi.fn().mockResolvedValue(mockReviews);
    const getStatsMock = vi.fn().mockResolvedValue(mockStats);

    // when
    const result = await getUserReviewsUsecase({
      userId: 42,
      limit: 10,
      offset: 0,
      findReviews: findReviewsMock,
      getStats: getStatsMock,
    });

    // then
    expect(findReviewsMock).toHaveBeenCalledWith(42, { limit: 10, offset: 0 });
    expect(getStatsMock).toHaveBeenCalledWith(42);
    expect(result).toEqual({
      averageRating: 4.8,
      reviewCount: 6,
      reviews: mockReviews,
    });
  });
});
