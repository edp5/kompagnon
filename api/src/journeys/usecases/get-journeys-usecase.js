/**
 * Retrieve all journeys belonging to a specific user.
 * @param {Function} findJourneysRepository - Repository function that finds all journeys by user id.
 * @param {object} params - The lookup parameters.
 * @param {number} params.userId - The id of the user whose journeys to retrieve.
 * @returns {Promise<Array>} The list of journeys belonging to the user.
 */
async function getJourneysUsecase(findJourneysRepository, { userId }) {
  return await findJourneysRepository(userId);
}

export { getJourneysUsecase };
