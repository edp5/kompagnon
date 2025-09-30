import { logger } from "../../../logger.js";
import { createUser, findUserByEmail } from "../repositories/user-repository.js";
import { sendActivationEmail } from "../services/email-service.js";
import { generatePassword } from "../services/password-service.js";
import { encodedToken } from "../services/token-service.js";

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
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "User with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await generatePassword(password);

    // Create user in database
    const userData = {
      firstname: firstname.trim(),
      lastname: lastname.trim(),
      email: email.trim().toLowerCase(),
      birthday,
      password: hashedPassword,
    };

    const newUser = await createUser(userData);

    // Generate activation token
    const activationToken = encodedToken({
      userId: newUser.id,
      email: newUser.email,
      type: "activation",
    });

    // Send activation email
    try {
      await sendActivationEmail(newUser.email, activationToken);
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

    if (error.message === "Email already exists") {
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
