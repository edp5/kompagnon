const AUTHENTICATION_URL = "/api/authentication/";

async function registerNewUser({ firstname, lastname, email, password, birthday }) {
  try {
    const response = await fetch(`${AUTHENTICATION_URL}register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        firstname,
        lastname,
        email,
        password,
        birthday,
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Registration failed. Please try again.",
      };
    }

    return { success: true };
  } catch {
    return {
      success: false,
      message: "Unable to reach the server. Please try again later.",
    };
  }
}

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
    return { success: true, user: data.user }; // Assuming the API returns user data on success
  } catch {
    return {
      success: false,
      message: "Impossible de joindre le serveur. Veuillez réessayer plus tard.",
    };
  }
}

export { loginUser, registerNewUser };

