import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../../logger.js";
import { findUserById } from "../../../identities-access-management/repositories/user-repository.js";
import { USER_ROLE } from "../../../shared/constants.js";
import { UserHasNoRole } from "../../errors.js";
import usecases from "../../usecases/index.js";

const updateFoundJourneyStatusSchema = celebrate({
  [Segments.PARAMS]: Joi.object({
    foundJourneyId: Joi.number().required().positive().required(),
  }),
  [Segments.BODY]: Joi.object({
    updatedStatus: Joi.bool().required(),
  }),
});

/**
 * Controller to update the found journey status, it will check the user role and update the status accordingly
 * @param {object} req - The request object, it should contain the user id in the auth property, the found journey id in the params and the updated status in the body
 * @param {object} res - The response object, it will return a 201 status code if the status is updated successfully, otherwise it will return a 500 status code
 * @param {Function} next - The next function to call in case of an error, it will pass the error to the error handling middleware
 * @param {Function} acceptCompanionUsecase - The usecase to accept the companion status, it will be injected for testing purposes, it should receive an object with the user id and the found journey id and return a promise
 * @param {Function} rejectCompanionUsecase - The usecase to reject the companion status, it will be injected for testing purposes, it should receive an object with the user id and the found journey id and return a promise
 * @param {Function} acceptPassengerUsecase - The usecase to accept the passenger status, it will be injected for testing purposes, it should receive an object with the user id and the found journey id and return a promise
 * @param {Function} rejectPassengerUsecase - The usecase to reject the passenger status, it will be injected for testing purposes, it should receive an object with the user id and the found journey id and return a promise
 * @param {Function} findUser - The function to find the user by id, it will be injected for testing purposes, it should receive the user id and return a promise that resolves to the user object
 * @returns {Promise<*>} - It will return a promise that resolves to the response object, it will return a 201 status code if the status is updated successfully, otherwise it will return a 500 status code
 */
async function updateFoundJourneyStatusController(
  req,
  res,
  next,
  acceptCompanionUsecase = usecases.acceptFoundJourneyCompanionStatusUsecase,
  rejectCompanionUsecase = usecases.rejectFoundJourneyCompanionStatusUsecase,
  acceptPassengerUsecase = usecases.acceptFoundJourneyPassengerStatusUsecase,
  rejectPassengerUsecase = usecases.rejectFoundJourneyPassengerStatusUsecase,
  findUser = findUserById,
) {
  const { auth, body, params } = req;
  try {
    const user = await findUser(auth.userId);
    switch (user.role) {
    case USER_ROLE.INVALID:
      if (body.updatedStatus) {
        await acceptPassengerUsecase({ userId: auth.userId, foundJourneyId: params.foundJourneyId });
      } else {
        await rejectPassengerUsecase({ userId: auth.userId, foundJourneyId: params.foundJourneyId });
      }
      return res.status(201).send();
    case USER_ROLE.VALID:
      if (body.updatedStatus) {
        await acceptCompanionUsecase({ userId: auth.userId, foundJourneyId: params.foundJourneyId });
      } else {
        await rejectCompanionUsecase({ userId: auth.userId, foundJourneyId: params.foundJourneyId });
      }
      return res.status(201).send();
    default:
      throw new UserHasNoRole();
    }
  } catch (error) {
    logger.error({ err: error }, "Error updating found journey status");
    return next(error);
  }
}

export { updateFoundJourneyStatusController, updateFoundJourneyStatusSchema };
