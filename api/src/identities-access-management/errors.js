const ERRORS = {
  TOKEN: {
    REQUIRED: "Token is required",
    EXPIRED_TOKEN: "Token has expired",
    INVALID_TOKEN: "Invalid or expired token",
    VERIFICATION_FAILED: "Token verification failed",
  },
  AUTHENTICATION: {
    INVALID_CREDENTIALS: "Invalid credentials",
  },
  USER: {
    NOT_FOUND_OR_ALREADY_ACTIVE: "User not found or already active",
  },
  INTERNAL_SERVER_ERROR: "Internal server error",
};

const MESSAGE = {
  USER_ACTIVATED_SUCCESSFULLY: "User activated successfully",
};

export default ERRORS;
export { MESSAGE };
