import { celebrate, Joi, Segments } from "celebrate";

import { findUserById } from "../../../identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../../shared/constants.js";
import { JourneyNotFound, UserHasNoRole } from "../../errors.js";
import usecases from "../../usecases/index.js";

const getJourneyMatchesControllerSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    journeyId: Joi.number().integer().positive().required(),
  }),
});

/**
 * Controller that returns the matches of a journey owned by the authenticated
 * user. The journey is looked up in the passenger or companion table depending
 * on the user's role. A JourneyNotFound is forwarded when the journey does not
 * exist or does not belong to the user, and a UserHasNoRole for an unknown role.
 * @param {object} req - The request object, holding the authenticated user and the journeyId param.
 * @param {object} res - The response object used to reply to the client.
 * @param {Function} next - The next middleware in the Express pipeline (error handling).
 * @param {Function} getPassengerMatches - Use case fetching passenger journey matches (dependency injection for tests).
 * @param {Function} getCompanionMatches - Use case fetching companion journey matches (dependency injection for tests).
 * @param {Function} findUserRepository - User lookup, defaults to findUserById (dependency injection for tests).
 * @returns {Promise<*>} A promise resolving to the response sent to the client.
 */
async function getJourneyMatchesController(
  req,
  res,
  next,
  getPassengerMatches = usecases.getPassengerJourneyMatchesUsecase,
  getCompanionMatches = usecases.getCompanionJourneyMatchesUsecase,
  findUserRepository = findUserById) {
  const { auth, params } = req;
  try {
    const user = await findUserRepository(auth.userId);
    const journeyId = Number(params.journeyId);
    let matches;
    if (user.role === USER_ROLE.INVALID) {
      matches = await getPassengerMatches({ journeyId, userId: user.id });
    } else if (user.role === USER_ROLE.VALID) {
      matches = await getCompanionMatches({ journeyId, userId: user.id });
    } else {
      throw new UserHasNoRole();
    }
    if (matches === null) {
      throw new JourneyNotFound();
    }
    return res.status(200).json({ data: matches });
  } catch (error) {
    return next(error);
  }
}

export { getJourneyMatchesController, getJourneyMatchesControllerSchema };
