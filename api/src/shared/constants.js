/**
 * User types constants
 * @readonly
 * @enum {string}
 */
export const USER_TYPES = {
  /** Standard user account */
  USER: "user",
  /** Administrator account */
  ADMIN: "admin",
  /** Moderator account */
  MODERATOR: "moderator",
};

/**
 * Default user type for new registrations
 */
export const DEFAULT_USER_TYPE = USER_TYPES.USER;
