import { describe, expect, it } from "vitest";

import {
  AlreadyAccepted,
  AlreadyCancelled,
  AlreadyRejected,
} from "../../../../src/journeys/errors.js";
import { checkFoundJourneyStatus } from "../../../../src/journeys/utils/check-found-journey-status.js";
import { JOURNEY_STATUS } from "../../../../src/shared/constants.js";

describe("Unit | Journeys | Utils | Check found journey status", () => {
  it("should throw AlreadyAccepted when status is already accepted and updated to accepted", () => {
    // given
    const params = {
      oupdatedStatus: JOURNEY_STATUS.ACCEPTED,
      updatedStatus: JOURNEY_STATUS.ACCEPTED,
    };

    // when
    function action() {
      return checkFoundJourneyStatus(params);
    }

    // then
    expect(action).toThrow(AlreadyAccepted);
  });

  it("should throw AlreadyCancelled when status is already cancelled and updated to cancelled", () => {
    // given
    const params = {
      oupdatedStatus: JOURNEY_STATUS.CANCELLED,
      updatedStatus: JOURNEY_STATUS.CANCELLED,
    };


    // when
    function action() {
      return checkFoundJourneyStatus(params);
    }

    // then
    expect(action).toThrow(AlreadyCancelled);
  });

  it("should throw AlreadyRejected when status is already rejected and updated to rejected", () => {
    // given
    const params = {
      oupdatedStatus: JOURNEY_STATUS.REJECTED,
      updatedStatus: JOURNEY_STATUS.REJECTED,
    };


    // when
    function action() {
      return checkFoundJourneyStatus(params);
    }

    // then
    expect(action).toThrow(AlreadyRejected);
  });

  it("should throw AlreadyAccepted when current status is accepted and updated to another status", () => {
    // given
    const params = {
      oupdatedStatus: JOURNEY_STATUS.ACCEPTED,
      updatedStatus: JOURNEY_STATUS.REJECTED,
    };


    // when
    function action() {
      return checkFoundJourneyStatus(params);
    }

    // then
    expect(action).toThrow(AlreadyAccepted);
  });

  it("should throw AlreadyCancelled when current status is cancelled and updated to another status", () => {
    // given
    const params = {
      oupdatedStatus: JOURNEY_STATUS.CANCELLED,
      updatedStatus: JOURNEY_STATUS.ACCEPTED,
    };


    // when
    function action() {
      return checkFoundJourneyStatus(params);
    }

    // then
    expect(action).toThrow(AlreadyCancelled);
  });

  it("should throw AlreadyRejected when current status is rejected and updated to another status", () => {
    // given
    const params = {
      oupdatedStatus: JOURNEY_STATUS.REJECTED,
      updatedStatus: JOURNEY_STATUS.ACCEPTED,
    };


    // when
    function action() {
      return checkFoundJourneyStatus(params);
    }

    // then
    expect(action).toThrow(AlreadyRejected);
  });

  it("should not throw when current status is waiting and updated to accepted", () => {
    // given
    const params = {
      oupdatedStatus: JOURNEY_STATUS.WAITING,
      updatedStatus: JOURNEY_STATUS.ACCEPTED,
    };


    // when
    function action() {
      return checkFoundJourneyStatus(params);
    }

    // then
    expect(action).not.toThrow();
  });

  it("should not throw when current status is waiting and updated to rejected", () => {
    // given
    const params = {
      oupdatedStatus: JOURNEY_STATUS.WAITING,
      updatedStatus: JOURNEY_STATUS.REJECTED,
    };


    // when
    function action() {
      return checkFoundJourneyStatus(params);
    }

    // then
    expect(action).not.toThrow();
  });

  it("should not throw when current status is waiting and updated to cancelled", () => {
    // given
    const params = {
      oupdatedStatus: JOURNEY_STATUS.WAITING,
      updatedStatus: JOURNEY_STATUS.CANCELLED,
    };


    // when
    function action() {
      return checkFoundJourneyStatus(params);
    }

    // then
    expect(action).not.toThrow();
  });
});
