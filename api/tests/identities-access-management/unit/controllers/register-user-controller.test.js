import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  registerUserController,
} from "../../../../src/identities-access-management/controllers/register-user-controller.js";
import ERRORS from "../../../../src/identities-access-management/errors.js";

describe("Unit | Identities Access Management | Controller | Register new user", () => {
  let createUserRepository, sendMailActivationService, generatePasswordService, encodedTokenService, res, next;
  beforeEach(() => {
    createUserRepository = vi.fn();
    sendMailActivationService = vi.fn();
    generatePasswordService = vi.fn();
    encodedTokenService = vi.fn();
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnValue(),
      send: vi.fn().mockReturnValue(),
      text: vi.fn().mockReturnValue(),
    };
    next = vi.fn();
  });

  it("should call all method to create a user", async () => {
    // given
    const req = {
      body: {
        firstname: "John",
        lastname: "Doe",
        email: "john.doe@example.net",
        password: "Password",
      },
    };
    createUserRepository.mockResolvedValue(123);
    generatePasswordService.mockResolvedValue("hashedPassword");
    encodedTokenService.mockReturnValue("token");

    // when
    await registerUserController(req, res, next, createUserRepository, sendMailActivationService, generatePasswordService, encodedTokenService);

    // then
    expect(generatePasswordService).toHaveBeenCalledWith(req.body.password);
    expect(createUserRepository).toHaveBeenCalledWith({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      hashedPassword: "hashedPassword",
    });
    expect(sendMailActivationService).toHaveBeenCalledWith({ firstname: req.body.firstname, lastname: req.body.lastname, token: "token", email: req.body.email });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalled();
  });

  describe("error cases", () => {
    it("should call 500 when an error occurred", async () => {
      // given
      const req = {
        body: {
          firstname: "John",
          lastname: "Doe",
          email: "john.doe@example.net",
          password: "Password",
        },
      };
      const error = new Error("Database connection failed");
      createUserRepository.mockRejectedValue(error);

      // when
      await registerUserController(req, res, next, createUserRepository, sendMailActivationService, generatePasswordService, encodedTokenService);

      // then
      expect(encodedTokenService).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: ERRORS.INTERNAL_SERVER_ERROR,
      });
    });
  });
});
