import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { UserNotFoundError } from "../../../../src/identities-access-management/errors.js";
import { setTrustedContactUsecase } from "../../../../src/identities-access-management/usecases/set-trusted-contact-usecase.js";

describe("Integration | IAM | Usecases | Set trusted contact", () => {
  it("should record the contact", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser({ isActive: true });

    // when
    const result = await setTrustedContactUsecase({
      userId: user.id,
      name: "Camille",
      phoneNumber: "0612345678",
    });

    // then
    expect(result).toEqual({ name: "Camille", phoneNumber: "0612345678" });
  });

  it("should clear the contact when no number is given", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser({ isActive: true });
    await setTrustedContactUsecase({ userId: user.id, name: "Camille", phoneNumber: "0612345678" });

    // when
    const result = await setTrustedContactUsecase({ userId: user.id });

    // then
    expect(result).toBeNull();
  });

  it("should drop a name left behind when the number is cleared", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser({ isActive: true });
    await setTrustedContactUsecase({ userId: user.id, name: "Camille", phoneNumber: "0612345678" });

    // when
    const result = await setTrustedContactUsecase({ userId: user.id, name: "Camille" });

    // then
    expect(result).toBeNull();
  });

  it("should refuse an account that is not active", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser({ isActive: false });

    // when
    const error = await setTrustedContactUsecase({
      userId: user.id,
      name: "Camille",
      phoneNumber: "0612345678",
    }).catch((caught) => caught);

    // then
    expect(error).toBeInstanceOf(UserNotFoundError);
  });

  it("should refuse an account that does not exist", async () => {
    // when
    const error = await setTrustedContactUsecase({
      userId: 999999,
      name: "Camille",
      phoneNumber: "0612345678",
    }).catch((caught) => caught);

    // then
    expect(error).toBeInstanceOf(UserNotFoundError);
  });
});
