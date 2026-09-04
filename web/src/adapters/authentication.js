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
    return { success: true, token: data.data.token, userId: data.data.userId };
  } catch {
    return {
      success: false,
      message: "Impossible de joindre le serveur. Veuillez réessayer plus tard.",
    };
  }
}

async function activateAccount({ token, phoneNumber, role }) {
  try {
    const response = await fetch(`${AUTHENTICATION_URL}activate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ phoneNumber, role }),
    });

    switch (response.status) {
    case 201:
      return { success: true, message: "Compte activé avec succès !" };
    case 400:
      return {
        success: false,
        message: "Numéro de téléphone invalide ou lien d'activation expiré.",
      };
    case 404:
      return {
        success: false,
        message: "Utilisateur introuvable.",
      };
    case 409:
      return {
        success: false,
        message: "Ce compte est déjà activé.",
      };
    default:
      return {
        success: false,
        message: "Échec de l'activation. Veuillez réessayer.",
      };
    }
  } catch {
    return {
      success: false,
      message: "Impossible de joindre le serveur. Veuillez réessayer plus tard.",
    };
  }
}

async function requestPasswordReset({ email }) {
  try {
    const response = await fetch(`${AUTHENTICATION_URL}forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      return {
        success: false,
        message: "Échec de la demande de réinitialisation. Veuillez réessayer.",
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: data?.data?.message || "Un e-mail de réinitialisation vous a été envoyé si le compte existe.",
    };
  } catch {
    return {
      success: false,
      message: "Impossible de joindre le serveur. Veuillez réessayer plus tard.",
    };
  }
}

async function submitPasswordReset({ token, password }) {
  try {
    const response = await fetch(`${AUTHENTICATION_URL}reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token, password }),
    });

    if (!response.ok) {
      if (response.status === 400) {
        return {
          success: false,
          message: "Le lien de réinitialisation est invalide ou a expiré.",
        };
      }
      return {
        success: false,
        message: "Échec de la réinitialisation du mot de passe. Veuillez réessayer.",
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: data?.data?.message || "Votre mot de passe a été réinitialisé avec succès.",
    };
  } catch {
    return {
      success: false,
      message: "Impossible de joindre le serveur. Veuillez réessayer plus tard.",
    };
  }
}

export {
  activateAccount,
  loginUser,
  registerNewUser,
  requestPasswordReset,
  submitPasswordReset,
};

