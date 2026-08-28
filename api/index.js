import { checkAlgorithmApi } from "./check-algorithm-api.js";
import { config } from "./config.js";
import { knex } from "./db/knex-database-connection.js";
import { logger } from "./logger.js";
import server from "./server.js";

const PORT = config.port;
server.listen(PORT, async () => {
  logger.info(`Listening on port ${PORT}`);
  const apiStatus = {};
  const testDb = await knex.raw("SELECT 1");
  if (testDb.rowCount) {
    apiStatus.database = "ok";
  }
  if (config.mailPit.enabled) {
    apiStatus.mailPit = "active";
  } else if (!config.mailPit.enabled && config.email.enabled) {
    apiStatus.mailPit = "inactive";
    apiStatus.email = "active";
  } else if (!config.mailPit.enabled && !config.email.enabled) {
    apiStatus.mailPit = "inactive";
    apiStatus.email = "inactive";
  }
  if (config.algorithm.enabled) {
    const algorithmApiStatus = await checkAlgorithmApi();
    apiStatus.algorithm = algorithmApiStatus ? "active" : "error";
    if (!config.algorithm.apiKey) {
      logger.warn("ALGORITHM_API_KEY is not set — POST /api/journeys/match is unprotected");
    }
  } else {
    apiStatus.algorithm = "inactive";
  }
  logger.info(apiStatus, "API status:");
});
