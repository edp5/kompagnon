import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../../logger.js";
import { findUserById } from "../../../identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../../shared/constants.js";
import usecases from "../../usecases/index.js";

const getJourneyControllerSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    journeyId: Joi.number().integer().positive().required(),
  }),
});

/**
 * Controller that returns the information of a single journey. The journey is
 * looked up in the passenger or companion table depending on the user's role,
 * and a 404 is returned when the journey does not exist or does not belong to
 * the authenticated user.
 * @param {object} req - The request object, holding the authenticated user and the journeyId param.
 * @param {object} res - The response object used to reply to the client.
 * @param {Function} next - The next middleware in the Express pipeline (error handling).
 * @param {object} journeyUsecases - Optional use cases, defaults to the imported ones (dependency injection for tests).
 * @param {Function} findUserRepository - Optional user lookup, defaults to findUserById (dependency injection for tests).
 * @returns {Promise<*>} A promise resolving to the response sent to the client.
 */
async function getJourneyController(
  req,
  res,
  next,
  journeyUsecases = usecases,
  findUserRepository = findUserById) {
  const { auth, params } = req;
  try {
    const user = await findUserRepository(auth.userId);
    const journeyId = Number(params.journeyId);
    let journey;
    if (user.role === USER_ROLE.INVALID) {
      journey = await journeyUsecases.getPassengerJourneyUsecase({ journeyId, userId: user.id });
    } else if (user.role === USER_ROLE.VALID) {
      journey = await journeyUsecases.getCompanionJourneyUsecase({ journeyId, userId: user.id });
    } else {
      return res.status(400).json({ error: "Invalid user role" });
    }
    if (!journey) {
      return res.status(404).json({ error: "Journey not found" });
    }
    return res.status(200).json({ data: journey });
  } catch (error) {
    logger.error({ err: error }, "Error during journey retrieval");
    return res.status(500).send();
  }
}

export { getJourneyController, getJourneyControllerSchema };
