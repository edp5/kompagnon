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

export { getUserProfile };
