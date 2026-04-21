import { afterEach, vi } from "vitest";

import localStorage from "./localStorage.js";

global.localStorage = localStorage;

afterEach(() => {
  vi.clearAllTimers();
  vi.clearAllMocks();
});
