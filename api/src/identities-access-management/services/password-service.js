import bcrypt from "bcrypt";

import { config } from "../../../config.js";
import { logger } from "../../../logger.js";

const { passwordHash } = config.users;

/**
 *
 * @param {} password
 * @returns {Promise<void|*>}
 */
async function generatePassword(password) {
  try {
    return await bcrypt.hash(password, passwordHash);
  } catch (error) {
    logger.error(`Error generating password hash ${error}`);
    throw new Error(error);
  }
}

/**
 *
 * @param input
 * @param hashedPassword
 * @returns {Promise<void|*>}
 */
async function checkPassword(input, hashedPassword) {
  try {
    return await bcrypt.compare(input, hashedPassword);
  } catch (error) {
    logger.error(`Error checking password hash ${error}`);
    throw new Error(error);
  }
}

export { checkPassword, generatePassword };
