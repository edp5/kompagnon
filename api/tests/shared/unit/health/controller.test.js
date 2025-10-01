import { describe, expect, it } from "vitest";

import controller from "../../../../src/shared/health/controller.js";
import { res } from "../../../helpers.js";

describe("Unit | Shared | Health | Controller", () => {
  it("should call res.status and res.send", async () => {
    // given
    const req = {};

    // when
    await controller(req, res);

    // then
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("api is ok!");
  });
});
