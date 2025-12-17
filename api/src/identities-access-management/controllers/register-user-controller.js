import { celebrate, Joi } from "celebrate";

import { logger } from "../../../logger.js";
import ERRORS from "../errors.js";
import { createNewUser } from "../repositories/user-repository.js";
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
  }),
});

/**
 * Register User Controller
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {Function} createUserRepository - Function to create a new user in the repository
 * @param {Function} sendMailActivationService - Function to send activation email
 * @param {Function} generatePasswordService - Function to generate hashed password
 * @param {Function} encodedTokenService - Function to generate encoded token
 * @returns {Promise<*>} - Express response
 */
async function registerUserController(
  req,
  res,
  next,
  createUserRepository = createNewUser,
  sendMailActivationService = sendMailToActivateUserService,
  generatePasswordService = generatePassword,
  encodedTokenService = encodedToken,
) {
  try {
    const { firstname, lastname, email, password, birthday } = req.body;
    const hashedPassword = await generatePasswordService(password);
    const userId = await createUserRepository({ firstname, lastname, email, birthday, hashedPassword });
    await sendMailActivationService({ firstname, lastname, token: encodedTokenService({ userId }), email });
    return res.status(201).send();
  } catch (error) {
    logger.error(`User registration failed: ${error}`);
    return res.status(500).json({ message: ERRORS.INTERNAL_SERVER_ERROR });
  }
}

export { registerUserController, registerUserSchema };
