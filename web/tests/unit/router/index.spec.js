import { createPinia, setActivePinia } from "pinia";
import { beforeEach, describe, expect, it } from "vitest";

import router from "@/router/index.js";
import { useAuthStore } from "@/stores/auth.js";

describe("Unit | Router", () => {
  beforeEach(async () => {
    localStorage.clear();
    setActivePinia(createPinia());
    await router.push({ name: "login" });
  });

  describe("routes configuration", () => {
    it("should register the root redirect route", () => {
      // when
      const rootRoute = router.getRoutes().find((route) => route.path === "/");

      // then
      expect(rootRoute).toBeDefined();
      expect(rootRoute?.redirect).toEqual({ name: "login" });
    });

    it("should register the login route", () => {
      // when
      const loginRoute = router.getRoutes().find((route) => route.name === "login");

      // then
      expect(loginRoute).toBeDefined();
      expect(loginRoute?.path).toBe("/login");
    });

    it("should register the signup route", () => {
      // when
      const registerRoute = router.getRoutes().find((route) => route.name === "register");

      // then
      expect(registerRoute).toBeDefined();
      expect(registerRoute?.path).toBe("/register");
    });

    it("should register the activate-account route", () => {
      // when
      const activateRoute = router.getRoutes().find((route) => route.name === "activate-account");

      // then
      expect(activateRoute).toBeDefined();
      expect(activateRoute?.path).toBe("/authentication/activate");
    });

    it("should register the home route with requiresAuth on parent", () => {
      // when
      const homeRoute = router.getRoutes().find((route) => route.name === "home");

      // then
      expect(homeRoute).toBeDefined();
      expect(homeRoute?.path).toBe("/home");
      expect(homeRoute?.meta.requiresAuth).toBe(true);
    });

    it("should register the profile route", () => {
      // when
      const profileRoute = router.getRoutes().find((route) => route.name === "profile");

      // then
      expect(profileRoute).toBeDefined();
      expect(profileRoute?.path).toBe("/profile");
      expect(profileRoute?.meta.requiresAuth).toBe(true);
    });

    it("should require authentication for the map route", () => {
      // when
      const mapRoute = router.getRoutes().find((route) => route.name === "map");

      // then
      expect(mapRoute).toBeDefined();
      expect(mapRoute?.path).toBe("/map");
      expect(mapRoute?.meta.requiresAuth).toBe(true);
    });

    it("should require authentication for the connect route", () => {
      // when
      const connectRoute = router.getRoutes().find((route) => route.name === "connect");

      // then
      expect(connectRoute).toBeDefined();
      expect(connectRoute?.path).toBe("/connect");
      expect(connectRoute?.meta.requiresAuth).toBe(true);
    });

    it("should require authentication for the notifications route", () => {
      // when
      const notificationsRoute = router.getRoutes().find((route) => route.name === "notifications");

      // then
      expect(notificationsRoute).toBeDefined();
      expect(notificationsRoute?.path).toBe("/notifications");
      expect(notificationsRoute?.meta.requiresAuth).toBe(true);
    });

    it("should require authentication for the settings route", () => {
      // when
      const settingsRoute = router.getRoutes().find((route) => route.name === "settings");

      // then
      expect(settingsRoute).toBeDefined();
      expect(settingsRoute?.path).toBe("/settings");
      expect(settingsRoute?.meta.requiresAuth).toBe(true);
    });

    it("should require authentication for the support route", () => {
      // when
      const supportRoute = router.getRoutes().find((route) => route.name === "support");

      // then
      expect(supportRoute).toBeDefined();
      expect(supportRoute?.path).toBe("/support");
      expect(supportRoute?.meta.requiresAuth).toBe(true);
    });

    it("should require authentication for the privacy route", () => {
      // when
      const privacyRoute = router.getRoutes().find((route) => route.name === "privacy");

      // then
      expect(privacyRoute).toBeDefined();
      expect(privacyRoute?.path).toBe("/privacy");
      expect(privacyRoute?.meta.requiresAuth).toBe(true);
    });
  });

  describe("router configuration", () => {
    it("should create a router instance", () => {
      // then
      expect(router).toBeDefined();
      expect(router.options).toBeDefined();
    });

    it("should use web hash history", () => {
      // then
      expect(router.options.history).toBeDefined();
      expect(router.options.history.base).toBeDefined();
    });

    it("should have correct router methods", () => {
      // then
      expect(typeof router.push).toBe("function");
      expect(typeof router.replace).toBe("function");
      expect(typeof router.go).toBe("function");
      expect(typeof router.back).toBe("function");
      expect(typeof router.forward).toBe("function");
    });
  });

  describe("dynamic route management", () => {
    it("should be able to add routes dynamically", () => {
      // given
      const initialRouteCount = router.getRoutes().length;
      const testRoute = {
        path: "/test",
        name: "test",
        component: { template: "<div>Test</div>" },
      };

      // when
      router.addRoute(testRoute);

      // then
      expect(router.hasRoute("test")).toBe(true);
      expect(router.getRoutes()).toHaveLength(initialRouteCount + 1);

      // cleanup
      router.removeRoute("test");
    });

    it("should handle route resolution", () => {
      // given
      const testRoute = {
        path: "/test/:id",
        name: "testWithParam",
        component: { template: "<div>Test</div>" },
      };

      // when
      router.addRoute(testRoute);
      const resolved = router.resolve({ name: "testWithParam", params: { id: "123" } });

      // then
      expect(resolved.name).toBe("testWithParam");
      expect(resolved.params.id).toBe("123");
      expect(resolved.path).toBe("/test/123");

      // cleanup
      router.removeRoute("testWithParam");
    });
  });

  describe("authentication guard", () => {
    it("should allow navigation to routes without requiresAuth", async () => {
      // when
      await router.push({ name: "login" });

      // then
      expect(router.currentRoute.value.name).toBe("login");
    });

    it("should allow navigation to register route without authentication", async () => {
      // when
      await router.push({ name: "register" });

      // then
      expect(router.currentRoute.value.name).toBe("register");
    });

    it("should allow navigation to activate-account route without authentication", async () => {
      // when
      await router.push({ name: "activate-account" });

      // then
      expect(router.currentRoute.value.name).toBe("activate-account");
    });

    it("should redirect unauthenticated users from protected routes to login", async () => {
      // when
      await router.push({ name: "profile" });

      // then
      expect(router.currentRoute.value.name).toBe("login");
      expect(router.currentRoute.value.query.redirect).toBe("/profile");
    });

    it("should redirect unauthenticated users from map route to login with redirect", async () => {
      // when
      await router.push({ name: "map" });

      // then
      expect(router.currentRoute.value.name).toBe("login");
      expect(router.currentRoute.value.query.redirect).toBe("/map");
    });

    it("should redirect unauthenticated users from notifications route to login with redirect", async () => {
      // when
      await router.push({ name: "notifications" });

      // then
      expect(router.currentRoute.value.name).toBe("login");
      expect(router.currentRoute.value.query.redirect).toBe("/notifications");
    });

    it("should allow authenticated users to access protected routes", async () => {
      // given
      const authStore = useAuthStore();
      authStore.setAuth("jwt-token", 1);

      // when
      await router.push({ name: "profile" });

      // then
      expect(router.currentRoute.value.name).toBe("profile");
    });

    it("should allow authenticated users to access home route", async () => {
      // given
      const authStore = useAuthStore();
      authStore.setAuth("jwt-token", 1);

      // when
      await router.push({ name: "home" });

      // then
      expect(router.currentRoute.value.name).toBe("home");
    });

    it("should allow authenticated users to access map route", async () => {
      // given
      const authStore = useAuthStore();
      authStore.setAuth("jwt-token", 1);

      // when
      await router.push({ name: "map" });

      // then
      expect(router.currentRoute.value.name).toBe("map");
    });

    it("should allow authenticated users to access connect route", async () => {
      // given
      const authStore = useAuthStore();
      authStore.setAuth("jwt-token", 1);

      // when
      await router.push({ name: "connect" });

      // then
      expect(router.currentRoute.value.name).toBe("connect");
    });

    it("should allow authenticated users to access notifications route", async () => {
      // given
      const authStore = useAuthStore();
      authStore.setAuth("jwt-token", 1);

      // when
      await router.push({ name: "notifications" });

      // then
      expect(router.currentRoute.value.name).toBe("notifications");
    });

    it("should allow authenticated users to access settings route", async () => {
      // given
      const authStore = useAuthStore();
      authStore.setAuth("jwt-token", 1);

      // when
      await router.push({ name: "settings" });

      // then
      expect(router.currentRoute.value.name).toBe("settings");
    });

    it("should allow authenticated users to access support route", async () => {
      // given
      const authStore = useAuthStore();
      authStore.setAuth("jwt-token", 1);

      // when
      await router.push({ name: "support" });

      // then
      expect(router.currentRoute.value.name).toBe("support");
    });

    it("should allow authenticated users to access privacy route", async () => {
      // given
      const authStore = useAuthStore();
      authStore.setAuth("jwt-token", 1);

      // when
      await router.push({ name: "privacy" });

      // then
      expect(router.currentRoute.value.name).toBe("privacy");
    });
  });
});
