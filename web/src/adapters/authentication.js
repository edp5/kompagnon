const REGISTER_URL = "/api/authentication/register";
const DEFAULT_USER_TYPE = "user";

async function registerNewUser({ firstname, lastname, email, password, birthday, userType = DEFAULT_USER_TYPE }) {
  try {
    const response = await fetch(REGISTER_URL, {
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

