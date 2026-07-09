import { UserNotFoundError } from "../errors.js";
import { findUserById } from "../repositories/user-repository.js";

async function getUserDataUsecase(userId) {
  const user = await findUserById(userId);
  if (!user || !user.isActive) {
    throw new UserNotFoundError();
  }
  return {
    userId: user.id,
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    birthday: user.birthday,
    genre: user.genre,
    role: user.role,
    disabilities: user.disabilities,
  };
}

export { getUserDataUsecase };
