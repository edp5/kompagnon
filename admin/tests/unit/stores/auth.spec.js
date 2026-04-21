import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import { useAuthStore } from "@/stores/auth.js";

describe("Unit | Stores | Auth", () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    localStorage.clear();
  });

  it("should initialize with null token and userId when localStorage is empty", () => {
    const store = useAuthStore();
    expect(store.token).toBeNull();
    expect(store.userId).toBeNull();
  });

  it("should restore token and userId from localStorage on init", () => {
    localStorage.setItem("auth_token", "persisted-token");
    localStorage.setItem("auth_user_id", "99");
    setActivePinia(createPinia());
    const store = useAuthStore();
    expect(store.token).toBe("persisted-token");
    expect(store.userId).toBe(99);
  });

  describe("#setAuth", () => {
    it("should set token and userId in state and localStorage", () => {
      const store = useAuthStore();
      store.setAuth("jwt-token", 42);
      expect(store.token).toBe("jwt-token");
      expect(store.userId).toBe(42);
      expect(localStorage.getItem("auth_token")).toBe("jwt-token");
      expect(localStorage.getItem("auth_user_id")).toBe("42");
    });
  });

  describe("#logout", () => {
    it("should clear token and userId from state and localStorage", () => {
      const store = useAuthStore();
      store.setAuth("jwt-token", 42);
      store.logout();
      expect(store.token).toBeNull();
      expect(store.userId).toBeNull();
      expect(localStorage.getItem("auth_token")).toBeNull();
      expect(localStorage.getItem("auth_user_id")).toBeNull();
    });
  });
});
