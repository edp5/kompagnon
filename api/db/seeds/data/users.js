import { generatePassword } from "../../../src/identities-access-management/services/password-service.js";
import { USER_DISABILITIES, USER_ROLE } from "../../../src/shared/constants.js";
async function users(databaseBuilder) {
  const hashedPassword = await generatePassword("kompagnon123");
  const users = [
    // User valid, compagnon
    {
      firstname: "Albert",
      lastname: "Berlat",
      email: "albert.berlat@example.net",
      role: USER_ROLE.VALID,
      hashedPassword,
    },
    // Invalid user with blind disability
    {
      firstname: "Andrea",
      lastname: "Marceti",
      email: "a.marceti@examle.net",
      role: USER_ROLE.INVALID,
      disabilities: [USER_DISABILITIES.BLIND],
      hashedPassword,
    },
    // Add other users here
  ];

  // call database builder with data
  await Promise.all(users.map((user) => databaseBuilder.factory.buildUser(user)));
}

export { users };
