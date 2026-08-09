import { PhoneNumberAlreadyUsedError, UserIsAlreadyActive, UserNotFoundError } from "../errors.js";
import { activateUserById, findUserById, updateUserData } from "../repositories/user-repository.js";

/**
 * Activates a user by their ID.
 * @param {object} params - The parameters for activating a user.
 * @param {number} params.userId - The ID of the user to activate.
 * @param {string} params.phoneNumber - The phone number of the user to activate.
 */
async function activateUserUsecase({ userId, phoneNumber }) {
  const user = await findUserById(userId);
  if (!user) {
    throw new UserNotFoundError();
  } else if (user.isActive) {
    throw new UserIsAlreadyActive();
  }
  try {
    await updateUserData({ userId: userId, data: { phoneNumber } });
  } catch (error) {
    if (error.code === "23505") {
      throw new PhoneNumberAlreadyUsedError();
    }
    throw error;
  }
  await activateUserById(userId);
}

export { activateUserUsecase };
