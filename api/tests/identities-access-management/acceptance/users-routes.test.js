import request from "supertest";
import { describe, expect, it } from "vitest";

import databaseBuilder from "../../../db/database-builder/index.js";
import server from "../../../server.js";
import { encodedToken } from "../../../src/identities-access-management/services/token-service.js";

describe("GET /api/users/profile", () => {
  it("should return 200 and user profile when token is valid", async () => {
    // given
    const user = await databaseBuilder.factory.buildUser({
      firstname: "Jane",
      lastname: "Doe",
      email: "jane.doe@example.com",
      birthday: "1990-05-15",
      isActive: true,
    });
    const token = encodedToken({ userId: user.id, userType: user.userType });

    // when
    const response = await request(server)
      .get("/api/users/profile")
      .set("Authorization", `Bearer ${token}`);

    // then
    expect(response.status).toBe(200);
    expect(response.body.data).toEqual({
      userId: user.id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      birthday: "1990-05-15",
      role: null,
      genre: null,
      disabilities: null,
    });
  });

  it("should return 401 when authorization header is missing", async () => {
    // when
    const response = await request(server).get("/api/users/profile");

    // then
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: "Authentication required" });
  });
});
