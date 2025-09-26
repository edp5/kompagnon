import bcrypt from "bcryptjs";

import { config } from "../../../config.js";

/**
 * Service pour la gestion des mots de passe
 */
class PasswordService {
  constructor() {
    this.saltRounds = config.users.passwordHash || 10;
  }

  /**
   * Hash un mot de passe
   * @param {string} password - Le mot de passe en clair
   * @returns {Promise<string>} Le mot de passe hashé
   */
  async hashPassword(password) {
    if (!password || typeof password !== "string") {
      throw new Error("Password must be a non-empty string");
    }

    if (password.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    return await bcrypt.hash(password, this.saltRounds);
  }

  /**
   * Vérifie un mot de passe contre son hash
   * @param {string} password - Le mot de passe en clair
   * @param {string} hashedPassword - Le mot de passe hashé
   * @returns {Promise<boolean>} True si le mot de passe correspond
   */
  async verifyPassword(password, hashedPassword) {
    if (!password || !hashedPassword) {
      return false;
    }

    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * Valide la force d'un mot de passe
   * @param {string} password - Le mot de passe à valider
   * @returns {Object} Résultat de la validation
   */
  validatePasswordStrength(password) {
    const errors = [];

    if (!password || typeof password !== "string") {
      errors.push("Password is required");
      return { isValid: false, errors };
    }

    if (password.length < 8) {
      errors.push("Password must be at least 8 characters long");
    }

    if (password.length > 128) {
      errors.push("Password must be less than 128 characters long");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("Password must contain at least one lowercase letter");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("Password must contain at least one uppercase letter");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("Password must contain at least one number");
    }

    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password)) {
      errors.push("Password must contain at least one special character");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Génère un token aléatoire pour la réinitialisation de mot de passe
   * @param {number} length - Longueur du token (défaut: 32)
   * @returns {string} Token aléatoire
   */
  generateRandomToken(length = 32) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}

export default new PasswordService();
