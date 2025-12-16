import { describe, expect, it } from "vitest";

import router from "@/router/index.js";

describe("Unit | Router", () => {
  describe("routes configuration", () => {
    it("should register the root redirect route", () => {
      // when
      const rootRoute = router.getRoutes().find((route) => route.path === "/");

      // then
      expect(rootRoute).toBeDefined();
      // TODO: update redirect to login route once it exists.
      expect(rootRoute?.redirect).toEqual({ name: "register" });
    });

    it("should register the signup route", () => {
      // when
      const registerRoute = router.getRoutes().find((route) => route.name === "register");

      // then
      expect(registerRoute).toBeDefined();
      expect(registerRoute?.path).toBe("/register");
    });
  });

  it("should create a router instance", () => {
    // then
    expect(router).toBeDefined();
    expect(router.options).toBeDefined();
  });

  it("should use web history", () => {
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
