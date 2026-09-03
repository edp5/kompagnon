import { activateUserUsecase } from "./activate-user-usecase.js";
import { authenticateUserWithCredentialsUsecase } from "./authenticate-user-with-credentials-usecase.js";
import { getUserDataUsecase } from "./get-user-data-usecase.js";
import { requestPasswordResetUsecase } from "./request-password-reset-usecase.js";
import { resetPasswordUsecase } from "./reset-password-usecase.js";

const usecases = {
  activateUserUsecase,
  authenticateUserWithCredentialsUsecase,
  getUserDataUsecase,
  requestPasswordResetUsecase,
  resetPasswordUsecase,
};

export default usecases;

