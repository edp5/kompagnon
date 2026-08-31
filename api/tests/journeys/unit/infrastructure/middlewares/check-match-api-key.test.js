import { beforeEach, describe, expect, it, vi } from "vitest";

import { config } from "../../../../../config.js";
import { InvalidNotifyApiKeyError } from "../../../../../src/journeys/errors.js";
import { checkMatchApiKey } from "../../../../../src/journeys/infrastructure/middlewares/check-match-api-key.js";

describe("Unit | Journeys | Infrastructure | middlewares | Check match api key", () => {
  let res, next;
  beforeEach(() => {
    res = vi.fn();
    next = vi.fn();
  });

  it("should call next without params if apiKey is correct", async () => {
    // given
    config.algorithm.apiKey = "someApiKey";
    const req = { headers: { "x-api-key": "someApiKey" } };

    // when
    await checkMatchApiKey(req, res, next);

    // then
    expect(next).toHaveBeenCalledWith();
  });

  it("should Throw an error if apiKeys are different", async () => {
    // given
    config.algorithm.apiKey = "fake";
    const req = { headers: { "x-api-key": "someApiKey" } };

    // when
    await checkMatchApiKey(req, res, next);

    // then
    expect(next).toHaveBeenCalledWith(new InvalidNotifyApiKeyError());
  });

  it("should throw an error if ALGORITHM_API_KEY is empty", async () => {
    // given
    config.algorithm.apiKey = "";
    const req = { headers: { "x-api-key": "" } };

    // when
    await checkMatchApiKey(req, res, next);

    // then
    expect(next).toHaveBeenCalledWith(new InvalidNotifyApiKeyError());
  });

  it("should throw an error if ALGORITHM_API_KEY is undefined", async () => {
    // given
    config.algorithm.apiKey = undefined;
    const req = { headers: { "x-api-key": "someApiKey" } };

    // when
    await checkMatchApiKey(req, res, next);

    // then
    expect(next).toHaveBeenCalledWith(new InvalidNotifyApiKeyError());
  });

  it("should throw an error if ALGORITHM_API_KEY is undefined and no header is sent", async () => {
    // given
    config.algorithm.apiKey = undefined;
    const req = { headers: {} };

    // when
    await checkMatchApiKey(req, res, next);

    // then
    expect(next).toHaveBeenCalledWith(new InvalidNotifyApiKeyError());
  });
});
