import { createNotificationUsecase } from "./create-notification-usecase.js";
import { deleteNotificationUsecase } from "./delete-notification-usecase.js";
import { getNotificationsUsecase } from "./get-notifications-usecase.js";
import { markAllNotificationsAsReadUsecase } from "./mark-all-notifications-as-read-usecase.js";
import { markNotificationAsReadUsecase } from "./mark-notification-as-read-usecase.js";

const usecases = {
  createNotificationUsecase,
  deleteNotificationUsecase,
  getNotificationsUsecase,
  markAllNotificationsAsReadUsecase,
  markNotificationAsReadUsecase,
};

export default usecases;
