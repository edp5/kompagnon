import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../../db/database-builder/index.js";
import { getJourneyMessagesUsecase } from "../../../../src/journeys/usecases/get-journey-messages-usecase.js";
import { sendJourneyMessageUsecase } from "../../../../src/journeys/usecases/send-journey-message-usecase.js";

/**
 * Builds a match between a passenger and a companion.
 * @returns {Promise<{passenger: object, companion: object, foundJourneyId: number}>} Both users and the found journey id.
 */
async function buildMatch() {
  const passenger = await databaseBuilder.factory.buildUser({ firstname: "Alice", lastname: "Martin" });
  const companion = await databaseBuilder.factory.buildUser({ firstname: "Bob", lastname: "Durand" });
  const passengerJourney = await databaseBuilder.factory.buildPassengerJourney({ userId: passenger.id });
  const companionJourney = await databaseBuilder.factory.buildCompanionJourney({ userId: companion.id });
  const foundJourney = await databaseBuilder.factory.buildFoundJourney({
    passengerJourneyId: passengerJourney.id,
    companionJourneyId: companionJourney.id,
  });
  return { passenger, companion, foundJourneyId: Number(foundJourney.id) };
}

describe("Integration | Journeys | Usecases | Journey messages", () => {
  it("should let a passenger write to their companion", async () => {
    // given
    const { passenger, foundJourneyId } = await buildMatch();

    // when
    const message = await sendJourneyMessageUsecase({
      foundJourneyId,
      userId: passenger.id,
      body: "Je vous attends devant l'entrée principale.",
    });

    // then
    expect(message.id).toBeDefined();
    expect(message.body).toBe("Je vous attends devant l'entrée principale.");
  });

  it("should return the conversation oldest first, telling apart the author", async () => {
    // given
    const { passenger, companion, foundJourneyId } = await buildMatch();
    await sendJourneyMessageUsecase({ foundJourneyId, userId: passenger.id, body: "Bonjour !" });
    await sendJourneyMessageUsecase({ foundJourneyId, userId: companion.id, body: "Bonjour, à tout de suite." });

    // when
    const conversation = await getJourneyMessagesUsecase({ foundJourneyId, userId: passenger.id });

    // then
    expect(conversation).toHaveLength(2);
    expect(conversation[0]).toMatchObject({ body: "Bonjour !", mine: true });
    expect(conversation[1]).toMatchObject({
      body: "Bonjour, à tout de suite.",
      mine: false,
      author: { firstname: "Bob", lastname: "Durand" },
    });
  });

  it("should read the same conversation from the companion side, with the author flipped", async () => {
    // given
    const { passenger, companion, foundJourneyId } = await buildMatch();
    await sendJourneyMessageUsecase({ foundJourneyId, userId: passenger.id, body: "Bonjour !" });

    // when
    const conversation = await getJourneyMessagesUsecase({ foundJourneyId, userId: companion.id });

    // then
    expect(conversation[0]).toMatchObject({ body: "Bonjour !", mine: false });
  });

  it("should refuse to write in a conversation the user is not part of", async () => {
    // given
    const { foundJourneyId } = await buildMatch();
    const stranger = await databaseBuilder.factory.buildUser();

    // when / then
    await expect(
      sendJourneyMessageUsecase({ foundJourneyId, userId: stranger.id, body: "Coucou" }),
    ).rejects.toThrow("Journey is not of this user");
  });

  it("should refuse to read a conversation the user is not part of", async () => {
    // given
    const { foundJourneyId } = await buildMatch();
    const stranger = await databaseBuilder.factory.buildUser();

    // when / then
    await expect(
      getJourneyMessagesUsecase({ foundJourneyId, userId: stranger.id }),
    ).rejects.toThrow("Journey is not of this user");
  });

  it("should report an unknown found journey", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser();

    // when / then
    await expect(
      getJourneyMessagesUsecase({ foundJourneyId: 999999, userId: user.id }),
    ).rejects.toThrow("Journey not found");
  });

  it("should return an empty conversation when nothing has been said", async () => {
    // given
    const { passenger, foundJourneyId } = await buildMatch();

    // when
    const conversation = await getJourneyMessagesUsecase({ foundJourneyId, userId: passenger.id });

    // then
    expect(conversation).toEqual([]);
  });
});
