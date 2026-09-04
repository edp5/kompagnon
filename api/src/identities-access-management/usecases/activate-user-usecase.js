import { USER_DISABILITIES, USER_ROLE } from "../../shared/constants.js";
import { PhoneNumberAlreadyUsedError, UserIsAlreadyActive, UserNotFoundError } from "../errors.js";
import {
  findUserById,
  updateUserData,
} from "../repositories/user-repository.js";

/**
 * Activates a user by their ID in a single atomic database update.
 * Per #934/#935:
 * - When role is PASSENGER, automatically assigns visual disability.
 * - When role is COMPANION, disabilities is set to null.
 * @param {object} params - The parameters for activating a user.
 * @param {number} params.userId - The ID of the user to activate.
 * @param {string} params.phoneNumber - The phone number of the user to activate.
 * @param {string} params.role - The role of the user to activate (companion/passenger).
 * @returns {Promise<void>}
 */
async function activateUserUsecase({
  userId,
  phoneNumber,
  role,
}) {
  const user = await findUserById(userId);
  if (!user) {
    throw new UserNotFoundError();
  } else if (user.isActive) {
    throw new UserIsAlreadyActive();
  }

  const data = {
    phoneNumber,
    isActive: true,
  };

  if (role) {
    data.role = role;
    if (role === USER_ROLE.PASSENGER) {
      // Per issue #934/#935: automatically assign visual disability on activation for passengers
      data.disabilities = [USER_DISABILITIES.VISUAL_DIFFICULTIES];
    } else if (role === USER_ROLE.COMPANION) {
      data.disabilities = null;
    }
  }

  try {
    await updateUserData({ userId, data });
  } catch (error) {
    if (error.code === "23505") {
      throw new PhoneNumberAlreadyUsedError();
    }
    throw error;
  }
}

export { activateUserUsecase };
