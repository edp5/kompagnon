import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import usecases from "../../../../src/notifications/usecases/index.js";

describe("Integration | Notifications | Usecases | Get notifications", () => {
  it("should return the notifications belonging to the user", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser();
    const notification1 = await databaseBuilder.factory.buildNotification({ userId: user.id });
    const notification2 = await databaseBuilder.factory.buildNotification({ userId: user.id });

    // when
    const result = await usecases.getNotificationsUsecase({ userId: user.id });

    // then
    expect(result).toHaveLength(2);
    const ids = result.map(n => Number(n.id));
    expect(ids).toContain(Number(notification1.id));
    expect(ids).toContain(Number(notification2.id));
  });

  it("should return an empty array when the user has no notification", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser();

    // when
    const result = await usecases.getNotificationsUsecase({ userId: user.id });

    // then
    expect(result).toEqual([]);
  });
});
