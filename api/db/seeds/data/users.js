import { databaseBuilder } from "../database-builder/index.js";

/**
 * Create sample users in the database using the databaseBuilder
 * @returns {Promise<Array>} Array of created user records
 */
async function users() {
  const sampleUsers = [
    {
      firstname: "Jean",
      lastname: "Dupont",
      email: "jean.dupont@example.com",
      birthday: "1990-01-15",
      isActive: true,
      isChecked: false,
    },
    {
      firstname: "Marie",
      lastname: "Martin",
      email: "marie.martin@example.com",
      birthday: "1985-03-22",
      isActive: false,
      isChecked: true,
    },
    {
      firstname: "Pierre",
      lastname: "Bernard",
      email: null,
      birthday: "1992-07-08",
      isActive: true,
      isChecked: true,
    },
  ];

  const createdUsers = [];
  for (const userData of sampleUsers) {
    const user = await databaseBuilder.buildUser(userData);
    createdUsers.push(user);
  }

  return createdUsers;
}

export { users };