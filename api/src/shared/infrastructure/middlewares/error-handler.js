import { isCelebrateError } from "celebrate";

import { logger } from "../../../../logger.js";
import { DomainError } from "../../domain/models/domain-error.js";

const ERROR_STATUS = "error";
const INTERNAL_SERVER_ERROR_MESSAGE = "Internal server error";

function createErrorResponse(message, details) {
  const response = {
    status: ERROR_STATUS,
    message,
  };

  if (details) {
    response.details = details;
  }

  return response;
}

/**
 * Centralized error handler middleware for Express
 * Handles celebrate validation errors and generic errors
 *
 * @param {Error} error - The error object
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {Function} next - Express next function (required for error middleware signature)
 * @returns {object} JSON response
 */
// eslint-disable-next-line no-unused-vars
function errorHandler(error, req, res, next) {
  // Handle celebrate/Joi validation errors
  if (isCelebrateError(error)) {
    const validationErrors = {};

    // Extract validation errors from celebrate error details
    for (const [segment, joiError] of error.details.entries()) {
      validationErrors[segment] = {
        source: segment,
        keys: joiError.details.map((detail) => detail.path.join(".")),
        message: joiError.message,
      };
    }

    logger.warn({ validationErrors }, "Validation error");

    return res.status(400).json(createErrorResponse("Validation failed", validationErrors));
  }

  // Handle custom application errors with status codes
  if (error instanceof DomainError) {
    logger.warn({ error: error.message, statusCode: error.statusCode }, "Application error");

    return res.status(error.statusCode).json(createErrorResponse(error.message || INTERNAL_SERVER_ERROR_MESSAGE));
  }

  // Handle unknown errors
  logger.error({ error: error.message, stack: error.stack }, "Unhandled error");

  return res.status(500).json(createErrorResponse(INTERNAL_SERVER_ERROR_MESSAGE));
}

export { errorHandler };
