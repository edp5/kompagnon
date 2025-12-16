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

export { registerNewUser };

