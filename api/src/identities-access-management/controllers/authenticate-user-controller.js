import { celebrate, Joi } from "celebrate";

import { logger } from "../../../logger.js";
import ERRORS from "../errors.js";
import { findUserByEmail, updateLastLoggedAt } from "../repositories/user-repository.js";
import { checkPassword } from "../services/password-service.js";
import { encodedToken } from "../services/token-service.js";

const authenticateUserSchema = celebrate({
  body: Joi.object({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

/**
 * Authenticate User Controller
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @param {Function} findUserRepository - Function to find user by email
 * @param {Function} checkPasswordsService - Function to check password
 * @param {Function} encodedTokenService - Function to encode token
 * @param {Function} updateLastLoginRepository - Function to update last logged at
 * @returns {Promise<*>} - Returns a promise that resolves to the response
 */
async function authenticateUserController(
  req, res, next,
  findUserRepository = findUserByEmail,
  checkPasswordsService = checkPassword,
  encodedTokenService = encodedToken,
  updateLastLoginRepository = updateLastLoggedAt,
) {
  try {
    const { email, password } = req.body;
    const foundUser = await findUserRepository(email);
    if (!foundUser.isActive) {
      return res.status(404).send();
    }
    if (!foundUser) {
      return res.status(401).json({ message: ERRORS.AUTHENTICATION.INVALID_CREDENTIALS });
    }
    if (!await checkPasswordsService(password, foundUser.hashedPassword)) {
      return res.status(401).json({ message: ERRORS.AUTHENTICATION.INVALID_CREDENTIALS });
    }
    const userToken = encodedTokenService({ userId: foundUser.id, userType: foundUser.userType });
    await updateLastLoginRepository(foundUser.id);
    return res.status(200).json({
      data: {
        userId: foundUser.id,
        token: userToken,
      },
    });
  } catch (error) {
    logger.error(`Error in authenticateUserController: ${error}`);
    next(error);
  }
}

export { authenticateUserController, authenticateUserSchema };
