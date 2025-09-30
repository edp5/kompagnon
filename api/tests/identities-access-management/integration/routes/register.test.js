import { describe, expect, it } from "vitest";
import request from "supertest";

import server from "../../../../server.js";

describe("POST /api/authentication/register", () => {
  it("should register a new user successfully", async () => {
    const userData = {
      firstname: "Integration",
      lastname: "Test",
      email: "integration@example.com",
      birthday: "1990-01-01",
      password: "password123",
    };

    const response = await request(server)
      .post("/api/authentication/register")
      .send(userData)
      .expect(201);

    expect(response.body).toMatchObject({
      success: true,
      message: "User registered successfully. Please check your email to activate your account.",
      data: {
        firstname: "Integration",
        lastname: "Test",
        email: "integration@example.com",
        isActive: false,
      },
    });
    expect(response.body.data.id).toBeDefined();
  });

  it("should return validation errors for invalid data", async () => {
    const invalidData = {
      firstname: "",
      lastname: "Test",
      email: "invalid-email",
      birthday: "invalid-date",
      password: "123",
    };

    const response = await request(server)
      .post("/api/authentication/register")
      .send(invalidData)
      .expect(400);

    expect(response.body).toMatchObject({
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

  it("should return error for duplicate email", async () => {
    const userData = {
      firstname: "Duplicate",
      lastname: "User",
      email: "duplicate@example.com",
      birthday: "1990-01-01",
      password: "password123",
    };

    // First registration
    await request(server)
      .post("/api/authentication/register")
      .send(userData)
      .expect(201);

    // Second registration with same email
    const response = await request(server)
      .post("/api/authentication/register")
      .send(userData)
      .expect(409);

    expect(response.body).toMatchObject({
      success: false,
      message: "User with this email already exists",
    });
  });
});
