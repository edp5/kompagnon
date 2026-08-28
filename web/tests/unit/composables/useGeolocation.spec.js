import { mount } from "@vue/test-utils";
import { afterEach, describe, expect, it, vi } from "vitest";
import { defineComponent, h } from "vue";

import { useGeolocation } from "@/composables/useGeolocation.js";

/**
 * Runs a composable inside a real component instance so its lifecycle
 * hooks (onUnmounted, ...) are registered against a live Vue instance.
 * @param {() => object} composable - The composable invocation to run.
 * @returns {{ result: object, wrapper: import("@vue/test-utils").VueWrapper }}
 */
function withSetup(composable) {
  let result;
  const wrapper = mount(
    defineComponent({
      setup() {
        result = composable();
        return () => h("div");
      },
    }),
  );
  return { result, wrapper };
}

describe("Unit | Composables | useGeolocation", () => {
  afterEach(() => {
    delete global.navigator.geolocation;
  });

  it("should report as unsupported and set an error when the browser has no geolocation API", () => {
    // given
    delete global.navigator.geolocation;

    // when
    const { result } = withSetup(() => useGeolocation());
    result.locate();

    // then
    expect(result.isSupported).toBe(false);
    expect(result.error.value).toBe("La géolocalisation n'est pas disponible sur cet appareil.");
  });

  it("should populate coords and clear the error on a successful getCurrentPosition call", () => {
    // given
    global.navigator.geolocation = {
      getCurrentPosition: (success) => success({ coords: { latitude: 48.8566, longitude: 2.3522, accuracy: 12 } }),
    };

    // when
    const { result } = withSetup(() => useGeolocation());
    result.locate();

    // then
    expect(result.coords.value).toEqual({ latitude: 48.8566, longitude: 2.3522, accuracy: 12 });
    expect(result.error.value).toBe("");
    expect(result.isLoading.value).toBe(false);
  });

  it("should set a permission-denied specific message when the user refuses access", () => {
    // given
    global.navigator.geolocation = {
      getCurrentPosition: (_success, failure) => failure({ code: 1, PERMISSION_DENIED: 1 }),
    };

    // when
    const { result } = withSetup(() => useGeolocation());
    result.locate();

    // then
    expect(result.error.value).toBe("Vous avez refusé l'accès à votre position.");
    expect(result.isLoading.value).toBe(false);
  });

  it("should set a generic message for other geolocation errors", () => {
    // given
    global.navigator.geolocation = {
      getCurrentPosition: (_success, failure) => failure({ code: 2, PERMISSION_DENIED: 1 }),
    };

    // when
    const { result } = withSetup(() => useGeolocation());
    result.locate();

    // then
    expect(result.error.value).toBe("Impossible de récupérer votre position pour le moment.");
  });

  it("should set isLoading to true while a request is in flight", () => {
    // given
    global.navigator.geolocation = {
      getCurrentPosition: () => {},
    };

    // when
    const { result } = withSetup(() => useGeolocation());
    result.locate();

    // then
    expect(result.isLoading.value).toBe(true);
  });

  it("should use watchPosition when the watch option is enabled and clear it on unmount", () => {
    // given
    const clearWatch = vi.fn();
    global.navigator.geolocation = {
      watchPosition: vi.fn(() => 42),
      clearWatch,
    };

    // when
    const { result, wrapper } = withSetup(() => useGeolocation({ watch: true }));
    result.locate();
    wrapper.unmount();

    // then
    expect(global.navigator.geolocation.watchPosition).toHaveBeenCalledOnce();
    expect(clearWatch).toHaveBeenCalledWith(42);
  });
});
