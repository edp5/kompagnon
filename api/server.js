import cors from "cors";
import express from "express";

import { logger } from "./logger.js";
import auth from "./src/shared/auth/routes.js";
import health from "./src/shared/health/routes.js";
import swaggerRoute from "./swagger.js";

const server = express();

server.use(cors());
server.use(express.json());
server.use(swaggerRoute);
server.use((req, res, next) => {
  res.on("finish", () => {
    logger.info(`${req.method} ${req.url} ${res.statusCode}`);
  });
  next();
});

server.use("/api/auth", auth);
server.use(health);

export default server;
