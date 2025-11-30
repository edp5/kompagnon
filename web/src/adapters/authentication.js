const AUTHENTICATION_URL = "/api/authentication/";
// Default user type for new registrations. Can be overridden if needed for admin-created accounts.
const DEFAULT_USER_TYPE = "user";

async function registerNewUser({ firstname, lastname, email, password, birthday, userType = DEFAULT_USER_TYPE }) {
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
        userType,
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

