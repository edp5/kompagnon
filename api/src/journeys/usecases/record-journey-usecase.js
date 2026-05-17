async function recordJourneyUsecase(saveJourneyRepository, journeyData) {
  const recordedJourneyId = await saveJourneyRepository(journeyData);
  return { journeyId: recordedJourneyId };
}

export { recordJourneyUsecase };
