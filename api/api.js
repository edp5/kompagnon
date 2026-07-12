import pkg from "../package.json"with { type: "json"};
import { config } from "./config.js";

const { name, version, author, description } = pkg;
const { environment } = config;

function getInfos(req, res) {
  return res.status(200).json({ name, description, version, author, environment });
}

export { getInfos };
