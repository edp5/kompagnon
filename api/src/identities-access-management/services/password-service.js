import bcrypt from "bcrypt";

import { config } from "../../../config.js";

const { passwordHash } = config.users;

/**
 * Generates a hashed password using bcrypt
 * @param {string} password - The plain text password to hash
 * @returns {Promise<string>} The hashed password
 */
async function generatePassword(password) {
  return await bcrypt.hash(password, passwordHash);
}

/**
 * Compares a plain text password with a hashed password
 * @param {string} input - The plain text password to check
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} True if passwords match, false otherwise
 */
async function checkPassword(input, hashedPassword) {
  return await bcrypt.compare(input, hashedPassword);
}

export { checkPassword, generatePassword };
