import { buildCompanionJourney } from "./factory/build-companion-journey.js";
import { buildFoundJourney } from "./factory/build-found-journey.js";
import { buildPassengerJourney } from "./factory/build-passenger-journey.js";
import { buildUser } from "./factory/build-user.js";

const databaseBuilder = {
  factory: {
    buildUser,
    buildPassengerJourney,
    buildCompanionJourney,
    buildFoundJourney,
  },
};
export default databaseBuilder;
