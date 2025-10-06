import { describe, expect, it, vi } from "vitest";

import { sendMailToActivateUserService } from "../../../../src/identities-access-management/services/send-mail-to-activate-account-service.js";

describe("Unit | Identities Access Management | Service | Send mail to activate account", () => {
  it("should generate mail body and call sendMail with correct params", async () => {
    // given
    const mockCreateMailBody = vi.fn().mockResolvedValue("<html lang=\"fr\">body</html>");
    const mockSendMail = vi.fn().mockResolvedValue();
    const input = {
      firstname: "Jean",
      lastname: "Dupont",
      email: "jean.dupont@example.com",
      token: "abc123",
      createMailBody: mockCreateMailBody,
      sendMail: mockSendMail,
    };

    // when
    await sendMailToActivateUserService(input);

    // then
    expect(mockCreateMailBody).toHaveBeenCalledWith("account-activation", {
      firstname: "Jean",
      lastname: "Dupont",
      activationLink: expect.stringContaining("abc123"),
    });
    expect(mockSendMail).toHaveBeenCalledWith({
      to: "jean.dupont@example.com",
      subject: expect.stringContaining("Activer votre compte Kompagnon"),
      html: "<html lang=\"fr\">body</html>",
    });
  });

  it("should throw if createMailBody throws an error", async () => {
    // given
    const mockCreateMailBody = vi.fn().mockRejectedValue(new Error("Mail body error"));
    const mockSendMail = vi.fn();
    const input = {
      firstname: "Jean",
      lastname: "Dupont",
      email: "jean.dupont@example.com",
      token: "abc123",
      createMailBody: mockCreateMailBody,
      sendMail: mockSendMail,
    };
    // when & then
    await expect(sendMailToActivateUserService(input)).rejects.toThrow("Mail body error");
  });

  it("should throw if sendMail throws an error", async () => {
    // given
    const mockCreateMailBody = vi.fn().mockResolvedValue("<html lang=\"fr\">body</html>");
    const mockSendMail = vi.fn().mockRejectedValue(new Error("Send mail error"));
    const input = {
      firstname: "Jean",
      lastname: "Dupont",
      email: "jean.dupont@example.com",
      token: "abc123",
      createMailBody: mockCreateMailBody,
      sendMail: mockSendMail,
    };
    // when & then
    await expect(sendMailToActivateUserService(input)).rejects.toThrow("Send mail error");
  });
});
