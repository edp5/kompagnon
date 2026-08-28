const NOTIFICATIONS_URL = "/api/notifications";

/**
 * Retrieve the notifications of the authenticated user, most recent first.
 * @param {object} params - The lookup parameters.
 * @param {string} params.token - The authenticated user's bearer token.
 * @returns {Promise<{success: boolean, notifications?: Array, message?: string}>}
 */
async function getNotifications({ token }) {
  try {
    const response = await fetch(NOTIFICATIONS_URL, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Session expirée. Merci de vous reconnecter.",
        };
      }
      return {
        success: false,
        message: "Impossible de récupérer vos notifications. Veuillez réessayer.",
      };
    }

    const data = await response.json();
    return { success: true, notifications: data?.data ?? [] };
  } catch {
    return {
      success: false,
      message: "Impossible de joindre le serveur. Veuillez réessayer plus tard.",
    };
  }
}

/**
 * Marks a single notification as read.
 * @param {object} params - The parameters.
 * @param {string} params.token - The authenticated user's bearer token.
 * @param {number|string} params.notificationId - The id of the notification to mark as read.
 * @returns {Promise<{success: boolean, message?: string}>}
 */
async function markNotificationAsRead({ token, notificationId }) {
  try {
    const response = await fetch(`${NOTIFICATIONS_URL}/${notificationId}/read`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Impossible de marquer la notification comme lue.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      message: "Impossible de joindre le serveur. Veuillez réessayer plus tard.",
    };
  }
}

/**
 * Marks every notification of the authenticated user as read.
 * @param {object} params - The parameters.
 * @param {string} params.token - The authenticated user's bearer token.
 * @returns {Promise<{success: boolean, message?: string}>}
 */
async function markAllNotificationsAsRead({ token }) {
  try {
    const response = await fetch(`${NOTIFICATIONS_URL}/read-all`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Impossible de marquer les notifications comme lues.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      message: "Impossible de joindre le serveur. Veuillez réessayer plus tard.",
    };
  }
}

/**
 * Deletes a single notification.
 * @param {object} params - The parameters.
 * @param {string} params.token - The authenticated user's bearer token.
 * @param {number|string} params.notificationId - The id of the notification to delete.
 * @returns {Promise<{success: boolean, message?: string}>}
 */
async function deleteNotification({ token, notificationId }) {
  try {
    const response = await fetch(`${NOTIFICATIONS_URL}/${notificationId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Impossible de supprimer la notification.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      message: "Impossible de joindre le serveur. Veuillez réessayer plus tard.",
    };
  }
}

export { deleteNotification, getNotifications, markAllNotificationsAsRead, markNotificationAsRead };
