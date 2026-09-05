import { ShareLinkInvalid } from "../errors.js";
import { findJourneyById as findCompanionJourneyById } from "../repositories/companion-users-repository.js";
import { findFoundJourneyByFoundJourneyId } from "../repositories/found-journeys-repository.js";
import { findLatestPositionsByFoundJourneyId } from "../repositories/journey-positions-repository.js";
import { findShareByToken } from "../repositories/journey-shares-repository.js";
import { findJourneyById as findPassengerJourneyById } from "../repositories/passenger-users-repository.js";

/**
 * Reads a journey from a share link. This is the only journey endpoint that
 * answers without authentication, so it deliberately exposes the least it can:
 * the route, the schedule, the first names of the pair and where they are now.
 * No email, no phone number, no account is reachable through it.
 * @param {object} params - The lookup parameters.
 * @param {string} params.token - The secret from the link.
 * @param {Date} [params.now] - Current time, injected for tests.
 * @throws {ShareLinkInvalid} When the token is unknown, revoked or expired.
 * @returns {Promise<object>} The shared journey.
 */
async function getSharedJourneyUsecase({ token, now = new Date() }) {
  const share = await findShareByToken(token);
  if (!share || share.revokedAt || new Date(share.expiresAt) <= now) {
    throw new ShareLinkInvalid();
  }

  const foundJourney = await findFoundJourneyByFoundJourneyId(share.foundJourneyId);
  if (!foundJourney) {
    throw new ShareLinkInvalid();
  }

  const journey = await findPassengerJourneyById(foundJourney.passengerJourneyId);
  const companionJourney = await findCompanionJourneyById(foundJourney.companionJourneyId);
  const positions = await findLatestPositionsByFoundJourneyId(share.foundJourneyId);

  return {
    journey: {
      departureAddress: journey?.departureAddress,
      arrivalAddress: journey?.arrivalAddress,
      departureTime: journey?.departureTime,
      arrivalTime: journey?.arrivalTime,
      departureLat: journey?.departureLat,
      departureLon: journey?.departureLon,
      arrivalLat: journey?.arrivalLat,
      arrivalLon: journey?.arrivalLon,
    },
    companionJourney: {
      departureAddress: companionJourney?.departureAddress,
      arrivalAddress: companionJourney?.arrivalAddress,
      departureLat: companionJourney?.departureLat,
      departureLon: companionJourney?.departureLon,
      arrivalLat: companionJourney?.arrivalLat,
      arrivalLon: companionJourney?.arrivalLon,
    },
    positions: positions.map((position) => ({
      lat: position.lat,
      lon: position.lon,
      recordedAt: position.recorded_at,
      firstname: position.firstname,
    })),
    expiresAt: share.expiresAt,
  };
}

export { getSharedJourneyUsecase };
