import { afterEach, vi } from "vitest";
import { config } from "@vue/test-utils";

import localStorage from "./localStorage.js";

global.localStorage = localStorage;

// Stub global components
config.global.stubs = {
  ChevronRight: true,
  PhoneCall: true,
  AppLoader: true,
  BottomNavigation: true,
  TopBar: true,
};

afterEach(() => {
  vi.clearAllTimers();
  vi.clearAllMocks();
});
