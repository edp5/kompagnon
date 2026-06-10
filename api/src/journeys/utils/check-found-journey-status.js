import { JOURNEY_STATUS } from "../../shared/constants.js";
import {
  AlreadyAccepted,
  AlreadyCancelled,
  AlreadyRejected,
} from "../errors.js";

function checkFoundJourneyStatus({ oupdatedStatus, updatedStatus }) {
  const errorStatus = {
    [JOURNEY_STATUS.ACCEPTED]: () => {
      throw new AlreadyAccepted();
    },
    [JOURNEY_STATUS.CANCELLED]: () => {
      throw new AlreadyCancelled();
    },
    [JOURNEY_STATUS.REJECTED]: () => {
      throw new AlreadyRejected();
    },
  };

  if (oupdatedStatus === updatedStatus) {
    errorStatus[updatedStatus]?.();
  } else if (oupdatedStatus !== JOURNEY_STATUS.WAITING) {
    errorStatus[oupdatedStatus]?.();
  }
}

export { checkFoundJourneyStatus };
