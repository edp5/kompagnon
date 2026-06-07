import { DomainTransaction } from "../../shared/infrastructure/DomainTransaction.js";

/**
 * Update the status of found journey
 * @param {object} param0 - Params data
 * @param {Function} param0.updateRepository - Function to update status
 * @param {number} param0.foundJourneyId - The id of found journey to update
 * @param {string} param0.updatedStatus - The new status of user journey
 * @returns {Promise<void>}
 */
async function updateFoundJourneyStatusUsecase({
  updateRepository,
  foundJourneyId,
  updatedStatus,
}) {
  await DomainTransaction.execute(async () => {
    await updateRepository({ foundJourneyId, status: updatedStatus });
  });
}

export { updateFoundJourneyStatusUsecase };
