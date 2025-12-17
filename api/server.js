import { errors, isCelebrateError } from "celebrate";
import cors from "cors";
import express from "express";

import { logger } from "./logger.js";
import authenticationRoutes from "./src/identities-access-management/routes/authentication-routes.js";
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

server.use(health);
server.use(authenticationRoutes);

// do not write routes under this line
server.use((err, req, res, next) => {
  if (isCelebrateError(err)) {
    const details = [];
    for (const [segment, joiError] of err.details.entries()) {
      const errors = joiError.details.map(d => ({
        message: d.message,
        path: d.path.join("."),
        type: d.type,
      }));
      details.push({ in: segment, errors });
    }
    logger.error({
      event: "Error validation",
      message: "Validation failed",
      details: details,
    });
    return res.status(400).json({
      status: "error",
      message: "Validation failed",
      details,
    });
  }
  return errors(err, req, res, next);
});

export default server;
