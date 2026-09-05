import crypto from "node:crypto";

import { config } from "../../../config.js";
import { createShare } from "../repositories/journey-shares-repository.js";
import { findFoundJourneyOfUser } from "../utils/find-found-journey-of-user.js";

// A share link is meant to cover one trip, not to become a permanent tracker.
const SHARE_LIFETIME_MS = 24 * 60 * 60 * 1000;

/**
 * Creates a link letting someone outside the app follow a journey, so a relative
 * can check that the trip is going well. The link carries a secret token and
 * stops working after a day.
 * @param {object} params - The share to create.
 * @param {number} params.foundJourneyId - The journey to share.
 * @param {number} params.userId - The user sharing it.
 * @returns {Promise<{token: string, url: string, expiresAt: Date}>} The share link.
 */
async function createJourneyShareUsecase({ foundJourneyId, userId }) {
  await findFoundJourneyOfUser({ foundJourneyId, userId });

  const token = crypto.randomBytes(24).toString("hex");
  const expiresAt = new Date(Date.now() + SHARE_LIFETIME_MS);

  const share = await createShare({ foundJourneyId, createdBy: userId, token, expiresAt });

  return {
    token: share.token,
    url: `${config.baseUrl ?? ""}suivi/${share.token}`,
    expiresAt: share.expiresAt,
  };
}

export { createJourneyShareUsecase };
