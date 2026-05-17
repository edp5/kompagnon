import { buildJourneysRepository } from "./build-journeys-repository.js";

const TABLE_NAME = "companion_journeys";
const { findJourneyById, findJourneysByUserId, removeJourneyByJourneyId, saveJourney } = buildJourneysRepository(TABLE_NAME);

export { findJourneyById, findJourneysByUserId, removeJourneyByJourneyId, saveJourney };
