import { beforeEach, describe, expect, it, vi } from "vitest";

import { getUserReviewsController } from "../../../../../src/journeys/api/controllers/get-user-reviews-controller.js";

describe("Unit | Journeys | Controllers | Get user reviews controller", () => {
  let getUserReviewsUsecase, res, next;

  beforeEach(() => {
    getUserReviewsUsecase = vi.fn();
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  it("should call status 200 and return data with default pagination", async () => {
    // given
    const req = {
      params: { userId: "8" },
      query: {},
    };
    const mockData = { averageRating: 4.5, reviewCount: 4, reviews: [] };
    getUserReviewsUsecase.mockResolvedValue(mockData);

    // when
    await getUserReviewsController(req, res, next, getUserReviewsUsecase);

    // then
    expect(getUserReviewsUsecase).toHaveBeenCalledWith({
      userId: 8,
      limit: 10,
      offset: 0,
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockData });
    expect(next).not.toHaveBeenCalled();
  });

  it("should pass custom limit and offset to usecase", async () => {
    // given
    const req = {
      params: { userId: "8" },
      query: { limit: "25", offset: "50" },
    };
    const mockData = { averageRating: 5, reviewCount: 1, reviews: [] };
    getUserReviewsUsecase.mockResolvedValue(mockData);

    // when
    await getUserReviewsController(req, res, next, getUserReviewsUsecase);

    // then
    expect(getUserReviewsUsecase).toHaveBeenCalledWith({
      userId: 8,
      limit: 25,
      offset: 50,
    });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it("should call next with error when usecase throws", async () => {
    // given
    const req = {
      params: { userId: "8" },
      query: {},
    };
    const error = new Error("Database error");
    getUserReviewsUsecase.mockRejectedValue(error);

    // when
    await getUserReviewsController(req, res, next, getUserReviewsUsecase);

    // then
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
