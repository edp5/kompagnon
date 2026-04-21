const storage = new Map();

export const localStorage = {
  get length() {
    return storage.size;
  },

  key(index) {
    if (typeof index !== "number" || index < 0) return null;
    let i = 0;
    for (const k of storage.keys()) {
      if (i === index) return k;
      i += 1;
    }
    return null;
  },

  getItem(key) {
    if (key === undefined || key === null) return null;
    const k = String(key);
    return storage.has(k) ? storage.get(k) : null;
  },

  setItem(key, value) {
    const k = String(key);
    const v = value === undefined || value === null ? String(value) : String(value);
    storage.set(k, v);
  },

  removeItem(key) {
    storage.delete(String(key));
  },

  clear() {
    storage.clear();
  },
};

export default localStorage;

if (typeof globalThis !== "undefined" && !globalThis.localStorage) {
  try {
    Object.defineProperty(globalThis, "localStorage", {
      value: localStorage,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  } catch {
    globalThis.localStorage = localStorage;
  }
}

if (typeof globalThis !== "undefined" && typeof globalThis.window !== "undefined" && !globalThis.window.localStorage) {
  try {
    Object.defineProperty(globalThis.window, "localStorage", {
      value: localStorage,
      configurable: true,
      enumerable: true,
      writable: true,
    });
  } catch {
    globalThis.window.localStorage = localStorage;
  }
}
