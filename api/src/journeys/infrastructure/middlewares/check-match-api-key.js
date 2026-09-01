import { config } from "../../../../config.js";
import { logger } from "../../../../logger.js";
import { InvalidNotifyApiKeyError } from "../../errors.js";

async function checkMatchApiKey(req, res, next) {
  try {
    const apiKey = req.headers["x-api-key"];
    if (_checkApiKey(apiKey)) {
      next();
    }
  } catch (error) {
    logger.error({ err: error }, "Invalid algo api key");
    next(error);
  }
}

function _checkApiKey(apiKey) {
  if (!config.algorithm.apiKey) {
    throw new InvalidNotifyApiKeyError();
  }
  if (config.algorithm.apiKey !== apiKey) {
    throw new InvalidNotifyApiKeyError();
  }
  return true;
}

export { checkMatchApiKey };

