import { USER_DISABILITIES, USER_ROLE } from "../../../src/shared/constants.js";

async function matchingJourneyforUsers(databasebuilder) {
  const validUser = await databasebuilder.factory.buildUser({
    firstname: "Josh",
    lastname: "Tartour",
    email: "josh.tartour@kompagnon.net",
    role: USER_ROLE.VALID,
  });

  const invalidUser = await databasebuilder.factory.buildUser({
    firstname: "Adrien",
    lastname: "Le Guen",
    email: "lebeaugosse@kompagnon.net",
    role: USER_ROLE.INVALID,
    disabilities: [USER_DISABILITIES.MENTAL, USER_DISABILITIES.WHEELCHAIR],
  });

  // Complete next lines with some journey information
  await databasebuilder.factory.buildPassengerJourney({ userId: invalidUser.id });
  await databasebuilder.factory.buildCompanionJourney({ userId: validUser.id });
}

// Add other some build function


async function journeys(databasebuilder) {
  // execute all functions
  await matchingJourneyforUsers(databasebuilder);
}

export { journeys };
