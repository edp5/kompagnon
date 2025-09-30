import { generatePassword } from "../services/password-service.js";
import { encodedToken } from "../services/token-service.js";
import { sendMailService } from "../../shared/services/emails/send-mail-service.js";
import { knex } from "../../../db/knex-database-connection.js";
import { logger } from "../../../logger.js";

/**
 * Validates user registration data
 * @param {Object} userData - User registration data
 * @returns {Object} Validation result with isValid and errors
 */
function validateUserData(userData) {
  const errors = [];
  const { firstname, lastname, email, birthday, password } = userData;

  if (!firstname || firstname.trim().length === 0) {
    errors.push("First name is required");
  }

  if (!lastname || lastname.trim().length === 0) {
    errors.push("Last name is required");
  }

  if (!email || email.trim().length === 0) {
    errors.push("Email is required");
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push("Email format is invalid");
  }

  if (!birthday || birthday.trim().length === 0) {
    errors.push("Birthday is required");
  } else {
    // Validate date format (YYYY-MM-DD)
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthday)) {
      errors.push("Birthday must be in YYYY-MM-DD format");
    } else {
      const date = new Date(birthday);
      if (isNaN(date.getTime())) {
        errors.push("Birthday is not a valid date");
      }
    }
  }

  if (!password || password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Controller for user registration
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Promise<void>}
 */
async function registerUserController(req, res) {
  try {
    const { firstname, lastname, email, birthday, password } = req.body;

    // Validate input data
    const validation = validateUserData({ firstname, lastname, email, birthday, password });
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: validation.errors,
      });
    }

    // Check if user already exists
    const existingUser = await knex("users")
      .where({ email: email.trim().toLowerCase() })
      .first();

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await generatePassword(password);

    // Create user in database using Knex directly (as per brief)
    const [newUser] = await knex("users")
      .insert({
        firstname: firstname.trim(),
        lastname: lastname.trim(),
        email: email.trim().toLowerCase(),
        birthday,
        password: hashedPassword,
        isActive: false, // User starts inactive until email activation
        isChecked: false,
        created_at: knex.fn.now(),
        updated_at: knex.fn.now(),
      })
      .returning("*");

    // Generate activation token
    const activationToken = encodedToken({
      userId: newUser.id,
      email: newUser.email,
      type: "activation",
    });

    // Send activation email using existing service
    try {
      const activationUrl = `${process.env.BASE_URL || "http://localhost:5173/#/"}activate?token=${activationToken}`;
      
      await sendMailService({
        to: newUser.email,
        subject: "Activate your Kompagnon account",
        html: `
          <h2>Welcome to Kompagnon!</h2>
          <p>Thank you for registering. Please click the link below to activate your account:</p>
          <a href="${activationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Activate Account</a>
          <p>If the button doesn't work, copy and paste this link into your browser:</p>
          <p>${activationUrl}</p>
          <p>This link will expire in 24 hours.</p>
        `,
      });
    } catch (emailError) {
      logger.error("Failed to send activation email", emailError);
      // Don't fail the registration if email fails, just log it
    }

    // Return success response (don't include sensitive data)
    res.status(201).json({
      success: true,
      message: "User registered successfully. Please check your email to activate your account.",
      data: {
        id: newUser.id,
        firstname: newUser.firstname,
        lastname: newUser.lastname,
        email: newUser.email,
        isActive: newUser.isActive,
      },
    });

    logger.info(`User registered successfully: ${newUser.email}`, { userId: newUser.id });
  } catch (error) {
    logger.error("User registration failed", error);
    
    // Handle unique constraint violation (duplicate email)
    if (error.code === "23505" && error.constraint === "users_email_unique") {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }
    
    res.status(500).json({
      success: false,
      message: "Internal server error during registration",
    });
  }
}

export { registerUserController };
