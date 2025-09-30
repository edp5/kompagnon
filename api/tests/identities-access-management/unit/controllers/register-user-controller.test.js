import { describe, expect, it, vi } from "vitest";

import { registerUserController } from "../../../../src/identities-access-management/controllers/register-user-controller.js";

// Mock dependencies
vi.mock("../../../../src/identities-access-management/services/password-service.js", () => ({
  generatePassword: vi.fn().mockResolvedValue("hashedPassword123"),
}));

vi.mock("../../../../src/identities-access-management/services/token-service.js", () => ({
  encodedToken: vi.fn().mockReturnValue("mockToken123"),
}));

vi.mock("../../../../src/identities-access-management/services/email-service.js", () => ({
  sendActivationEmail: vi.fn().mockResolvedValue(),
}));

vi.mock("../../../../src/identities-access-management/repositories/user-repository.js", () => ({
  createUser: vi.fn().mockResolvedValue({
    id: 1,
    firstname: "Test",
    lastname: "User",
    email: "test@example.com",
    isActive: false,
  }),
  findUserByEmail: vi.fn().mockResolvedValue(null),
}));

describe("registerUserController", () => {
  it("should register a user successfully with valid data", async () => {
    const req = {
      body: {
        firstname: "Test",
        lastname: "User",
        email: "test@example.com",
        birthday: "1990-01-01",
        password: "password123",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await registerUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: "User registered successfully. Please check your email to activate your account.",
      data: {
        id: 1,
        firstname: "Test",
        lastname: "User",
        email: "test@example.com",
        isActive: false,
      },
    });
  });

  it("should return validation errors for invalid data", async () => {
    const req = {
      body: {
        firstname: "",
        lastname: "User",
        email: "invalid-email",
        birthday: "invalid-date",
        password: "123",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await registerUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "Validation failed",
      errors: expect.arrayContaining([
        "First name is required",
        "Email format is invalid",
        "Birthday must be in YYYY-MM-DD format",
        "Password must be at least 8 characters long",
      ]),
    });
  });

  it("should return error when user already exists", async () => {
    const { findUserByEmail } = await import("../../../../src/identities-access-management/repositories/user-repository.js");
    findUserByEmail.mockResolvedValueOnce({ id: 1, email: "test@example.com" });

    const req = {
      body: {
        firstname: "Test",
        lastname: "User",
        email: "test@example.com",
        birthday: "1990-01-01",
        password: "password123",
      },
    };

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };

    await registerUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(409);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      message: "User with this email already exists",
    });
  });
});
