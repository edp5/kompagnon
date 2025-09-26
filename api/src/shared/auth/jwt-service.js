import jwt from "jsonwebtoken";

import { config } from "../../../config.js";

class JWTService {
  constructor() {
    this.secret = config.jwt.tokenSecret;
    this.expirationTime = config.jwt.expirationTime || "1h";
  }

  generateToken(payload, expirationTime = this.expirationTime) {
    if (!this.secret) {
      throw new Error("JWT secret is not configured");
    }

    return jwt.sign(payload, this.secret, {
      expiresIn: expirationTime,
      issuer: "kompagnon-api",
      audience: "kompagnon-app",
    });
  }

  /**
   * Génère un token de vérification d'email
   * @param {string} userId - L'ID de l'utilisateur
   * @param {string} email - L'email de l'utilisateur
   * @returns {string} Le token de vérification
   */
  generateEmailVerificationToken(userId, email) {
    return this.generateToken(
      {
        userId,
        email,
        type: "email_verification",
      },
      "24h", // Token valide 24h
    );
  }

  /**
   * Génère un token de réinitialisation de mot de passe
   * @param {string} userId - L'ID de l'utilisateur
   * @param {string} email - L'email de l'utilisateur
   * @returns {string} Le token de réinitialisation
   */
  generatePasswordResetToken(userId, email) {
    return this.generateToken(
      {
        userId,
        email,
        type: "password_reset",
      },
      "1h", // Token valide 1h
    );
  }

  /**
   * Vérifie et décode un token JWT
   * @param {string} token - Le token à vérifier
   * @returns {Object} Les données décodées du token
   * @throws {Error} Si le token est invalide ou expiré
   */
  verifyToken(token) {
    if (!this.secret) {
      throw new Error("JWT secret is not configured");
    }

    try {
      return jwt.verify(token, this.secret, {
        issuer: "kompagnon-api",
        audience: "kompagnon-app",
      });
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

  /**
   * Vérifie un token de vérification d'email
   * @param {string} token - Le token à vérifier
   * @returns {Object} Les données décodées du token
   */
  verifyEmailVerificationToken(token) {
    const decoded = this.verifyToken(token);
    if (decoded.type !== "email_verification") {
      throw new Error("Invalid token type for email verification");
    }
    return decoded;
  }

  /**
   * Vérifie un token de réinitialisation de mot de passe
   * @param {string} token - Le token à vérifier
   * @returns {Object} Les données décodées du token
   */
  verifyPasswordResetToken(token) {
    const decoded = this.verifyToken(token);
    if (decoded.type !== "password_reset") {
      throw new Error("Invalid token type for password reset");
    }
    return decoded;
  }

  /**
   * Extrait le token du header Authorization
   * @param {string} authHeader - Le header Authorization
   * @returns {string|null} Le token extrait ou null
   */
  extractTokenFromHeader(authHeader) {
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    return authHeader.substring(7); // Remove "Bearer " prefix
  }

  /**
   * Décode un token sans le vérifier (pour inspection)
   * @param {string} token - Le token à décoder
   * @returns {Object} Les données décodées du token
   */
  decodeToken(token) {
    return jwt.decode(token);
  }
}

export default new JWTService();
