import { describe, expect, it } from "vitest";

import { sendMailToActivateUserService } from "../../../../src/identities-access-management/services/send-mail-to-activate-account-service.js";

describe("Integration | Identities Access Management | Service | Send mail to activate account", () => {
  it("should generate and send activation mail with correct content", async () => {
    // given
    const firstname = "Alice";
    const lastname = "Martin";
    const email = "alice.martin@example.com";
    const token = "integration-token-123";
    let mailSent = null;

    function sendMail({ to, subject, html }) {
      mailSent = { to, subject, html };
      return Promise.resolve();
    }

    // when
    await sendMailToActivateUserService({
      firstname,
      lastname,
      email,
      token,
      sendMail,
    });
    // then
    expect(mailSent).not.toBeNull();
    expect(mailSent.to).toBe(email);
    expect(mailSent.subject).toContain("Activer votre compte Kompagnon");
    expect(mailSent.html).toContain(firstname);
    expect(mailSent.html).toContain(lastname);
    expect(mailSent.html).toContain(token);
    expect(mailSent.html).toContain("authentication/activate?token=" + token);
  });
});

