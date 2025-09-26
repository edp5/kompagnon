import { knex } from "../../../db/knex-database-connection.js";
import { logger } from "../../../logger.js";
import jwtService from "./jwt-service.js";

/**
 * Middleware d'authentification pour protéger les routes
 */
class AuthMiddleware {
  /**
   * Middleware pour vérifier l'authentification
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   * @param {Function} next - Fonction next
   */
  async authenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).json({
          error: "No token provided",
          message: "Authorization header is required",
        });
      }

      const token = jwtService.extractTokenFromHeader(authHeader);
      if (!token) {
        return res.status(401).json({
          error: "Invalid token format",
          message: "Token must be provided in the format 'Bearer <token>'",
        });
      }

      // Vérification du token
      const decoded = jwtService.verifyToken(token);

      // Vérification que l'utilisateur existe toujours et est actif
      const user = await knex("users")
        .select(["id", "email", "user_type", "email_verified", "isActive"])
        .where("id", decoded.userId)
        .first();

      if (!user) {
        return res.status(401).json({
          error: "User not found",
          message: "User associated with this token no longer exists",
        });
      }

      if (!user.isActive) {
        return res.status(403).json({
          error: "Account deactivated",
          message: "Your account has been deactivated",
        });
      }

      // Ajout des informations utilisateur à la requête
      req.user = {
        userId: user.id,
        email: user.email,
        userType: user.user_type,
        emailVerified: user.email_verified,
      };

      next();

    } catch (error) {
      logger.error("Authentication error:", error);

      if (error.message === "Token has expired") {
        return res.status(401).json({
          error: "Token expired",
          message: "Your session has expired. Please log in again.",
        });
      }

      if (error.message === "Invalid token") {
        return res.status(401).json({
          error: "Invalid token",
          message: "The provided token is invalid",
        });
      }

      res.status(401).json({
        error: "Authentication failed",
        message: "Unable to authenticate user",
      });
    }
  }

  /**
   * Middleware pour vérifier que l'email est vérifié
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   * @param {Function} next - Fonction next
   */
  requireEmailVerification(req, res, next) {
    if (!req.user.emailVerified) {
      return res.status(403).json({
        error: "Email not verified",
        message: "Please verify your email address before accessing this resource",
      });
    }
    next();
  }

  /**
   * Middleware pour vérifier que les CGU sont acceptées
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   * @param {Function} next - Fonction next
   */
  async requireTermsAcceptance(req, res, next) {
    try {
      const user = await knex("users")
        .select("terms_accepted")
        .where("id", req.user.userId)
        .first();

      if (!user.terms_accepted) {
        return res.status(403).json({
          error: "Terms not accepted",
          message: "You must accept the terms of service to access this resource",
        });
      }
      next();
    } catch (error) {
      logger.error("Terms acceptance check error:", error);
      res.status(500).json({
        error: "Internal error",
        message: "An error occurred while checking terms acceptance",
      });
    }
  }

  /**
   * Middleware pour vérifier que la charte est acceptée
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   * @param {Function} next - Fonction next
   */
  async requireCharterAcceptance(req, res, next) {
    try {
      const user = await knex("users")
        .select("charter_accepted")
        .where("id", req.user.userId)
        .first();

      if (!user.charter_accepted) {
        return res.status(403).json({
          error: "Charter not accepted",
          message: "You must accept the service charter to access this resource",
        });
      }
      next();
    } catch (error) {
      logger.error("Charter acceptance check error:", error);
      res.status(500).json({
        error: "Internal error",
        message: "An error occurred while checking charter acceptance",
      });
    }
  }

  /**
   * Middleware pour vérifier le type d'utilisateur
   * @param {string|string[]} allowedTypes - Types d'utilisateur autorisés
   * @returns {Function} Middleware function
   */
  requireUserType(allowedTypes) {
    const types = Array.isArray(allowedTypes) ? allowedTypes : [allowedTypes];

    return (req, res, next) => {
      if (!types.includes(req.user.userType)) {
        return res.status(403).json({
          error: "Access denied",
          message: `This resource is only available for users of type: ${types.join(", ")}`,
        });
      }
      next();
    };
  }

  /**
   * Middleware optionnel pour l'authentification (ne bloque pas si pas de token)
   * @param {Object} req - Requête Express
   * @param {Object} res - Réponse Express
   * @param {Function} next - Fonction next
   */
  async optionalAuthenticate(req, res, next) {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return next();
      }

      const token = jwtService.extractTokenFromHeader(authHeader);
      if (!token) {
        return next();
      }

      // Vérification du token
      const decoded = jwtService.verifyToken(token);

      // Vérification que l'utilisateur existe toujours et est actif
      const user = await knex("users")
        .select(["id", "email", "user_type", "email_verified", "isActive"])
        .where("id", decoded.userId)
        .first();

      if (user && user.isActive) {
        req.user = {
          userId: user.id,
          email: user.email,
          userType: user.user_type,
          emailVerified: user.email_verified,
        };
      }

      next();

    } catch (error) {
      // En cas d'erreur, on continue sans authentification
      logger.warn("Optional authentication failed:", error.message);
      next();
    }
  }
}

export default new AuthMiddleware();
