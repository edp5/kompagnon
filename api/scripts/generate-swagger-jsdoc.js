import fs from "node:fs/promises";
import path from "node:path";

const HTTP_METHODS = ["get", "post", "put", "patch", "delete", "options", "head", "all"];
const ROOT_DIRECTORY = process.cwd();
const ROUTES_DIRECTORY = path.join(ROOT_DIRECTORY, "src");
const TEMPLATES_DIRECTORY = path.join(ROOT_DIRECTORY, "docs", "swagger-jsdoc-templates");
const TEMPLATES_FILE_NAME = "undocumented-routes.md";
const ALL_DOCUMENTED_MESSAGE = "All detected routes already have a matching @swagger JSDoc block.";

/**
 * Reads all route files recursively from the API source directory.
 * @returns {Promise<string[]>} Absolute paths to route files.
 */
async function findRouteFiles() {
  const files = [];

  await collectRouteFiles(ROUTES_DIRECTORY, files);

  return files.sort();
}

/**
 * Collect route files recursively.
 * @param {string} currentDirectory - Directory to inspect.
 * @param {string[]} accumulator - Route file accumulator.
 * @returns {Promise<void>} Resolves when collection is done.
 */
async function collectRouteFiles(currentDirectory, accumulator) {
  const entries = await fs.readdir(currentDirectory, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(currentDirectory, entry.name);

    if (entry.isDirectory()) {
      await collectRouteFiles(entryPath, accumulator);
      continue;
    }

    if (entry.isFile() && entry.name.includes("routes") && entry.name.endsWith(".js")) {
      accumulator.push(entryPath);
    }
  }
}

/**
 * Extracts documented method/path pairs from existing swagger blocks.
 * @param {string} fileContent - Route file content.
 * @returns {Set<string>} Documented endpoint keys ("method path").
 */
function extractDocumentedEndpoints(fileContent) {
  const documentedEndpoints = new Set();
  const blockRegex = /\/\*\*[\s\S]*?@swagger[\s\S]*?\*\//g;

  for (const blockMatch of fileContent.matchAll(blockRegex)) {
    const block = blockMatch[0];
    const pathMatch = block.match(/^\s*\*\s*(\/[^\s:]*)\s*:\s*$/m);

    if (!pathMatch) continue;

    const endpointPath = pathMatch[1];
    const methodRegex = /^\s*\*\s+([A-Za-z]+)\s*:\s*$/gm;

    for (const methodMatch of block.matchAll(methodRegex)) {
      const method = methodMatch[1].toLowerCase();

      if (HTTP_METHODS.includes(method)) {
        documentedEndpoints.add(`${method} ${endpointPath}`);
      }
    }
  }

  return documentedEndpoints;
}

/**
 * Extract route declarations from an express route file.
 * @param {string} fileContent - Route file content.
 * @returns {Array<{method: string, path: string, line: number}>} Parsed routes.
 */
function extractDeclaredRoutes(fileContent) {
  const routeCallRegex = /[A-Za-z_$][\w$]*\.(get|post|put|patch|delete|options|head|all)\(\s*(['"`])([^'"`]+)\2/g;
  const declaredRoutes = [];

  for (const routeMatch of fileContent.matchAll(routeCallRegex)) {
    const method = routeMatch[1].toLowerCase();
    const endpointPath = routeMatch[3];
    const startIndex = routeMatch.index ?? 0;
    const line = fileContent.slice(0, startIndex).split("\n").length;

    if (endpointPath.includes("${")) continue;

    declaredRoutes.push({ method, path: endpointPath, line });
  }

  return declaredRoutes;
}

/**
 * Provides the default success HTTP status code by method.
 * @param {string} method - HTTP method.
 * @returns {number} Suggested success status code.
 */
function getDefaultSuccessStatusCode(method) {
  if (method === "post") return 201;
  if (method === "delete") return 204;

  return 200;
}

/**
 * Builds the swagger JSDoc template for one route.
 * @param {{method: string, path: string, line: number}} route - Route metadata.
 * @returns {string} JSDoc template block.
 */
function buildSwaggerTemplate(route) {
  const successCode = getDefaultSuccessStatusCode(route.method);

  return [
    "/**",
    " * @swagger",
    ` * ${route.path}:`,
    ` *   ${route.method}:`,
    " *     summary: TODO - Add endpoint summary",
    " *     description: TODO - Describe the endpoint behavior",
    " *     responses:",
    ` *       ${successCode}:`,
    " *         description: TODO - Describe the success response",
    " */",
  ].join("\n");
}

/**
 * Builds markdown content for one missing route template section.
 * @param {{file: string, route: {method: string, path: string, line: number}}} missingRoute - Route metadata.
 * @returns {string} Markdown content.
 */
function buildTemplateMarkdownSection(missingRoute) {
  const templateCode = buildSwaggerTemplate(missingRoute.route);

  return [
    `### ${missingRoute.file}:${missingRoute.route.line} — ${missingRoute.route.method.toUpperCase()} ${missingRoute.route.path}`,
    "",
    "Copy this block above the route declaration:",
    "",
    "```js",
    templateCode,
    "```",
  ].join("\n");
}

/**
 * Writes one markdown file for all undocumented routes.
 * @param {Array<{file: string, route: {method: string, path: string, line: number}}>} missingRoutes - Undocumented routes.
 * @returns {Promise<void>} Resolves when files are generated.
 */
async function writeTemplateFiles(missingRoutes) {
  await fs.rm(TEMPLATES_DIRECTORY, { recursive: true, force: true });
  await fs.mkdir(TEMPLATES_DIRECTORY, { recursive: true });
  const filePath = path.join(TEMPLATES_DIRECTORY, TEMPLATES_FILE_NAME);
  const sections = missingRoutes.map(buildTemplateMarkdownSection).join("\n\n");
  const content = [
    "## Undocumented Routes",
    "",
    "The routes below are not documented yet. Copy each block and paste it above the corresponding route declaration.",
    "",
    sections,
  ].join("\n\n");

  await fs.writeFile(filePath, content, "utf8");
}

/**
 * Generate swagger templates for undocumented routes.
 * @returns {Promise<void>} Resolves when complete.
 */
async function main() {
  const routeFiles = await findRouteFiles();
  const missingRoutes = [];

  for (const routeFile of routeFiles) {
    const fileContent = await fs.readFile(routeFile, "utf8");
    const documentedEndpoints = extractDocumentedEndpoints(fileContent);
    const declaredRoutes = extractDeclaredRoutes(fileContent);
    const relativeFilePath = path.relative(ROOT_DIRECTORY, routeFile);

    for (const route of declaredRoutes) {
      const endpointKey = `${route.method} ${route.path}`;

      if (!documentedEndpoints.has(endpointKey)) {
        missingRoutes.push({
          file: relativeFilePath,
          route,
        });
      }
    }
  }

  if (missingRoutes.length === 0) {
    console.log(ALL_DOCUMENTED_MESSAGE);
    return;
  }

  await writeTemplateFiles(missingRoutes);
  console.log(
    `Generated 1 markdown template file in ${path.relative(ROOT_DIRECTORY, path.join(TEMPLATES_DIRECTORY, TEMPLATES_FILE_NAME))}.`,
  );
  return;
}

main().catch(error => {
  console.error("Failed to generate swagger JSDoc templates.");
  console.error(error);
  process.exitCode = 1;
});
