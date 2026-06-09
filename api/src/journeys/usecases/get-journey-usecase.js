/**
 * Retrieve a journey by its id, ensuring it belongs to the requesting user.
 * @param {Function} findJourneyRepository - Repository function that finds a journey by its id.
 * @param {object} params - The lookup parameters.
 * @param {number} params.journeyId - The id of the journey to retrieve.
 * @param {number} params.userId - The id of the user requesting the journey.
 * @returns {Promise<object|null>} The journey when it exists and belongs to the user, otherwise null.
 */
async function getJourneyUsecase(findJourneyRepository, { journeyId, userId }) {
  const journey = await findJourneyRepository(journeyId);

  if (!journey || Number(journey.userId) !== Number(userId)) {
    return null;
  }

  return journey;
}

export { getJourneyUsecase };
