# Kompagnon

## Project Goal

The goal of Kompagnon is to provide a support service for people with disabilities.

## Contribution

### Get the sources

```bash
git clone git@github.com:edp5/kompagnon.git && cd kompagnon
```

#### Installation

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
```

## Launch
You can parallel run apps with:
```bash
npm run dev
```
in root path. You can also goto app and run only the current app.


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

### Commits and pull request
Your commit must respect conventional commit with "feat" or "fix" or "refactor" the scope and the title of your commit. For exemple:
"feat(api): add the db configuration".
Pull requests must respect similare rules.
