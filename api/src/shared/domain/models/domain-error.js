/**
 * Base class for domain errors with HTTP status code support
 */
const INTERNAL_SERVER_ERROR_STATUS = 500;

class DomainError extends Error {
  constructor(message, statusCode = INTERNAL_SERVER_ERROR_STATUS) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = Number.isInteger(statusCode) && statusCode >= 400 && statusCode < 600
      ? statusCode
      : INTERNAL_SERVER_ERROR_STATUS;
    Error.captureStackTrace(this, this.constructor);
  }
}

export { DomainError };
