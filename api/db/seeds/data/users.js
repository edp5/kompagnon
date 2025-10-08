import { generatePassword } from "../../../src/identities-access-management/services/password-service.js";
import { DEFAULT_USER_TYPE } from "../../../src/shared/constants.js";

const password = await generatePassword("kompagnon123");
async function users(databaseBuilder) {
  const simpleUser = {
    firstname: "simple",
    lastname: "user",
    email: "simple.user@example.net",
    birthday: "01/01/1970",
    hashedPassword: password,
    userType: DEFAULT_USER_TYPE,
    lastLoggedAt: new Date("2025-10-08"),
  };

  // call database builder with data
  await databaseBuilder.factory.buildUser(simpleUser);
}

export { users };
