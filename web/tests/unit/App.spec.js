import { mount } from "@vue/test-utils";
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
    },
  });
  await router.isReady();
  return wrapper;
}

describe("Unit | App", () => {
  it("should display app if api is ok", async () => {
    // given
    apiCheck.mockResolvedValue(true);

    // when
    const wrapper = await mountApp();

    // then
    expect(wrapper.text()).not.toBe("");
  });

  it("should not display app if api is not ok", async () => {
    // given
    apiCheck.mockResolvedValue(false);

    // when
    const wrapper = await mountApp();

    // then
    expect(wrapper.text()).toBe("");
  });
});
