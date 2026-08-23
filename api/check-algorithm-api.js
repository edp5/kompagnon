import { config } from "./config.js";

const ENDPOINT = `${config.algorithm.apiUrl}/api/status`;
async function checkAlgorithmApi() {
  try {
    const request = await fetch(ENDPOINT);
    return request.ok;
  } catch {
    return false;
  }
}

export { checkAlgorithmApi };
