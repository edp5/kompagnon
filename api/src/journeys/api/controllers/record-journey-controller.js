import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../../logger.js";
import { findUserById } from "../../../identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../../shared/constants.js";
import usecases from "../../usecases/index.js";

const recordJourneyControllerSchema = celebrate({
  [Segments.BODY]: Joi.object({
    departureAddress: Joi.string().required(),
    arrivalAddress: Joi.string().required(),
    departureLat: Joi.number().min(-90).max(90).required(),
    departureLon: Joi.number().min(-180).max(180).required(),
    arrivalLat: Joi.number().min(-90).max(90).required(),
    arrivalLon: Joi.number().min(-180).max(180).required(),
    departureTime: Joi.date().required(),
    arrivalTime: Joi.date().required(),
  }),
});

/**
 * Controller for recording a journey. It checks the user's role and calls the appropriate use case to record the journey.
 * If the user is invalid, it calls the recordPassengerJourneyUsecase. If the user is valid, it calls the recordCompanionJourneyUsecase.
 * @param {object} req - The request object, which contains the user's authentication information and the journey details in the body.
 * @param {object} res - The response object, which is used to send the response back to the client.
 * @param {Function} next - The next middleware function in the Express.js pipeline, used for error handling.
 * @param {object} journeyUsecases - An optional parameter for the use cases, which defaults to the imported use cases. This allows for dependency injection during testing.
 * @param {Function} findUserRepository - An optional parameter for the function to find a user by ID, which defaults to the imported findUserById function. This allows for dependency injection during testing.
 * @returns {Promise<*>} - A promise that resolves to the response sent back to the client, which can be a success message or an error message depending on the outcome of the operation.
 */
async function recordJourneyController(
  req,
  res,
  next,
  journeyUsecases = usecases,
  findUserRepository = findUserById) {
  const { auth, body } = req;
  try {
    const user = await findUserRepository(auth.userId);
    let result;
    if (user.role === USER_ROLE.INVALID) {
      result = await journeyUsecases.recordPassengerJourneyUsecase({ userId: user.id, ...body });
    } else if (user.role === USER_ROLE.VALID) {
      result = await journeyUsecases.recordCompanionJourneyUsecase({ userId: user.id, ...body });
    } else {
      return res.status(400).json({ error: "Invalid user role" });
    }
    if (result) {
      return res.status(201).json({ data: result });
    }
  } catch (error) {
    logger.error({ err: error }, "Error during journey recording");
    return res.status(500).send();
  }
}

export { recordJourneyController, recordJourneyControllerSchema };
