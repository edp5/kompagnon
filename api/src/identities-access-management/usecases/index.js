import { activateUserUsecase } from "./activate-user-usecase.js";
import { authenticateUserWithCredentialsUsecase } from "./authenticate-user-with-credentials-usecase.js";
import { getUserDataUsecase } from "./get-user-data-usecase.js";

const usecases = {
  activateUserUsecase,
  authenticateUserWithCredentialsUsecase,
  getUserDataUsecase,
};

export default usecases;
