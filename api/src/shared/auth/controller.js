import { knex } from "../../../db/knex-database-connection.js";
import { logger } from "../../../logger.js";
import jwtService from "./jwt-service.js";
import passwordService from "./password-service.js";

class AuthController {
  async register(req, res) {
    try {
      const {
        email,
        password,
        firstname,
        lastname,
        birthday,
        userType,
        termsAccepted,
        charterAccepted,
        disabilities,
      } = req.body;

      // Validation des champs obligatoires
      if (!email || !password || !firstname || !lastname || !birthday || !userType) {
        return res.status(400).json({
          error: "Missing required fields",
          message: "Email, password, firstname, lastname, birthday, and userType are required",
        });
      }

      // Validation du type d'utilisateur
      if (!["accompanying", "accompanied"].includes(userType)) {
        return res.status(400).json({
          error: "Invalid user type",
          message: "User type must be 'accompanying' or 'accompanied'",
        });
      }

      // Validation de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({
          error: "Invalid email format",
          message: "Please provide a valid email address",
        });
      }

      // Validation de la force du mot de passe
      const passwordValidation = passwordService.validatePasswordStrength(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          error: "Weak password",
          message: "Password does not meet security requirements",
          details: passwordValidation.errors,
        });
      }

      // Vérification que l'email n'existe pas déjà
      const existingUser = await knex("users").where("email", email).first();
      if (existingUser) {
        return res.status(409).json({
          error: "Email already exists",
          message: "An account with this email already exists",
        });
      }

      // Hash du mot de passe
      const hashedPassword = await passwordService.hashPassword(password);

      // Génération du token de vérification d'email
      const emailVerificationToken = jwtService.generateEmailVerificationToken(null, email);

      // Préparation des données utilisateur
      const userData = {
        email,
        password: hashedPassword,
        firstname,
        lastname,
        birthday,
        user_type: userType,
        email_verified: false,
        email_verification_token: emailVerificationToken,
        terms_accepted: termsAccepted || false,
        charter_accepted: charterAccepted || false,
        login_attempts: 0,
        isActive: true,
      };

      // Ajout des handicaps si l'utilisateur est accompagné
      if (userType === "accompanied" && disabilities) {
        userData.disabilities = JSON.stringify(disabilities);
      }

      // Insertion de l'utilisateur en base
      const [newUser] = await knex("users").insert(userData).returning([
        "id", "email", "firstname", "lastname", "user_type",
        "email_verified", "terms_accepted", "charter_accepted",
        "created_at",
      ]);

      // Mise à jour du token avec l'ID utilisateur
      const finalToken = jwtService.generateEmailVerificationToken(newUser.id, email);
      await knex("users")
        .where("id", newUser.id)
        .update({ email_verification_token: finalToken });

      logger.info(`New user registered: ${email}`);


      res.status(201).json({
        message: "User registered successfully. Please check your email to verify your account.",
        user: {
          id: newUser.id,
          email: newUser.email,
          firstname: newUser.firstname,
          lastname: newUser.lastname,
          userType: newUser.user_type,
          emailVerified: newUser.email_verified,
          termsAccepted: newUser.terms_accepted,
          charterAccepted: newUser.charter_accepted,
        },
      });

    } catch (error) {
      logger.error("Registration error:", error);
      res.status(500).json({
        error: "Registration failed",
        message: "An error occurred during registration",
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      // Validation des champs obligatoires
      if (!email || !password) {
        return res.status(400).json({
          error: "Missing credentials",
          message: "Email and password are required",
        });
      }

      // Recherche de l'utilisateur
      const user = await knex("users").where("email", email).first();
      if (!user) {
        return res.status(401).json({
          error: "Invalid credentials",
          message: "Email or password is incorrect",
        });
      }

      // Vérification si le compte est verrouillé
      if (user.account_locked_until && new Date() < new Date(user.account_locked_until)) {
        return res.status(423).json({
          error: "Account locked",
          message: "Account is temporarily locked due to too many failed login attempts",
        });
      }

      // Vérification si le compte est actif
      if (!user.isActive) {
        return res.status(403).json({
          error: "Account deactivated",
          message: "Your account has been deactivated. Please contact support.",
        });
      }

      // Vérification du mot de passe
      const isPasswordValid = await passwordService.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        // Incrémenter le nombre de tentatives
        const newAttempts = (user.login_attempts || 0) + 1;
        const updateData = {
          login_attempts: newAttempts,
          last_login_attempt: new Date(),
        };

        // Verrouiller le compte après 10 tentatives
        if (newAttempts >= 10) {
          updateData.account_locked_until = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24h
        }

        await knex("users").where("id", user.id).update(updateData);

        return res.status(401).json({
          error: "Invalid credentials",
          message: "Email or password is incorrect",
        });
      }

      // Réinitialiser les tentatives de connexion en cas de succès
      await knex("users").where("id", user.id).update({
        login_attempts: 0,
        last_login_attempt: null,
        account_locked_until: null,
      });

      // Génération du token JWT
      const token = jwtService.generateToken({
        userId: user.id,
        email: user.email,
        userType: user.user_type,
        emailVerified: user.email_verified,
      });

      logger.info(`User logged in: ${email}`);

      res.json({
        message: "Login successful",
        token,
        user: {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          userType: user.user_type,
          emailVerified: user.email_verified,
          termsAccepted: user.terms_accepted,
          charterAccepted: user.charter_accepted,
        },
      });

    } catch (error) {
      logger.error("Login error:", error);
      res.status(500).json({
        error: "Login failed",
        message: "An error occurred during login",
      });
    }
  }

  async verifyEmail(req, res) {
    try {
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          error: "Missing token",
          message: "Verification token is required",
        });
      }

      // Vérification du token
      const decoded = jwtService.verifyEmailVerificationToken(token);

      // Mise à jour de l'utilisateur
      await knex("users")
        .where("id", decoded.userId)
        .update({
          email_verified: true,
          email_verification_token: null,
        });

      logger.info(`Email verified for user: ${decoded.email}`);

      res.json({
        message: "Email verified successfully",
      });

    } catch (error) {
      logger.error("Email verification error:", error);
      res.status(400).json({
        error: "Invalid token",
        message: "The verification token is invalid or has expired",
      });
    }
  }

  async requestPasswordReset(req, res) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          error: "Missing email",
          message: "Email is required",
        });
      }

      // Recherche de l'utilisateur
      const user = await knex("users").where("email", email).first();

      // Toujours retourner un succès pour des raisons de sécurité
      if (!user) {
        return res.json({
          message: "If an account with this email exists, a password reset link has been sent",
        });
      }

      // Génération du token de réinitialisation
      const resetToken = jwtService.generatePasswordResetToken(user.id, user.email);
      const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1h

      // Mise à jour de l'utilisateur
      await knex("users")
        .where("id", user.id)
        .update({
          password_reset_token: resetToken,
          password_reset_expires: resetExpires,
        });

      logger.info(`Password reset requested for: ${email}`);


      res.json({
        message: "If an account with this email exists, a password reset link has been sent",
      });

    } catch (error) {
      logger.error("Password reset request error:", error);
      res.status(500).json({
        error: "Password reset failed",
        message: "An error occurred while processing your request",
      });
    }
  }

  async resetPassword(req, res) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res.status(400).json({
          error: "Missing required fields",
          message: "Token and new password are required",
        });
      }

      // Vérification du token
      const decoded = jwtService.verifyPasswordResetToken(token);

      // Validation de la force du nouveau mot de passe
      const passwordValidation = passwordService.validatePasswordStrength(newPassword);
      if (!passwordValidation.isValid) {
        return res.status(400).json({
          error: "Weak password",
          message: "Password does not meet security requirements",
          details: passwordValidation.errors,
        });
      }

      // Hash du nouveau mot de passe
      const hashedPassword = await passwordService.hashPassword(newPassword);

      // Mise à jour du mot de passe
      await knex("users")
        .where("id", decoded.userId)
        .update({
          password: hashedPassword,
          password_reset_token: null,
          password_reset_expires: null,
          login_attempts: 0,
          account_locked_until: null,
        });

      logger.info(`Password reset for user: ${decoded.email}`);

      res.json({
        message: "Password reset successfully. You can now log in with your new password.",
      });

    } catch (error) {
      logger.error("Password reset error:", error);
      res.status(400).json({
        error: "Invalid token",
        message: "The reset token is invalid or has expired",
      });
    }
  }

  async getProfile(req, res) {
    try {
      const userId = req.user.userId;

      const user = await knex("users")
        .select([
          "id", "email", "firstname", "lastname", "birthday",
          "user_type", "email_verified", "terms_accepted",
          "charter_accepted", "disabilities", "created_at",
        ])
        .where("id", userId)
        .first();

      if (!user) {
        return res.status(404).json({
          error: "User not found",
          message: "User profile not found",
        });
      }

      res.json({
        user: {
          ...user,
          userType: user.user_type,
          emailVerified: user.email_verified,
          termsAccepted: user.terms_accepted,
          charterAccepted: user.charter_accepted,
          disabilities: user.disabilities ? JSON.parse(user.disabilities) : null,
        },
      });

    } catch (error) {
      logger.error("Get profile error:", error);
      res.status(500).json({
        error: "Failed to retrieve profile",
        message: "An error occurred while retrieving your profile",
      });
    }
  }
}

export default new AuthController();
