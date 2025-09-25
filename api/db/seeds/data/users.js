async function users(databaseBuilder) {
  const simpleUser = {
    firstname: "simple",
    lastname: "user",
    email: "simple.user@example.net",
    birthday: "01/01/1970",
  };

  // call database builder with data
  await databaseBuilder.factory.buildUser(simpleUser);
}

export { users };
