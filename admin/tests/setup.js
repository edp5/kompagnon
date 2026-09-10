import { afterEach, vi } from "vitest";

import localStorage from "./localStorage.js";

Object.defineProperty(global, "localStorage", {
  value: localStorage,
  writable: true,
  configurable: true,
});

afterEach(() => {
  vi.clearAllTimers();
  vi.clearAllMocks();
});
