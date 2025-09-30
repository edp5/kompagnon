import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { registerUserController } from "../../../../src/identities-access-management/controllers/register-user-controller.js";
import { knex } from "../../../../db/knex-database-connection.js";
import { generatePassword } from "../../../../src/identities-access-management/services/password-service.js";
import { encodedToken } from "../../../../src/identities-access-management/services/token-service.js";
import { sendMailService } from "../../../../src/shared/services/emails/send-mail-service.js";
import { logger } from "../../../../logger.js";

// Mock dependencies
vi.mock("../../../../db/knex-database-connection.js");
vi.mock("../../../../src/identities-access-management/services/password-service.js");
vi.mock("../../../../src/identities-access-management/services/token-service.js");
vi.mock("../../../../src/shared/services/emails/send-mail-service.js");
vi.mock("../../../../logger.js");

describe("registerUserController", () => {
  let mockReq, mockRes;

  beforeEach(() => {
    mockReq = {
      body: {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        birthday: "1990-01-01",
        password: "password123",
      },
    };

    mockRes = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };

    // Reset all mocks
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("validation", () => {
    it("should return 400 if firstname is missing", async () => {
      mockReq.body.firstname = "";

      await registerUserController(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
        errors: ["First name is required"],
      });
    });

    it("should return 400 if lastname is missing", async () => {
      mockReq.body.lastname = "";

      await registerUserController(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
        errors: ["Last name is required"],
      });
    });

    it("should return 400 if email is missing", async () => {
      mockReq.body.email = "";

      await registerUserController(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
        errors: ["Email is required"],
      });
    });

    it("should return 400 if email format is invalid", async () => {
      mockReq.body.email = "invalid-email";

      await registerUserController(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
        errors: ["Email format is invalid"],
      });
    });

    it("should return 400 if birthday is missing", async () => {
      mockReq.body.birthday = "";

      await registerUserController(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
        errors: ["Birthday is required"],
      });
    });

    it("should return 400 if birthday format is invalid", async () => {
      mockReq.body.birthday = "01/01/1990";

      await registerUserController(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
        errors: ["Birthday must be in YYYY-MM-DD format"],
      });
    });

    it("should return 400 if password is too short", async () => {
      mockReq.body.password = "123";

      await registerUserController(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
        errors: ["Password must be at least 8 characters long"],
      });
    });

    it("should return 400 for multiple validation errors", async () => {
      mockReq.body = {
        firstname: "",
        lastname: "",
        email: "invalid",
        birthday: "invalid",
        password: "123",
      };

      await registerUserController(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Validation failed",
        errors: [
          "First name is required",
          "Last name is required",
          "Email format is invalid",
          "Birthday must be in YYYY-MM-DD format",
          "Password must be at least 8 characters long",
        ],
      });
    });
  });

  describe("user creation", () => {
    beforeEach(() => {
      // Mock successful database operations
      knex.mockReturnValue({
        where: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(null), // No existing user
        }),
        insert: vi.fn().mockReturnValue({
          returning: vi.fn().mockResolvedValue([{
            id: 1,
            firstname: "John",
            lastname: "Doe",
            email: "john.doe@example.com",
            birthday: "1990-01-01",
            isActive: false,
            isChecked: false,
          }]),
        }),
      });

      generatePassword.mockResolvedValue("hashedPassword");
      encodedToken.mockReturnValue("mockToken");
      sendMailService.mockResolvedValue();
    });

    it("should return 409 if user already exists", async () => {
      knex.mockReturnValue({
        where: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue({ id: 1, email: "john.doe@example.com" }),
        }),
      });

      await registerUserController(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "User with this email already exists",
      });
    });

    it("should create user successfully", async () => {
      await registerUserController(mockReq, mockRes);

      expect(generatePassword).toHaveBeenCalledWith("password123");
      expect(knex).toHaveBeenCalledWith("users");
      expect(mockRes.status).toHaveBeenCalledWith(201);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: "User registered successfully. Please check your email to activate your account.",
        data: {
          id: 1,
          firstname: "John",
          lastname: "Doe",
          email: "john.doe@example.com",
          isActive: false,
        },
      });
    });

    it("should send activation email", async () => {
      await registerUserController(mockReq, mockRes);

      expect(encodedToken).toHaveBeenCalledWith({
        userId: 1,
        email: "john.doe@example.com",
        type: "activation",
      });
      expect(sendMailService).toHaveBeenCalledWith({
        to: "john.doe@example.com",
        subject: "Activate your Kompagnon account",
        html: expect.stringContaining("Welcome to Kompagnon!"),
      });
    });

    it("should handle email sending failure gracefully", async () => {
      sendMailService.mockRejectedValue(new Error("Email failed"));

      await registerUserController(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201); // Still success
      expect(logger.error).toHaveBeenCalledWith("Failed to send activation email", expect.any(Error));
    });

    it("should handle database unique constraint violation", async () => {
      const dbError = new Error("Duplicate email");
      dbError.code = "23505";
      dbError.constraint = "users_email_unique";

      knex.mockReturnValue({
        where: vi.fn().mockReturnValue({
          first: vi.fn().mockResolvedValue(null),
        }),
        insert: vi.fn().mockReturnValue({
          returning: vi.fn().mockRejectedValue(dbError),
        }),
      });

      await registerUserController(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(409);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "User with this email already exists",
      });
    });

    it("should handle general database errors", async () => {
      const dbError = new Error("Database connection failed");
      knex.mockReturnValue({
        where: vi.fn().mockReturnValue({
          first: vi.fn().mockRejectedValue(dbError),
        }),
      });

      await registerUserController(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: "Internal server error during registration",
      });
      expect(logger.error).toHaveBeenCalledWith("User registration failed", dbError);
    });

    it("should trim whitespace from input data", async () => {
      mockReq.body = {
        firstname: "  John  ",
        lastname: "  Doe  ",
        email: "  JOHN.DOE@EXAMPLE.COM  ",
        birthday: "1990-01-01",
        password: "password123",
      };

      await registerUserController(mockReq, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(201);
      // Verify that the database insert was called with trimmed values
      const insertCall = knex().insert.mock.calls[0][0];
      expect(insertCall.firstname).toBe("John");
      expect(insertCall.lastname).toBe("Doe");
      expect(insertCall.email).toBe("john.doe@example.com");
    });
  });
});
