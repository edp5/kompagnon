import { encodedToken } from "../../src/identities-access-management/services/token-service.js";

function generateAuthenticatedUser(userId, userType) {
  const token = encodedToken({ userId, userType });
  return `Bearer ${token}`;
}

export { generateAuthenticatedUser };
