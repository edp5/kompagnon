import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  registerUserController,
} from "../../../../src/identities-access-management/controllers/register-user-controller.js";
import ERRORS from "../../../../src/identities-access-management/errors.js";

describe("Unit | Identities Access Management | Controller | Register new user", () => {
  let createUserRepository, findUserRepository, sendMailActivationService, generatePasswordService, encodedTokenService, res;
  beforeEach(() => {
    createUserRepository = vi.fn();
    findUserRepository = vi.fn();
    sendMailActivationService = vi.fn();
    generatePasswordService = vi.fn();
    encodedTokenService = vi.fn();
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnValue(),
      send: vi.fn().mockReturnValue(),
      text: vi.fn().mockReturnValue(),
    };
  });

  it("should call all method to create a user", async () => {
    // given
    const req = {
      body: {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.net",
        password: "Password",
        userType: "admin",
      },
    };
    createUserRepository.mockResolvedValue(123);
    generatePasswordService.mockResolvedValue("hashedPassword");
    encodedTokenService.mockReturnValue("token");

    // when
    await registerUserController(req, res, createUserRepository, findUserRepository, sendMailActivationService, generatePasswordService, encodedTokenService);

    // then
    expect(findUserRepository).toHaveBeenCalledWith(req.body.email);
    expect(generatePasswordService).toHaveBeenCalledWith(req.body.password);
    expect(createUserRepository).toHaveBeenCalledWith({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      hashedPassword: "hashedPassword",
      userType: req.body.userType,
    });
    expect(sendMailActivationService).toHaveBeenCalledWith({ firstname: req.body.firstname, lastname: req.body.lastname, token: "token", email: req.body.email });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalled();
  });

  describe("error cases", () => {
    it("should call 400 status when user already exists", async () => {
      // given
      const req = {
        body: {
          firstname: "John",
          lastname: "Doe",
          email: "john.doe@example.net",
          password: "Password",
          userType: "admin",
        },
      };
      findUserRepository.mockResolvedValue({
        id: 1,
        email: req.body.email,
      });

      // when
      await registerUserController(req, res, createUserRepository, findUserRepository, sendMailActivationService, generatePasswordService);

      // then
      expect(findUserRepository).toHaveBeenCalledWith(req.body.email);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: ERRORS.USER.ALREADYEXISTS });
    });

    it("should call 500 when an error occurred", async () => {
      // given
      const req = {
        body: {
          firstname: "John",
          lastname: "Doe",
          email: "john.doe@example.net",
          password: "Password",
          userType: "admin",
        },
      };
      const error = new Error("Database connection failed");
      findUserRepository.mockRejectedValue(error);

      // when
      await registerUserController(req, res, createUserRepository, findUserRepository, sendMailActivationService, generatePasswordService);

      // then
      expect(findUserRepository).toHaveBeenCalledWith(req.body.email);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: ERRORS.INTERNAL_SERVER_ERROR,
      });
      expect(createUserRepository).not.toHaveBeenCalled();
    });
  });
});
