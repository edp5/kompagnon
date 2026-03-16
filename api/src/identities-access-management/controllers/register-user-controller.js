import { celebrate, Joi, Segments } from "celebrate";

import { logger } from "../../../logger.js";
import ERRORS from "../errors.js";
import { createNewUser } from "../repositories/user-repository.js";
import { generatePassword } from "../services/password-service.js";
import { sendMailToActivateUserService } from "../services/send-mail-to-activate-account-service.js";
import { encodedToken } from "../services/token-service.js";

const registerUserSchema = celebrate({
  [Segments.BODY]: Joi.object({
    email: Joi.string().email().required(),
    firstname: Joi.string().required(),
    lastname: Joi.string().required(),
    password: Joi.string().required(),
    birthday: Joi.alternatives()
      .try(
        Joi.string().pattern(/^\d{2}\/\d{2}\/\d{4}$/), // DD/MM/YYYY
        Joi.string().isoDate(), // ISO 8601 (e.g., YYYY-MM-DD)
      )
      .required(),
  }),
});

/**
 * Normalize birthday into YYYY-MM-DD and validate that it is a real date.
 * Accepts either DD/MM/YYYY or YYYY-MM-DD (ISO) formats.
 * @param {string} birthday
 * @returns {string} Normalized birthday in YYYY-MM-DD format
 * @throws {Error} with statusCode 400 for invalid formats or dates
 */
function normalizeBirthday(birthday) {
  // Accept ISO format as-is if it matches YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
    return birthday;
  }

  // Accept DD/MM/YYYY and convert to YYYY-MM-DD
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(birthday);
  if (!match) {
    const error = new Error("Invalid birthday format");
    error.statusCode = 400;
    throw error;
  }

  const [, day, month, year] = match;
  const date = new Date(`${year}-${month}-${day}T00:00:00Z`);

  const isInvalidDate =
    Number.isNaN(date.getTime()) ||
    date.getUTCFullYear().toString() !== year ||
    String(date.getUTCMonth() + 1).padStart(2, "0") !== month ||
    String(date.getUTCDate()).padStart(2, "0") !== day;

  if (isInvalidDate) {
    const error = new Error("Invalid birthday date");
    error.statusCode = 400;
    throw error;
  }

  return `${year}-${month}-${day}`;
}

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
    const normalizedBirthday = normalizeBirthday(birthday);
    const userId = await createUserRepository({
      firstname,
      lastname,
      email,
      hashedPassword,
      birthday: normalizedBirthday,
    });
    await sendMailActivationService({
      firstname,
      lastname,
      token: encodedTokenService({ userId }),
      email,
    });
    return res.status(201).send();
  } catch (error) {
    if (error.statusCode && error.statusCode >= 400 && error.statusCode < 500) {
      logger.warn(`User registration rejected: ${error.message}`);
      return res.status(error.statusCode).json({ message: error.message });
    }
    logger.error(`User registration failed: ${error}`);
    return res.status(500).json({ message: ERRORS.INTERNAL_SERVER_ERROR });
  }
}

export { registerUserController, registerUserSchema };
