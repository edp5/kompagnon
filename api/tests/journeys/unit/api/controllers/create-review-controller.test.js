import { beforeEach, describe, expect, it, vi } from "vitest";

import { createReviewController } from "../../../../../src/journeys/api/controllers/create-review-controller.js";

describe("Unit | Journeys | Controllers | Create review controller", () => {
  let createReviewUsecase, res, next;

  beforeEach(() => {
    createReviewUsecase = vi.fn();
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
    next = vi.fn();
  });

  it("should call status 201 and return review data on success", async () => {
    // given
    const req = {
      params: { foundJourneyId: "12" },
      auth: { userId: 5 },
      body: { rating: 5, comment: "Parfait" },
    };
    const mockCreated = { id: 10, rating: 5, comment: "Parfait" };
    createReviewUsecase.mockResolvedValue(mockCreated);

    // when
    await createReviewController(req, res, next, createReviewUsecase);

    // then
    expect(createReviewUsecase).toHaveBeenCalledWith({
      foundJourneyId: 12,
      authorId: 5,
      rating: 5,
      comment: "Parfait",
    });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ data: mockCreated });
    expect(next).not.toHaveBeenCalled();
  });

  it("should call next with error when usecase throws", async () => {
    // given
    const req = {
      params: { foundJourneyId: "12" },
      auth: { userId: 5 },
      body: { rating: 5 },
    };
    const error = new Error("Conflict");
    createReviewUsecase.mockRejectedValue(error);

    // when
    await createReviewController(req, res, next, createReviewUsecase);

    // then
    expect(res.status).not.toHaveBeenCalled();
    expect(res.json).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledWith(error);
  });
});
