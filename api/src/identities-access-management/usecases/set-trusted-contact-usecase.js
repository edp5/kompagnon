import { UserNotFoundError } from "../errors.js";
import { findUserById, updateUserData } from "../repositories/user-repository.js";

/**
 * Records, or clears, the person a user wants reached if a journey goes wrong.
 *
 * Passing no phone number removes the contact: someone must be able to take
 * back the permission to be called about them, and the only way to express that
 * is to let the field be emptied.
 *
 * @param {object} params - The contact to record.
 * @param {number} params.userId - The user setting their contact.
 * @param {string|null} [params.name] - How the user refers to that person.
 * @param {string|null} [params.phoneNumber] - The number to reach them on.
 * @throws {UserNotFoundError} When the account does not exist or is not active.
 * @returns {Promise<{ name: string, phoneNumber: string }|null>} The contact, or null once cleared.
 */
async function setTrustedContactUsecase({ userId, name = null, phoneNumber = null }) {
  const user = await findUserById(userId);
  if (!user || !user.isActive) {
    throw new UserNotFoundError();
  }

  const cleared = !phoneNumber;

  await updateUserData({
    userId,
    data: {
      trustedContactName: cleared ? null : name,
      trustedContactPhone: cleared ? null : phoneNumber,
    },
  });

  return cleared ? null : { name, phoneNumber };
}

export { setTrustedContactUsecase };
