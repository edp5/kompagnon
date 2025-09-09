import express from "express";

import controller from "./controller.js";

const health = express.Router();
health.get("/api/health", controller);

export default health;
