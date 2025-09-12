# Kompagnon api

## Project Goal

The goal of Kompagnon is to provide a support service for people with disabilities.

## Contribution

### Get the sources

```bash
git clone git@github.com:edp5/kompagnon-api.git && cd kompagnon-api
```

#### Installation

On macOS, use the setup script:

```bash
npm run configure
```

On Windows, run the following:

```bash
npm ci
copy sample.env .env   # if using CMD
# or: Copy-Item sample.env .env   # if using PowerShell
docker compose up -d
npm run db:reset
```

## Launch
```bash
npm run dev
```

### Contribution
Your code must be clear and logic. Your pull request can be accepted or rejected without explication.

#### Tests
This project is testing and all new implementation must be tested.

#### Linter
The api is using eslint with the airbnb style guide. Please run the linter before pushing your code:
```bash
npm run lint:fix
```

### Commits and pull request
Your commit messages must be clear and concise. Please use the following format:
```
feat: add new feature
```
