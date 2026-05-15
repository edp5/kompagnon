import { JOURNEY_STATUS, USER_DISABILITIES, USER_ROLE } from "../../../src/shared/constants.js";

async function matchingJourneyforUsers(databasebuilder) {
  const validUser = await databasebuilder.factory.buildUser({
    firstname: "Josh",
    lastname: "Tartour",
    email: "josh.tartour@example.net",
    role: USER_ROLE.VALID,
  });

  const invalidUser = await databasebuilder.factory.buildUser({
    firstname: "Adrien",
    lastname: "Le Guen",
    email: "lebeaugosse@example.net",
    role: USER_ROLE.INVALID,
    disabilities: [USER_DISABILITIES.MENTAL, USER_DISABILITIES.WHEELCHAIR],
  });
  const departureTime = new Date();
  departureTime.setDate(departureTime.getDate() + 2); // In 2 days
  const arrivalTime = new Date(departureTime.getTime() + 2 * 60 * 60 * 1000); // +2 hours

  await databasebuilder.factory.buildPassengerJourney({
    userId: invalidUser.id,
    departureTime,
    arrivalTime,
    departureAddress: "Paris Gare de Lyon",
    arrivalAddress: "Lyon Part-Dieu",
    departureLat: 48.844304,
    departureLon: 2.374377,
    arrivalLat: 45.760596,
    arrivalLon: 4.859961,
  });

  await databasebuilder.factory.buildCompanionJourney({
    userId: validUser.id,
    departureTime,
    arrivalTime,
    departureAddress: "Paris Gare de Lyon",
    arrivalAddress: "Lyon Part-Dieu",
    departureLat: 48.844304,
    departureLon: 2.374377,
    arrivalLat: 45.760596,
    arrivalLon: 4.859961,
  });
}

async function pastJourneys(databasebuilder) {
  const pastUser = await databasebuilder.factory.buildUser({
    firstname: "Alice",
    lastname: "Dupont",
    email: "alice.dupont@example.net",
    role: USER_ROLE.VALID,
  });

  const departureTime = new Date();
  departureTime.setDate(departureTime.getDate() - 10); // 10 days ago
  const arrivalTime = new Date(departureTime.getTime() + 1 * 60 * 60 * 1000); // +1 hour

  await databasebuilder.factory.buildCompanionJourney({
    userId: pastUser.id,
    departureTime,
    arrivalTime,
    departureAddress: "Marseille Saint-Charles",
    arrivalAddress: "Aix-en-Provence",
    departureLat: 43.302919,
    departureLon: 5.380486,
    arrivalLat: 43.529742,
    arrivalLon: 5.447427,
  });
}

async function unmatchedJourneys(databasebuilder) {
  const lonelyPassenger = await databasebuilder.factory.buildUser({
    firstname: "Bob",
    lastname: "Martin",
    email: "bob.martin@example.net",
    role: USER_ROLE.INVALID,
    disabilities: [USER_DISABILITIES.BLIND],
  });

  const departureTime = new Date();
  departureTime.setDate(departureTime.getDate() + 5);
  const arrivalTime = new Date(departureTime.getTime() + 3 * 60 * 60 * 1000);

  await databasebuilder.factory.buildPassengerJourney({
    userId: lonelyPassenger.id,
    departureTime,
    arrivalTime,
    departureAddress: "Bordeaux Saint-Jean",
    arrivalAddress: "Toulouse Matabiau",
    departureLat: 44.825873,
    departureLon: -0.556697,
    arrivalLat: 43.611226,
    arrivalLon: 1.453664,
  });
}

