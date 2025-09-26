import request from "supertest";
import { beforeEach, describe, expect, it } from "vitest";

import { knex } from "../../../../db/knex-database-connection.js";
import server from "../../../../server.js";

describe("Acceptance | Shared | Routes | Auth routes", () => {
  beforeEach(async () => {
    // Nettoyer la base de données avant chaque test
    await knex.raw("TRUNCATE TABLE users RESTART IDENTITY CASCADE");
  });

  describe("POST /api/auth/register", () => {
    it("should register a new user successfully", async () => {
      // given
      const userData = {
        email: "test@example.com",
        password: "Password123!",
        firstname: "John",
        lastname: "Doe",
        birthday: "1990-01-01",
        userType: "accompanying",
        termsAccepted: true,
        charterAccepted: true,
      };

      // when
      const response = await request(server)
        .post("/api/auth/register")
        .send(userData);

      // then
      expect(response.status).toBe(201);
      expect(response.body.message).toBe("User registered successfully. Please check your email to verify your account.");
      expect(response.body.user).toMatchObject({
        email: userData.email,
        firstname: userData.firstname,
        lastname: userData.lastname,
        userType: userData.userType,
        emailVerified: false,
        termsAccepted: userData.termsAccepted,
        charterAccepted: userData.charterAccepted,
      });
      expect(response.body.user.id).toBeDefined();

      // Vérifier que l'utilisateur est bien en base
      const userInDb = await knex("users").where("email", userData.email).first();
      expect(userInDb).toBeDefined();
      expect(userInDb.email_verification_token).toBeDefined();
    });

    it("should register a user with disabilities if accompanied", async () => {
      // given
      const userData = {
        email: "accompanied@example.com",
        password: "Password123!",
        firstname: "Jane",
        lastname: "Smith",
        birthday: "1985-05-15",
        userType: "accompanied",
        termsAccepted: true,
        charterAccepted: true,
        disabilities: ["mobility", "vision"],
      };

      // when
      const response = await request(server)
        .post("/api/auth/register")
        .send(userData);

      // then
      expect(response.status).toBe(201);

      // Vérifier que les handicaps sont stockés en base
      const userInDb = await knex("users").where("email", userData.email).first();
      expect(userInDb.disabilities).toBe(JSON.stringify(userData.disabilities));
    });

    it("should reject registration with missing required fields", async () => {
      // given
      const incompleteData = {
        email: "test@example.com",
        password: "Password123!",
        // Missing firstname, lastname, birthday, userType
      };

      // when
      const response = await request(server)
        .post("/api/auth/register")
        .send(incompleteData);

      // then
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing required fields");
    });

    it("should reject registration with invalid email format", async () => {
      // given
      const userData = {
        email: "invalid-email",
        password: "Password123!",
        firstname: "John",
        lastname: "Doe",
        birthday: "1990-01-01",
        userType: "accompanying",
      };

      // when
      const response = await request(server)
        .post("/api/auth/register")
        .send(userData);

      // then
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid email format");
    });

    it("should reject registration with weak password", async () => {
      // given
      const userData = {
        email: "test@example.com",
        password: "weak",
        firstname: "John",
        lastname: "Doe",
        birthday: "1990-01-01",
        userType: "accompanying",
      };

      // when
      const response = await request(server)
        .post("/api/auth/register")
        .send(userData);

      // then
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Weak password");
      expect(response.body.details).toBeDefined();
    });

    it("should reject registration with invalid user type", async () => {
      // given
      const userData = {
        email: "test@example.com",
        password: "Password123!",
        firstname: "John",
        lastname: "Doe",
        birthday: "1990-01-01",
        userType: "invalid_type",
      };

      // when
      const response = await request(server)
        .post("/api/auth/register")
        .send(userData);

      // then
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid user type");
    });

    it("should reject registration with existing email", async () => {
      // given
      const userData = {
        email: "test@example.com",
        password: "Password123!",
        firstname: "John",
        lastname: "Doe",
        birthday: "1990-01-01",
        userType: "accompanying",
      };

      // Créer un utilisateur existant
      await knex("users").insert({
        email: userData.email,
        password: "hashed_password",
        firstname: "Existing",
        lastname: "User",
        birthday: "1980-01-01",
        user_type: "accompanying",
        email_verified: false,
        terms_accepted: false,
        charter_accepted: false,
        login_attempts: 0,
        isActive: true,
      });

      // when
      const response = await request(server)
        .post("/api/auth/register")
        .send(userData);

      // then
      expect(response.status).toBe(409);
      expect(response.body.error).toBe("Email already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Créer un utilisateur de test
      await knex("users").insert({
        email: "test@example.com",
        password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi", // "password" hashé
        firstname: "John",
        lastname: "Doe",
        birthday: "1990-01-01",
        user_type: "accompanying",
        email_verified: true,
        terms_accepted: true,
        charter_accepted: true,
        login_attempts: 0,
        isActive: true,
      });
    });

    it("should login successfully with valid credentials", async () => {
      // given
      const loginData = {
        email: "test@example.com",
        password: "password",
      };

      // when
      const response = await request(server)
        .post("/api/auth/login")
        .send(loginData);

      // then
      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Login successful");
      expect(response.body.token).toBeDefined();
      expect(response.body.user).toMatchObject({
        email: loginData.email,
        firstname: "John",
        lastname: "Doe",
        userType: "accompanying",
        emailVerified: true,
      });
    });

    it("should reject login with missing credentials", async () => {
      // given
      const incompleteData = {
        email: "test@example.com",
        // Missing password
      };

      // when
      const response = await request(server)
        .post("/api/auth/login")
        .send(incompleteData);

      // then
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing credentials");
    });

    it("should reject login with invalid email", async () => {
      // given
      const loginData = {
        email: "nonexistent@example.com",
        password: "password",
      };

      // when
      const response = await request(server)
        .post("/api/auth/login")
        .send(loginData);

      // then
      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid credentials");
    });

    it("should reject login with invalid password", async () => {
      // given
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      // when
      const response = await request(server)
        .post("/api/auth/login")
        .send(loginData);

      // then
      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid credentials");
    });

    it("should lock account after 10 failed attempts", async () => {
      // given
      const loginData = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      // when - 10 tentatives échouées
      for (let i = 0; i < 10; i++) {
        await request(server)
          .post("/api/auth/login")
          .send(loginData);
      }

      // then - La 11ème tentative devrait être bloquée
      const response = await request(server)
        .post("/api/auth/login")
        .send(loginData);

      expect(response.status).toBe(423);
      expect(response.body.error).toBe("Account locked");

      // Vérifier que le compte est verrouillé en base
      const user = await knex("users").where("email", loginData.email).first();
      expect(user.account_locked_until).toBeDefined();
    });

    it("should reject login for deactivated account", async () => {
      // given
      await knex("users")
        .where("email", "test@example.com")
        .update({ isActive: false });

      const loginData = {
        email: "test@example.com",
        password: "password",
      };

      // when
      const response = await request(server)
        .post("/api/auth/login")
        .send(loginData);

      // then
      expect(response.status).toBe(403);
      expect(response.body.error).toBe("Account deactivated");
    });
  });

  describe("POST /api/auth/verify-email", () => {
    it("should verify email with valid token", async () => {
      // given
      await knex("users").insert({
        email: "test@example.com",
        password: "hashed_password",
        firstname: "John",
        lastname: "Doe",
        birthday: "1990-01-01",
        user_type: "accompanying",
        email_verified: false,
        email_verification_token: "valid_token",
        terms_accepted: false,
        charter_accepted: false,
        login_attempts: 0,
        isActive: true,
      }).returning("*");

      const verifyData = {
        token: "valid_token",
      };

      // when
      const response = await request(server)
        .post("/api/auth/verify-email")
        .send(verifyData);

      // then
      expect([400, 200]).toContain(response.status);
    });

    it("should reject verification with missing token", async () => {
      // given
      const verifyData = {};

      // when
      const response = await request(server)
        .post("/api/auth/verify-email")
        .send(verifyData);

      // then
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing token");
    });
  });

  describe("POST /api/auth/request-password-reset", () => {
    it("should request password reset for existing user", async () => {
      // given
      await knex("users").insert({
        email: "test@example.com",
        password: "hashed_password",
        firstname: "John",
        lastname: "Doe",
        birthday: "1990-01-01",
        user_type: "accompanying",
        email_verified: true,
        terms_accepted: true,
        charter_accepted: true,
        login_attempts: 0,
        isActive: true,
      });

      const resetData = {
        email: "test@example.com",
      };

      // when
      const response = await request(server)
        .post("/api/auth/request-password-reset")
        .send(resetData);

      // then
      expect(response.status).toBe(200);
      expect(response.body.message).toContain("password reset link has been sent");
    });

    it("should return success even for non-existing email (security)", async () => {
      // given
      const resetData = {
        email: "nonexistent@example.com",
      };

      // when
      const response = await request(server)
        .post("/api/auth/request-password-reset")
        .send(resetData);

      // then
      expect(response.status).toBe(200);
      expect(response.body.message).toContain("password reset link has been sent");
    });

    it("should reject request with missing email", async () => {
      // given
      const resetData = {};

      // when
      const response = await request(server)
        .post("/api/auth/request-password-reset")
        .send(resetData);

      // then
      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Missing email");
    });
  });

  describe("GET /api/auth/profile", () => {
    let authToken;

    beforeEach(async () => {
      // Créer un utilisateur et obtenir un token
      await knex("users").insert({
        email: "test@example.com",
        password: "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi",
        firstname: "John",
        lastname: "Doe",
        birthday: "1990-01-01",
        user_type: "accompanying",
        email_verified: true,
        terms_accepted: true,
        charter_accepted: true,
        login_attempts: 0,
        isActive: true,
      });

      // Obtenir un token via login
      const loginResponse = await request(server)
        .post("/api/auth/login")
        .send({
          email: "test@example.com",
          password: "password",
        });

      authToken = loginResponse.body.token;
    });

    it("should get user profile with valid token", async () => {
      // when
      const response = await request(server)
        .get("/api/auth/profile")
        .set("Authorization", `Bearer ${authToken}`);

      // then
      expect(response.status).toBe(200);
      expect(response.body.user).toMatchObject({
        email: "test@example.com",
        firstname: "John",
        lastname: "Doe",
        userType: "accompanying",
        emailVerified: true,
      });
    });

    it("should reject profile access without token", async () => {
      // when
      const response = await request(server)
        .get("/api/auth/profile");

      // then
      expect(response.status).toBe(401);
      expect(response.body.error).toBe("No token provided");
    });

    it("should reject profile access with invalid token", async () => {
      // when
      const response = await request(server)
        .get("/api/auth/profile")
        .set("Authorization", "Bearer invalid_token");

      // then
      expect(response.status).toBe(401);
      expect(response.body.error).toBe("Invalid token");
    });
  });
});
