import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import { useAuthStore } from "@/stores/auth.js";

describe("Unit | Stores | Auth", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it("should initialize with null token and userId", () => {
    const store = useAuthStore();
    expect(store.token).toBeNull();
    expect(store.userId).toBeNull();
  });

  describe("#setAuth", () => {
    it("should set token and userId", () => {
      const store = useAuthStore();
      store.setAuth("jwt-token", 42);
      expect(store.token).toBe("jwt-token");
      expect(store.userId).toBe(42);
    });
  });

  describe("#logout", () => {
    it("should clear token and userId", () => {
      const store = useAuthStore();
      store.setAuth("jwt-token", 42);
      store.logout();
      expect(store.token).toBeNull();
      expect(store.userId).toBeNull();
    });
  });
});
