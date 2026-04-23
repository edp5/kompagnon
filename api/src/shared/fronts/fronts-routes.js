// Expose fronts
// Serve static files from the bundled dists directory using a reliable
// absolute path (works with ES modules).
import express from "express";
import path from "path";

const fronts = express.Router();
fronts.use(
  "/",
  express.static(path.join("dists", "web")),
);
fronts.use(
  "/admin",
  express.static(path.join("dists", "admin")),
);

export default fronts;
