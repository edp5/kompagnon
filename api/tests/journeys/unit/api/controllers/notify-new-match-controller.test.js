import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  notifyNewMatchController,
} from "../../../../../src/journeys/api/controllers/notify-new-match-controller.js";

describe("Unit | Journeys | Controller | Notify new match controller", () => {
  let res, next, notifier;
  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), send: vi.fn().mockReturnValue() };
    next = vi.fn();
    notifier = vi.fn().mockResolvedValue();
  });

  it("should extract ids of body and call service", async () => {
    // given
    const req = {
      body: {
        data: [1, 2, 3],
      },
    };

    // when
    await notifyNewMatchController(req, res, next, notifier);

    // then
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalled();
    expect(notifier).toHaveBeenCalledWith({ foundJourneyIds: [1, 2, 3,
    ],
    });
  });

  it("should call next with error", async () => {
    // given
    const req = {
      body: {
        data: [1, 2, 3],
      },
    };
    notifier.mockRejectedValue("error");

    // when
    await notifyNewMatchController(req, res, next, notifier);

    // then
    expect(res.status).not.toHaveBeenCalled();
    expect(res.send).not.toHaveBeenCalled();
    expect(notifier).toHaveBeenCalledWith({ foundJourneyIds: [1, 2, 3,
    ],
    });
    expect(next).toHaveBeenCalledWith("error");
  });
});
