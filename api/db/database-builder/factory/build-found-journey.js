import { JOURNEY_STATUS } from "../../../src/shared/constants.js";
import { knex } from "../../knex-database-connection.js";
import { buildCompanionJourney } from "./build-companion-journey.js";
import { buildPassengerJourney } from "./build-passenger-journey.js";

async function getDefaultPassengerJourneyId() {
  const passengerJourney = await buildPassengerJourney();
  return passengerJourney.id;
}

async function getDefaultCompanionJourneyId() {
  const companionJourney = await buildCompanionJourney();
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
