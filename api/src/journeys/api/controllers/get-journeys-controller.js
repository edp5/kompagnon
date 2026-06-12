import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../../logger.js";
import { findUserById } from "../../../identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../../shared/constants.js";
import { UserHasNoRole } from "../../errors.js";
import usecases from "../../usecases/index.js";

const getJourneysControllerSchema = celebrate({
  [Segments.QUERY]: Joi.object({}),
});

/**
 * Controller that returns the list of all journeys belonging to the authenticated user.
 * Journeys are fetched from the passenger or companion table depending on the user's role.
 * @param {object} req - The request object, holding the authenticated user.
 * @param {object} res - The response object used to reply to the client.
 * @param {Function} next - The next middleware in the Express pipeline (error handling).
 * @param {Function} getPassengerJourneys - Use case fetching all passenger journeys (dependency injection for tests).
 * @param {Function} getCompanionJourneys - Use case fetching all companion journeys (dependency injection for tests).
 * @param {Function} findUserRepository - User lookup, defaults to findUserById (dependency injection for tests).
 * @returns {Promise<*>} A promise resolving to the response sent to the client.
 */
async function getJourneysController(
  req,
  res,
  next,
  getPassengerJourneys = usecases.getPassengerJourneysUsecase,
  getCompanionJourneys = usecases.getCompanionJourneysUsecase,
  findUserRepository = findUserById) {
  const { auth } = req;
  try {
    const user = await findUserRepository(auth.userId);
    let journeys;
    if (user.role === USER_ROLE.INVALID) {
      journeys = await getPassengerJourneys({ userId: user.id });
    } else if (user.role === USER_ROLE.VALID) {
      journeys = await getCompanionJourneys({ userId: user.id });
    } else {
      throw new UserHasNoRole();
    }
    return res.status(200).json({ data: journeys });
  } catch (error) {
    logger.error({ err: error }, "Error during journeys listing");
    return next(error);
  }
}

export { getJourneysController, getJourneysControllerSchema };
