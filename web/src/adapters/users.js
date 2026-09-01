const USERS_URL = "/api/users/";

async function getUserProfile({ token }) {
  try {
    const response = await fetch(`${USERS_URL}profile`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          errorCode: "SESSION_EXPIRED",
          message: "Session expirée. Merci de vous reconnecter.",
        };
      }

      return {
        success: false,
        message: "Impossible de charger le profil utilisateur.",
      };
    }

    const data = await response.json();
    return {
      success: true,
      profile: data?.data,
    };
  } catch {
    return {
      success: false,
      message: "Impossible de joindre le serveur. Veuillez réessayer plus tard.",
    };
  }
}

/**
 * Retrieve public reviews and statistics for a given user.
 * @param {object} params - Parameters.
 * @param {number|string} params.userId - Target user ID.
 * @param {number} [params.limit=10] - Number of reviews.
 * @param {number} [params.offset=0] - Pagination offset.
 * @returns {Promise<{success: boolean, averageRating?: number, reviewCount?: number, reviews?: Array, message?: string}>}
 */
async function getUserReviews({ userId, limit = 10, offset = 0 }) {
  try {
    const query = new URLSearchParams({ limit, offset }).toString();
    const response = await fetch(`${USERS_URL}${userId}/reviews?${query}`, {
      method: "GET",
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Impossible de charger les avis utilisateur.",
      };
    }

    const data = await response.json();
    return {
      success: true,
      averageRating: data?.data?.averageRating ?? 0,
      reviewCount: data?.data?.reviewCount ?? 0,
      reviews: data?.data?.reviews ?? [],
    };
  } catch {
    return {
      success: false,
      message: "Impossible de joindre le serveur. Veuillez réessayer plus tard.",
    };
  }
}

export { getUserProfile, getUserReviews };

