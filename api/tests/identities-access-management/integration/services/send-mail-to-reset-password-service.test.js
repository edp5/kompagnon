import { describe, expect, it } from "vitest";

import { sendMailToResetPasswordService } from "../../../../src/identities-access-management/services/send-mail-to-reset-password-service.js";

describe("Integration | Identities Access Management | Service | Send mail to reset password", () => {
  it("should generate and send reset password email with correct content and link", async () => {
    // given
    const firstname = "Alice";
    const lastname = "Martin";
    const email = "alice.martin@example.com";
    const token = "reset-token-456";
    let mailSent = null;

    function sendMail({ to, subject, html }) {
      mailSent = { to, subject, html };
      return Promise.resolve();
    }

    // when
    await sendMailToResetPasswordService({
      firstname,
      lastname,
      email,
      token,
      sendMail,
    });

    // then
    expect(mailSent).not.toBeNull();
    expect(mailSent.to).toBe(email);
    expect(mailSent.subject).toContain("Réinitialisation de votre mot de passe Kompagnon");
    expect(mailSent.html).toContain(firstname);
    expect(mailSent.html).toContain(lastname);
    expect(mailSent.html).toContain(token);
    expect(mailSent.html).toContain("authentication/reset-password?token=" + token);
  });
});
