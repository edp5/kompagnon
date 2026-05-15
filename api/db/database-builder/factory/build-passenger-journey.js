import { knex } from "../../knex-database-connection.js";

const TABLE_NAME = "passenger_journeys";
async function buildPassengerJourney({
  userId,
  departureTime = new Date("2021-01-01T00:00:00Z"),
  arrivalTime = new Date("2021-01-01T01:00:00Z"),
  departureAddress = "5 rue de la cantoche, 75015 Cherbour",
  arrivalAddress = "30 chemin des faubours 7554 TOurnus",
  departureLat = 0.0,
  departureLon = 0.0,
  arrivalLat = 0.0,
  arrivalLon = 0.0,
} = {}) {
  const [values] = await knex(TABLE_NAME).insert({
    userId,
    departureTime,
    arrivalTime,
    departureAddress,
    arrivalAddress,
    departureLat,
    departureLon,
    arrivalLat,
    arrivalLon,
    created_at: new Date(),
    updated_at: new Date(),
  }).returning("*");
  return values;
}

export { buildPassengerJourney };
