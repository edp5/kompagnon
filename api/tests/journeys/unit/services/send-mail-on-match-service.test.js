import { describe, expect, it, vi } from "vitest";

import { sendMailOnMatchService } from "../../../../src/journeys/services/send-mail-on-match-service.js";

describe("Unit | Journeys | Services | Send mail on match", () => {
  it("should build the match email with a link to the journey and send it", async () => {
    // given
    const createMailBody = vi.fn().mockResolvedValue("<html>body</html>");
    const sendMail = vi.fn().mockResolvedValue();

    // when
    await sendMailOnMatchService({
      firstname: "Marie",
      lastname: "Durand",
      email: "marie.durand@example.net",
      journeyId: 12,
      matchLabel: "un accompagnateur",
      createMailBody,
      sendMail,
    });

    // then
    expect(createMailBody).toHaveBeenCalledWith("match-found", expect.objectContaining({
      firstname: "Marie",
      lastname: "Durand",
      matchLabel: "un accompagnateur",
      journeyLink: expect.stringContaining("journeys/12"),
    }));
    expect(sendMail).toHaveBeenCalledWith({
      to: "marie.durand@example.net",
      subject: expect.any(String),
      html: "<html>body</html>",
    });
  });
});
