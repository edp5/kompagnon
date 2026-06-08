import cors from "cors";
import express from "express";

import { logger } from "./logger.js";
import authenticationRoutes from "./src/identities-access-management/routes/authentication-routes.js";
import usersRoutes from "./src/identities-access-management/routes/users-routes.js";
import journeysRoutes from "./src/journeys/api/routes/journeys-routes.js";
import fronts from "./src/shared/fronts/fronts-routes.js";
import health from "./src/shared/health/routes.js";
import { errorHandler } from "./src/shared/infrastructure/middlewares/error-handler.js";
import swaggerRoute from "./swagger.js";

const server = express();

server.use(cors());
server.use(express.json());
server.use(swaggerRoute);

// Log api calls
server.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    res.on("finish", () => {
      logger.info(`${req.method} ${req.url} ${res.statusCode}`);
    });
  }
  next();
});
server.use(fronts);
server.use(health);
server.use(authenticationRoutes);
server.use(usersRoutes);
server.use(journeysRoutes);

// do not write routes under this line
server.use(errorHandler);

export default server;
