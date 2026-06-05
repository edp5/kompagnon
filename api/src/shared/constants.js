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

/**
 * Journey status constants
 * @readonly
 * @enum {string}
 */
export const JOURNEY_STATUS = {
  /** Waiting for confirmation */
  WAITING: "waiting",
  /** Journey accepted by both parties */
  ACCEPTED: "accepted",
  /** Journey rejected */
  REJECTED: "rejected",
  /** Journey cancelled */
  CANCELLED: "cancelled",
  /** Journey successfully completed */
  COMPLETED: "completed",
};

/**
 * User genres
 */
export const USER_GENRES = {
  M: "M",
  F: "F",
};

/**
 * User status
 * invalid / valid
 */
export const USER_ROLE = {
  VALID: "valid",
  INVALID: "invalid",
};

/**
 * Disability type
 * Only for give a simple feedback without details
 */
export const USER_DISABILITIES = {
  BLIND: "blind",
  VISUAL_DIFFICULTIES: "visually",
  WHEELCHAIR: "wheelchair",
  MENTAL: "mental",
};
