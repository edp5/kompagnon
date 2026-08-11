import { UserIsAlreadyActive, UserNotFoundError } from "../errors.js";
import { activateUserById, findUserById } from "../repositories/user-repository.js";

/**
 * Activates a user by their ID.
 * @param {number} userId - The ID of the user to activate.
 * @returns {Promise<void>} - A promise that resolves when the user is activated.
 */
async function activateUserUsecase(userId) {
  const user = await findUserById(userId);
  if (!user) {
    throw new UserNotFoundError();
  }
  if (user.isActive) {
    throw new UserIsAlreadyActive();
  }
  await activateUserById(userId);
}

export { activateUserUsecase };
