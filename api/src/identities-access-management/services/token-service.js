import jwt from "jsonwebtoken";

import { config } from "../../../config.js";
import { logger } from "../../../logger.js";

const secret = config.jwt.tokenSecret;
const expirationTime = config.jwt.expirationTime || "1h";

function encodedToken(data) {
  try {
    return jwt.sign(data, secret, {
      expiresIn: expirationTime,
    });
  } catch (error) {
    logger.error({ err: error }, "Token encoding failed");
    throw error;
  }
}

function decodedToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    logger.error({ err: error }, "Token decoding failed");
    throw error;
  }
}

export { decodedToken, encodedToken };
