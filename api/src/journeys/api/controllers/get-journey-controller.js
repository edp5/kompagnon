import { celebrate, Joi, Segments } from "celebrate";

import { findUserById } from "../../../identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../../shared/constants.js";
import { DomainError } from "../../../shared/domain/models/domain-error.js";
import usecases from "../../usecases/index.js";

const getJourneyControllerSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    journeyId: Joi.number().integer().positive().required(),
  }),
});

/**
 * Controller that returns the information of a single journey. The journey is
 * looked up in the passenger or companion table depending on the user's role.
 * Errors are forwarded to the centralized error handler: a DomainError(404) when
 * the journey does not exist or does not belong to the authenticated user, and a
 * DomainError(400) for an unknown user role.
 * @param {object} req - The request object, holding the authenticated user and the journeyId param.
 * @param {object} res - The response object used to reply to the client.
 * @param {Function} next - The next middleware in the Express pipeline (error handling).
 * @param {Function} getPassengerJourney - Use case fetching a passenger journey (dependency injection for tests).
 * @param {Function} getCompanionJourney - Use case fetching a companion journey (dependency injection for tests).
 * @param {Function} findUserRepository - User lookup, defaults to findUserById (dependency injection for tests).
 * @returns {Promise<*>} A promise resolving to the response sent to the client.
 */
async function getJourneyController(
  req,
  res,
  next,
  getPassengerJourney = usecases.getPassengerJourneyUsecase,
  getCompanionJourney = usecases.getCompanionJourneyUsecase,
  findUserRepository = findUserById) {
  const { auth, params } = req;
  try {
    const user = await findUserRepository(auth.userId);
    const journeyId = Number(params.journeyId);
    let journey;
    if (user.role === USER_ROLE.INVALID) {
      journey = await getPassengerJourney({ journeyId, userId: user.id });
    } else if (user.role === USER_ROLE.VALID) {
      journey = await getCompanionJourney({ journeyId, userId: user.id });
    } else {
      throw new DomainError("Invalid user role", 400);
    }
    if (!journey) {
      throw new DomainError("Journey not found", 404);
    }
    return res.status(200).json({ data: journey });
  } catch (error) {
    return next(error);
  }
}

export { getJourneyController, getJourneyControllerSchema };
