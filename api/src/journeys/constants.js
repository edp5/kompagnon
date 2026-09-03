const NOTIFY_LABEL = {
  COMPANION_LABEL: "un accompagnateur",
  PASSENGER_LABEL: "une personne à accompagner",
};

const MAIL_MATCH_SUBJECT = "Une correspondance de trajet a été trouvée sur Kompagnon";

/**
 * Tracking lifecycle status for a journey.
 * @readonly
 * @enum {string}
 */
const JOURNEY_TRACKING_STATUS = {
  /** Journey has not started yet */
  NOT_STARTED: "not_started",
  /** Journey is currently in progress (GPS tracking active) */
  IN_PROGRESS: "in_progress",
  /** Journey has been completed */
  COMPLETED: "completed",
  /** Journey has been cancelled */
  CANCELLED: "cancelled",
};

/**
 * Journey type (table side).
 * @readonly
 * @enum {string}
 */
const JOURNEY_TYPE = {
  PASSENGER: "passenger",
  COMPANION: "companion",
};

export { JOURNEY_TRACKING_STATUS, JOURNEY_TYPE, MAIL_MATCH_SUBJECT, NOTIFY_LABEL };
