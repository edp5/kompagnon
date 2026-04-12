const AUTHENTICATION_URL = "/api/authentication/";

async function loginUser({ email, password }) {
  try {
    const response = await fetch(`${AUTHENTICATION_URL}authenticate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      if (response.status === 401) {
        return {
          success: false,
          message: "Identifiants incorrects.",
        };
      }
      return {
        success: false,
        message: "Échec de la connexion. Veuillez réessayer.",
      };
    }

    const data = await response.json();
    return { success: true, token: data.data.token, userId: data.data.userId };
  } catch {
    return {
      success: false,
      message: "Impossible de joindre le serveur. Veuillez réessayer plus tard.",
    };
  }
}

export { loginUser };
