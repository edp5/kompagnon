const BASE_URL = "/api/health";

async function apiCheck() {
  try {
    const request = await fetch(BASE_URL);
    if (request.status === 200) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

export { apiCheck };
