import { vi } from "vitest";
const res = {
  status: vi.fn().mockReturnThis(),
  json: vi.fn().mockReturnValue(),
  text: vi.fn().mockReturnValue(),
  send: vi.fn().mockReturnValue(),
};

const next = vi.fn();

export { next, res };
