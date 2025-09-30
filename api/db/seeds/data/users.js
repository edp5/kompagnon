import { generatePassword } from "../../../src/identities-access-management/services/password-service.js";

const password = await generatePassword("kompagnon123");
async function users(databaseBuilder) {
  const simpleUser = {
    firstname: "simple",
    lastname: "user",
    email: "simple.user@example.net",
    birthday: "01/01/1970",
    hashedPassword: password,
  };

  // call database builder with data
  await databaseBuilder.factory.buildUser(simpleUser);
}

export { users };
