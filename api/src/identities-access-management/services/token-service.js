import jwt from "jsonwebtoken";

import { config } from "../../../config.js";

class TokenService {
  constructor() {
    this.secret = config.jwt.tokenSecret;
    this.expirationTime = config.jwt.expirationTime || "1h";
  }

  async encodedToken(data) {
    if (!this.secret) {
      throw new Error("JWT secret is not configured");
    }

    return jwt.sign(data, this.secret, {
      expiresIn: this.expirationTime,
    });
  }

  decodedToken(token) {
    if (!this.secret) {
      throw new Error("JWT secret is not configured");
    }

    try {
      return jwt.verify(token, this.secret);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid token");
      } else {
        throw new Error("Token verification failed");
      }
    }
  }
}

export default new TokenService();
