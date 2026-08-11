import { UserIsAlreadyActive, UserNotFoundError } from "../errors.js";
import { activateUserById, findUserById } from "../repositories/user-repository.js";

/**
 * Activates a user by their ID and stores the phone number provided on activation.
 * @param {number} userId - The ID of the user to activate.
 * @param {string} phoneNumber - The phone number entered on the activation page.
 * @returns {Promise<void>} - A promise that resolves when the user is activated.
 */
async function activateUserUsecase(userId, phoneNumber) {
  const user = await findUserById(userId);
  if (!user) {
    throw new UserNotFoundError();
  }
  if (user.isActive) {
    throw new UserIsAlreadyActive();
  }
  await activateUserById(userId, phoneNumber);
}

export { activateUserUsecase };
