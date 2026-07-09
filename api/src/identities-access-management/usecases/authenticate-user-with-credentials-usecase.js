import { InvalidCredentialsError } from "../errors.js";
import { findUserByEmail, updateLastLoggedAt } from "../repositories/user-repository.js";
import { checkPassword } from "../services/password-service.js";
import { encodedToken } from "../services/token-service.js";

async function authenticateUserWithCredentialsUsecase({ email, password }) {
  const user = await findUserByEmail(email);
  if (!user || !user.isActive) {
    throw new InvalidCredentialsError();
  }
  const passwordCheck = await checkPassword(password, user.hashedPassword);
  if (!passwordCheck) {
    throw new InvalidCredentialsError();
  }
  const token = encodedToken({ userId: user.id, userType: user.type });
  await updateLastLoggedAt(user.id);
  return {
    userId: user.id,
    token: token,
  };
}

export { authenticateUserWithCredentialsUsecase };
