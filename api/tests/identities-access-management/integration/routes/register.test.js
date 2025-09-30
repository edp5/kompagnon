import { describe, it, expect, beforeEach, afterEach } from "vitest";
import request from "supertest";
import server from "../../../../server.js";
import { knex } from "../../../../db/knex-database-connection.js";
import { sendMailService } from "../../../../src/shared/services/emails/send-mail-service.js";

// Mock email service to prevent actual emails
import { vi } from "vitest";
vi.mock("../../../../src/shared/services/emails/send-mail-service.js");

describe("POST /api/authentication/register", () => {
  beforeEach(async () => {
    // Clean up users table before each test
    await knex("users").del();
    
    // Mock email service
    sendMailService.mockResolvedValue();
  });

  afterEach(async () => {
    // Clean up after each test
    await knex("users").del();
  });

  describe("successful registration", () => {
    it("should register a new user successfully", async () => {
      const userData = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        birthday: "1990-01-01",
        password: "password123",
      };

      const response = await request(server)
        .post("/api/authentication/register")
        .send(userData)
        .expect(201);

      expect(response.body).toEqual({
        success: true,
        message: "User registered successfully. Please check your email to activate your account.",
        data: {
          id: expect.any(Number),
          firstname: "John",
          lastname: "Doe",
          email: "john.doe@example.com",
          isActive: false,
        },
      });

      // Verify user was created in database
      const users = await knex("users").where({ email: "john.doe@example.com" });
      expect(users).toHaveLength(1);
      expect(users[0]).toMatchObject({
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        birthday: "1990-01-01",
        isActive: false,
        isChecked: false,
      });
      expect(users[0].password).toBeDefined();
      expect(users[0].password).not.toBe("password123"); // Should be hashed

      // Verify email was sent
      expect(sendMailService).toHaveBeenCalledWith({
        to: "john.doe@example.com",
        subject: "Activate your Kompagnon account",
        html: expect.stringContaining("Welcome to Kompagnon!"),
      });
    });

    it("should handle email with different cases", async () => {
      const userData = {
        firstname: "Jane",
        lastname: "Smith",
        email: "JANE.SMITH@EXAMPLE.COM",
        birthday: "1985-05-15",
        password: "securePassword123",
      };

      const response = await request(server)
        .post("/api/authentication/register")
        .send(userData)
        .expect(201);

      expect(response.body.data.email).toBe("jane.smith@example.com"); // Should be lowercase

      // Verify user was stored with lowercase email
      const users = await knex("users").where({ email: "jane.smith@example.com" });
      expect(users).toHaveLength(1);
    });

    it("should trim whitespace from input data", async () => {
      const userData = {
        firstname: "  John  ",
        lastname: "  Doe  ",
        email: "  john.doe@example.com  ",
        birthday: "1990-01-01",
        password: "password123",
      };

      const response = await request(server)
        .post("/api/authentication/register")
        .send(userData);

      if (response.status !== 201) {
        console.log("Response status:", response.status);
        console.log("Response body:", response.body);
      }

      expect(response.status).toBe(201);
      expect(response.body.data).toMatchObject({
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
      });

      // Verify trimmed data in database
      const users = await knex("users").where({ email: "john.doe@example.com" });
      expect(users[0]).toMatchObject({
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
      });
    });
  });

  describe("validation errors", () => {
    it("should return 400 for missing firstname", async () => {
      const userData = {
        lastname: "Doe",
        email: "john.doe@example.com",
        birthday: "1990-01-01",
        password: "password123",
      };

      const response = await request(server)
        .post("/api/authentication/register")
        .send(userData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: "Validation failed",
        errors: ["First name is required"],
      });
    });

    it("should return 400 for missing lastname", async () => {
      const userData = {
        firstname: "John",
        email: "john.doe@example.com",
        birthday: "1990-01-01",
        password: "password123",
      };

      const response = await request(server)
        .post("/api/authentication/register")
        .send(userData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: "Validation failed",
        errors: ["Last name is required"],
      });
    });

    it("should return 400 for invalid email format", async () => {
      const userData = {
        firstname: "John",
        lastname: "Doe",
        email: "invalid-email",
        birthday: "1990-01-01",
        password: "password123",
      };

      const response = await request(server)
        .post("/api/authentication/register")
        .send(userData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: "Validation failed",
        errors: ["Email format is invalid"],
      });
    });

    it("should return 400 for invalid birthday format", async () => {
      const userData = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        birthday: "01/01/1990",
        password: "password123",
      };

      const response = await request(server)
        .post("/api/authentication/register")
        .send(userData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: "Validation failed",
        errors: ["Birthday must be in YYYY-MM-DD format"],
      });
    });

    it("should return 400 for short password", async () => {
      const userData = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        birthday: "1990-01-01",
        password: "123",
      };

      const response = await request(server)
        .post("/api/authentication/register")
        .send(userData)
        .expect(400);

      expect(response.body).toEqual({
        success: false,
        message: "Validation failed",
        errors: ["Password must be at least 8 characters long"],
      });
    });

    it("should return 400 for multiple validation errors", async () => {
      const userData = {
        firstname: "",
        lastname: "",
        email: "invalid",
        birthday: "invalid",
        password: "123",
      };

      const response = await request(server)
        .post("/api/authentication/register")
        .send(userData)
        .expect(400);

      expect(response.body.errors).toHaveLength(5);
      expect(response.body.errors).toContain("First name is required");
      expect(response.body.errors).toContain("Last name is required");
      expect(response.body.errors).toContain("Email format is invalid");
      expect(response.body.errors).toContain("Birthday must be in YYYY-MM-DD format");
      expect(response.body.errors).toContain("Password must be at least 8 characters long");
    });
  });

  describe("duplicate email handling", () => {
    beforeEach(async () => {
      // Create an existing user
      await knex("users").insert({
        firstname: "Existing",
        lastname: "User",
        email: "existing@example.com",
        birthday: "1980-01-01",
        password: "hashedPassword",
        isActive: true,
        isChecked: true,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });

    it("should return 409 for duplicate email", async () => {
      const userData = {
        firstname: "John",
        lastname: "Doe",
        email: "existing@example.com",
        birthday: "1990-01-01",
        password: "password123",
      };

      const response = await request(server)
        .post("/api/authentication/register")
        .send(userData)
        .expect(409);

      expect(response.body).toEqual({
        success: false,
        message: "User with this email already exists",
      });

      // Verify no new user was created
      const users = await knex("users").where({ email: "existing@example.com" });
      expect(users).toHaveLength(1);
      expect(users[0].firstname).toBe("Existing");
    });

    it("should return 409 for duplicate email with different case", async () => {
      const userData = {
        firstname: "John",
        lastname: "Doe",
        email: "EXISTING@EXAMPLE.COM",
        birthday: "1990-01-01",
        password: "password123",
      };

      const response = await request(server)
        .post("/api/authentication/register")
        .send(userData)
        .expect(409);

      expect(response.body).toEqual({
        success: false,
        message: "User with this email already exists",
      });
    });
  });

  describe("email service failure", () => {
    it("should still register user if email sending fails", async () => {
      // Mock email service to fail
      sendMailService.mockRejectedValue(new Error("Email service unavailable"));

      const userData = {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.com",
        birthday: "1990-01-01",
        password: "password123",
      };

      const response = await request(server)
        .post("/api/authentication/register")
        .send(userData)
        .expect(201);

      expect(response.body.success).toBe(true);

      // Verify user was still created
      const users = await knex("users").where({ email: "john.doe@example.com" });
      expect(users).toHaveLength(1);
    });
  });

  describe("edge cases", () => {
    it("should handle empty request body", async () => {
      const response = await request(server)
        .post("/api/authentication/register")
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe("Validation failed");
    });

    it("should handle null values", async () => {
      const userData = {
        firstname: null,
        lastname: null,
        email: null,
        birthday: null,
        password: null,
      };

      const response = await request(server)
        .post("/api/authentication/register")
        .send(userData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.errors.length).toBeGreaterThan(0);
    });

    it("should handle very long input values", async () => {
      const longString = "a".repeat(1000);
      const userData = {
        firstname: longString,
        lastname: longString,
        email: "test@example.com",
        birthday: "1990-01-01",
        password: "password123",
      };

      const response = await request(server)
        .post("/api/authentication/register")
        .send(userData);

      if (response.status !== 201) {
        console.log("Response status:", response.status);
        console.log("Response body:", response.body);
      }

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });
  });
});
