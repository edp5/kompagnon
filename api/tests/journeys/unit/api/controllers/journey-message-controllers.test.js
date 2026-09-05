import { beforeEach, describe, expect, it, vi } from "vitest";

import { getJourneyMessagesController } from "../../../../../src/journeys/api/controllers/get-journey-messages-controller.js";
import { sendJourneyMessageController } from "../../../../../src/journeys/api/controllers/send-journey-message-controller.js";

describe("Unit | Journey | Api | Controller | Journey message controllers", () => {
  let res, next;

  beforeEach(() => {
    res = { status: vi.fn().mockReturnThis(), json: vi.fn().mockReturnThis() };
    next = vi.fn();
  });

  describe("Send a message", () => {
    it("should send the message on behalf of the authenticated user", async () => {
      // given
      const req = { auth: { userId: 1 }, params: { foundJourneyId: "5" }, body: { body: "Bonjour" } };
      const sendMessage = vi.fn().mockResolvedValue({ id: 9 });

      // when
      await sendJourneyMessageController(req, res, next, sendMessage);

      // then
      expect(sendMessage).toHaveBeenCalledWith({ foundJourneyId: 5, userId: 1, body: "Bonjour" });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ data: { id: 9 } });
    });

    it("should trim the message, so spaces alone never reach the conversation", async () => {
      // given
      const req = { auth: { userId: 1 }, params: { foundJourneyId: "5" }, body: { body: "  Bonjour  " } };
      const sendMessage = vi.fn().mockResolvedValue({ id: 9 });

      // when
      await sendJourneyMessageController(req, res, next, sendMessage);

      // then
      expect(sendMessage).toHaveBeenCalledWith(expect.objectContaining({ body: "Bonjour" }));
    });

    it("should forward errors thrown by the use case to next", async () => {
      // given
      const req = { auth: { userId: 1 }, params: { foundJourneyId: "5" }, body: { body: "Bonjour" } };
      const thrownError = new Error("boom");
      const sendMessage = vi.fn().mockRejectedValue(thrownError);

      // when
      await sendJourneyMessageController(req, res, next, sendMessage);

      // then
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(thrownError);
    });
  });

  describe("Read the conversation", () => {
    it("should return the conversation of the authenticated user", async () => {
      // given
      const req = { auth: { userId: 1 }, params: { foundJourneyId: "5" } };
      const getMessages = vi.fn().mockResolvedValue([{ id: 9, body: "Bonjour", mine: true }]);

      // when
      await getJourneyMessagesController(req, res, next, getMessages);

      // then
      expect(getMessages).toHaveBeenCalledWith({ foundJourneyId: 5, userId: 1 });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ data: [{ id: 9, body: "Bonjour", mine: true }] });
    });

    it("should forward errors thrown by the use case to next", async () => {
      // given
      const req = { auth: { userId: 1 }, params: { foundJourneyId: "5" } };
      const thrownError = new Error("boom");
      const getMessages = vi.fn().mockRejectedValue(thrownError);

      // when
      await getJourneyMessagesController(req, res, next, getMessages);

      // then
      expect(res.status).not.toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(thrownError);
    });
  });
});
