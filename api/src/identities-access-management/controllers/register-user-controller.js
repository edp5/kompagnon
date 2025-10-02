import { celebrate, Joi } from "celebrate";

import { logger } from "../../../logger.js";
import { USER_TYPES } from "../../shared/constants.js";
import ERRORS from "../errors.js";
import { createNewUser, findUserByEmail } from "../repositories/user-repository.js";
import { generatePassword } from "../services/password-service.js";
import { sendMailToActivateUserService } from "../services/send-mail-to-activate-account-service.js";
import { encodedToken } from "../services/token-service.js";

const registerUserSchema = celebrate({
  body: Joi.object({
    email: Joi.string().email().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    password: Joi.string().required(),
    birthday: Joi.string().required(),
    userType: Joi.string().required().valid(...Object.values(USER_TYPES)),
  }),
});

/**
 * Register User Controller
 * @param req
 * @param res
 * @param createUserRepository
 * @param findUserRepository
 * @param sendMailActivationService
 * @param generatePasswordService
 * @returns {Promise<*>}
 */
async function registerUserController(
  req,
  res,
  createUserRepository = createNewUser,
  findUserRepository = findUserByEmail,
  sendMailActivationService = sendMailToActivateUserService,
  generatePasswordService = generatePassword,
  encodedTokenService = encodedToken,
) {
  try {
    const { firstname, lastname, email, password, birthday, userType } = req.body;
    if (await findUserRepository(email)) {
      return res.status(400).json({ message: ERRORS.USER.ALREADYEXISTS });
    }
    const hashedPassword = await generatePasswordService(password);
    const userId = await createUserRepository({ firstname, lastname, email, birthday, hashedPassword, userType });
    if (!userId) {
      logger.error(`User registration failed for email: ${email}`);
      return res.status(500).json({ message: ERRORS.INTERNAL_SERVER_ERROR });
    }
    await sendMailActivationService({ firstname, lastname, token: encodedTokenService({ userId }), email });
    return res.status(201).send();
  } catch (error) {
    logger.error(`User registration failed: ${error}`);
    return res.status(500).json({ message: ERRORS.INTERNAL_SERVER_ERROR });
  }
}

export { registerUserController, registerUserSchema };
