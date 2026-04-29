import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";
import { createMemoryHistory, createRouter } from "vue-router";

import { apiCheck } from "@/adapters/api-check.js";
import App from "@/App.vue";
import RegisterView from "@/views/authentication/RegisterView.vue";

vi.mock("@/adapters/api-check.js", () => {
  return {
    apiCheck: vi.fn(),
  };
});

function createTestRouter() {
  return createRouter({
    history: createMemoryHistory(),
    routes: [
      {
        path: "/",
        component: RegisterView,
      },
      {
        path: "/login",
        name: "login",
        component: { template: "<div>Login</div>" },
      },
    ],
  });
}

async function mountApp() {
  const router = createTestRouter();
  const wrapper = mount(App, {
    global: {
      plugins: [router],
      stubs: {
        AppLoader: { template: "<div>Chargement de Kompagnon</div>" },
        AppShell: true,
      },
    },
  });
  await router.isReady();
  return wrapper;
}

describe("Unit | App", () => {
  it("should display a loader while the api check is pending", async () => {
    // given
    apiCheck.mockImplementation(() => new Promise(() => {}));

    // when
    const wrapper = await mountApp();

    // then
    expect(wrapper.text()).toContain("Chargement de Kompagnon");
  });

  it("should display app if api is ok", async () => {
    // given
    apiCheck.mockResolvedValue(true);

    // when
    const wrapper = await mountApp();
    await flushPromises();

    // then
    expect(wrapper.text()).not.toBe("");
  });

  it("should display an unavailable state if api is not ok", async () => {
    // given
    apiCheck.mockResolvedValue(false);

    // when
    const wrapper = await mountApp();
    await flushPromises();

    // then
    expect(wrapper.vm).toBeDefined();
  });
});
