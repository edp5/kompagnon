import { JOURNEY_STATUS } from "../../../src/shared/constants.js";
import { knex } from "../../knex-database-connection.js";
import { buildCompanionJourney } from "./build-companion-journey.js";
import { buildPassengerJourney } from "./build-passenger-journey.js";

let defaultPassengerJourneyPromise = null;
let defaultCompanionJourneyPromise = null;

async function getDefaultPassengerJourneyId() {
  if (!defaultPassengerJourneyPromise) {
    defaultPassengerJourneyPromise = buildPassengerJourney();
  }

  const passengerJourney = await defaultPassengerJourneyPromise;
  return passengerJourney.id;
}

async function getDefaultCompanionJourneyId() {
  if (!defaultCompanionJourneyPromise) {
    defaultCompanionJourneyPromise = buildCompanionJourney();
  }

  const companionJourney = await defaultCompanionJourneyPromise;
  return companionJourney.id;
}

async function buildFoundJourney({ passengerJourneyId = null, companionJourneyId = null, status = JOURNEY_STATUS.WAITING } = {}) {
  if (!passengerJourneyId) {
    passengerJourneyId = await getDefaultPassengerJourneyId();
  }
  if (!companionJourneyId) {
    companionJourneyId = await getDefaultCompanionJourneyId();
  }
  const [values] = await knex("found_journeys").insert({ passengerJourneyId, companionJourneyId, status }).returning("*");
  return values;
}

export { buildFoundJourney };
