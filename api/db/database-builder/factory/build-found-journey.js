import { JOURNEY_STATUS } from "../../../src/shared/constants.js";
import { knex } from "../../knex-database-connection.js";

async function buildFoundJourney({ passengerJourneyId, companionJourneyId, status = JOURNEY_STATUS.WAITING } = {}) {
  const [values] = await knex("found_journeys").insert({ passengerJourneyId, companionJourneyId, status }).returning("*");
  return values;
}

export { buildFoundJourney };
