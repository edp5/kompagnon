import { describe, expect, it } from "vitest";

import App from "@/App.vue";
import router from "@/router/index.js";

describe("Unit | Main", () => {
  it("should import all required dependencies", async () => {
    // when
    const mainModule = await import("@/main.js");

    // then
    expect(mainModule).toBeDefined();
  });

  it("should have App component defined", () => {
    // then
    expect(App).toBeDefined();
    expect(App.__name).toBe("App");
  });

  it("should have router instance defined", () => {
    // then
    expect(router).toBeDefined();
    expect(router.options).toBeDefined();
  });

  it("should have createPinia available", async () => {
    // given
    const { createPinia } = await import("pinia");

    // when
    const pinia = createPinia();

    // then
    expect(createPinia).toBeDefined();
    expect(pinia).toBeDefined();
  });

  it("should have createApp available", async () => {
    // given
    const { createApp } = await import("vue");

    // when
    const app = createApp(App);

    // then
    expect(createApp).toBeDefined();
    expect(app).toBeDefined();
    expect(typeof app.use).toBe("function");
    expect(typeof app.mount).toBe("function");
  });
});
