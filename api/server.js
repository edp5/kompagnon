import cors from "cors";
import express from "express";
import path from "path";

import { logger } from "./logger.js";
import health from "./src/shared/health/routes.js";

const server = express();

server.use(cors());
server.use(express.json());
server.use(express.static(path.join(process.cwd(), "dist")));
server.use((req, res, next) => {
  res.on("finish", () => {
    logger.info(`${req.method} ${req.url} ${res.statusCode}`);
  });
  next();
});

server.use(health);

export default server;
