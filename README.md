# Kompagnon

## Project Goal

The goal of Kompagnon is to provide a support service for people with disabilities.

## Contribution

### Get the sources

```bash
git clone git@github.com:edp5/kompagnon.git && cd kompagnon
```

#### Installation
You must have:
- nvm: (node version manager) you can install with homebrew on macos and on nvm website on windows,
- docker,
- an IDE

Before starting installation, you must go to the root project folder and run:
```bash
nvm use
```
If it's necessary run:
```bash
nvm install
```
to install and use the version specified in the .nvmrc file.
On macOS, use the setup script:

```bash
npm run configure
```

On Windows, run the following:

```bash
npm ci && npm run ci:all
cd api
copy sample.env .env   # if using CMD
# or: Copy-Item sample.env .env   # if using PowerShell
docker compose up -d
npm run db:reset
cd ../web
copy sample.env .env   # if using CMD
# or: Copy-Item sample.env .env   # if using PowerShell
cd ../admin
copy sample.env .env   # if using CMD
# or: Copy-Item sample.env .env   # if using PowerShell
```

## Launch
You can parallel run apps with:
```bash
npm run dev
```
in root path. You can also goto app and run only the current app.

### WARNING
When you open a new terminal session, you must run `nvm use` to use the correct node version.


### Contribution
Your code must be clear and logic. Your pull request can be accepted or rejected without explication.

#### Tests
This project is testing and all new implementation must be tested.

#### Linter
All app of the project have a linter. You can run the linter with:
```bash
npm run lint
```
on root folder to run the linter of all apps.
If errors must be fixed with "fix" option, you can goto app error folder and run
```bash
npm run lint:fix
```
All fixable errors will be fixed.

##### JSDoc Documentation (API)
The API includes JSDoc linting to ensure proper documentation standards. The linter checks for:
- Proper parameter documentation with types and descriptions
- Return value documentation
- Valid JSDoc syntax and tag names

When writing functions in the API, follow this format:
```javascript
/**
 * @param {string} paramName - Description of the parameter
 * @returns {boolean} Description of the return value
 */
function exampleFunction(paramName) {
  // function implementation
}
```

##### Swagger route documentation helper (API)
Swagger UI is available on `/api/docs` and is generated from route-level `@swagger` JSDoc blocks in `api/src/**/*routes*.js`.

To quickly document new routes:

1. Generate templates for routes that do not have a `@swagger` block yet:
```bash
cd api
npm run swagger:jsdoc:templates
```
2. If undocumented routes are found, a markdown file is generated at `api/docs/swagger-jsdoc-templates/undocumented-routes.md` (all missing routes in one file, with copy-ready code blocks).
3. Copy the generated block for your route.
4. Paste it directly above the related route declaration in the route file.
5. Replace every `TODO` placeholder with the real endpoint details (summary, description, responses, request body, params, auth, etc.).
6. Start the API and verify the result in Swagger UI (`/api/docs`).

If the command prints `All detected routes already have a matching @swagger JSDoc block.`, no route is missing documentation and the command exits with code `0`.

### Commits and pull request
Your commit must respect conventional commit with "feat" or "fix" or "refactor" the scope and the title of your commit. For example:
"feat(api): add the db configuration".
Pull requests must respect similar rules.
