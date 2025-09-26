import jwt from "jsonwebtoken";

import { config } from "../../../config.js";
import { logger } from "../../../logger.js";
import ERRORS from "../errors.js";

const secret = config.jwt.tokenSecret;
if (!secret || typeof secret !== "string" || secret.trim() === "") {
  logger.error("JWT secret is missing or invalid. Please set config.jwt.tokenSecret to a non-empty string.");
  throw new Error("JWT secret is missing or invalid. Token operations are disabled.");
}
const expirationTime = config.jwt.expirationTime || "1h";

function encodedToken(data) {
  try {
    return jwt.sign(data, secret, {
      expiresIn: expirationTime,
    });
  } catch (error) {
    logger.error(`Encoded token failed ${error}`);
    throw error;
  }
}

function decodedToken(token) {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    logger.error(`Decoded token failed ${error}`);
    if (error.name === "TokenExpiredError") {
      throw new Error(ERRORS.TOKEN.EXPIRED_TOKEN);
    } else if (error.name === "JsonWebTokenError") {
      throw new Error(ERRORS.TOKEN.INVALID_TOKEN);
    } else {
      throw new Error(ERRORS.TOKEN.VERIFICATION_FAILED);
    }
  }
}

export { decodedToken, encodedToken };