async function additionalVariedJourneys(databasebuilder) {
  const user1 = await databasebuilder.factory.buildUser({
    firstname: "Clara",
    lastname: "Lefevre",
    email: "clara.lefevre@example.net",
    role: USER_ROLE.VALID,
  });

  const user2 = await databasebuilder.factory.buildUser({
    firstname: "David",
    lastname: "Roux",
    email: "david.roux@example.net",
    role: USER_ROLE.INVALID,
    disabilities: [USER_DISABILITIES.DEAF],
  });

  const user3 = await databasebuilder.factory.buildUser({
    firstname: "Emma",
    lastname: "Bernard",
    email: "emma.bernard@example.net",
    role: USER_ROLE.INVALID,
    disabilities: [USER_DISABILITIES.WHEELCHAIR],
  });

  const user4 = await databasebuilder.factory.buildUser({
    firstname: "Fabien",
    lastname: "Moreau",
    email: "fabien.moreau@example.net",
    role: USER_ROLE.VALID,
  });

  const departureTime1 = new Date();
  departureTime1.setDate(departureTime1.getDate() + 3);
  const arrivalTime1 = new Date(departureTime1.getTime() + 4 * 60 * 60 * 1000);

  // Companion User 1
  await databasebuilder.factory.buildCompanionJourney({
    userId: user1.id,
    departureTime: departureTime1,
    arrivalTime: arrivalTime1,
    departureAddress: "Lille Flandres",
    arrivalAddress: "Strasbourg",
    departureLat: 50.636565,
    departureLon: 3.073611,
    arrivalLat: 48.583920,
    arrivalLon: 7.745530,
  });

  const departureTime2 = new Date();
  departureTime2.setDate(departureTime2.getDate() + 1);
  const arrivalTime2 = new Date(departureTime2.getTime() + 1.5 * 60 * 60 * 1000);

  // Passenger User 2
  await databasebuilder.factory.buildPassengerJourney({
    userId: user2.id,
    departureTime: departureTime2,
    arrivalTime: arrivalTime2,
    departureAddress: "Nantes",
    arrivalAddress: "Rennes",
    departureLat: 47.218371,
    departureLon: -1.553621,
    arrivalLat: 48.117266,
    arrivalLon: -1.677792,
  });

  const departureTime3 = new Date();
  departureTime3.setDate(departureTime3.getDate() + 7);
  const arrivalTime3 = new Date(departureTime3.getTime() + 5 * 60 * 60 * 1000);

  // Passenger User 3
  await databasebuilder.factory.buildPassengerJourney({
    userId: user3.id,
    departureTime: departureTime3,
    arrivalTime: arrivalTime3,
    departureAddress: "Nice Ville",
    arrivalAddress: "Montpellier Saint-Roch",
    departureLat: 43.703130,
    departureLon: 7.266080,
    arrivalLat: 43.604652,
    arrivalLon: 3.879183,
  });

  const departureTime4 = new Date();
  departureTime4.setDate(departureTime4.getDate() + 4);
  const arrivalTime4 = new Date(departureTime4.getTime() + 2.5 * 60 * 60 * 1000);

  // Companion User 4
  await databasebuilder.factory.buildCompanionJourney({
    userId: user4.id,
    departureTime: departureTime4,
    arrivalTime: arrivalTime4,
    departureAddress: "Dijon Ville",
    arrivalAddress: "Besancon Viotte",
    departureLat: 47.322047,
    departureLon: 5.041480,
    arrivalLat: 47.237829,
    arrivalLon: 6.024053,
  });
}

async function acceptedJourney(databasebuilder) {
  const user1 = await databasebuilder.factory.buildUser({
    firstname: "Franc",
    lastname: "Dupuis",
    email: "fdupis  @example.net",
    role: USER_ROLE.INVALID,
  });

  const user2 = await databasebuilder.factory.buildUser({
    firstname: "Gina",
    lastname: "Morel",
    email: "g.morel@example.net ",
    role: USER_ROLE.VALID,
  });

  const departureTime = new Date();
  departureTime.setDate(departureTime.getDate() + 3);
  const companion = await databasebuilder.factory.buildCompanionJourney({
    userId: user1.id,
    departureTime,
    arrivalTime: new Date(departureTime.getTime() + 2 * 60 * 60 * 1000),
    departureAddress: "Paris Gare de Lyon",
    arrivalAddress: "Lyon Part-Dieu",
    departureLat: 48.844304,
    departureLon: 2.374377,
    arrivalLat: 45.760596,
    arrivalLon: 4.859961,
  });

  const passenger = await databasebuilder.factory.buildPassengerJourney({
    userId: user2.id,
    departureTime: departureTime,
    arrivalTime: new Date(departureTime.getTime() + 2 * 60 * 60 * 1000),
    departureAddress: "Paris Gare de Lyon",
    arrivalAddress: "Lyon Part-Dieu",
    arrivalLat: 47.322047,
    arrivalLon: 6.024053,
  });

  await databasebuilder.factory.buildFoundJourney({ passengerJourneyId: passenger.id, companionJourneyId: companion.id, status: JOURNEY_STATUS.ACCEPTED });
}

async function journeys(databasebuilder) {
  await matchingJourneyforUsers(databasebuilder);
  await pastJourneys(databasebuilder);
  await unmatchedJourneys(databasebuilder);
  await additionalVariedJourneys(databasebuilder);
  acceptedJourney(databasebuilder);
}

export { journeys };
