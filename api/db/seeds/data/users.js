import { USER_DISABILITIES, USER_GENRES, USER_ROLE } from "../../../src/shared/constants.js";
async function users(databaseBuilder) {

  const users = [
    // User valid, compagnon
    {
      firstname: "Albert",
      lastname: "Berlat",
      email: "albert.berlat@example.net",
      role: USER_ROLE.VALID,
      genre: USER_GENRES.M,
    },
    // Invalid user with blind disability
    {
      firstname: "Andrea",
      lastname: "Marceti",
      email: "a.marceti@example.net",
      role: USER_ROLE.INVALID,
      disabilities: [USER_DISABILITIES.BLIND],
    },
    // Add other users here
  ];

  // call database builder with data
  await Promise.all(users.map((user) => databaseBuilder.factory.buildUser(user)));
}

export { users };
