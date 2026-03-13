# Contributing to TradeForge

Thank you for your interest in contributing! This document outlines the
conventions, processes, and standards that keep the codebase consistent and
maintainable.

---

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Branch Naming Conventions](#branch-naming-conventions)
4. [Conventional Commits](#conventional-commits)
5. [Pull Request Process](#pull-request-process)
6. [Code Style](#code-style)
7. [Testing Requirements](#testing-requirements)
8. [Documentation](#documentation)

---

## Code of Conduct

All contributors are expected to adhere to the project's Code of Conduct.
Please be respectful, constructive, and inclusive in all interactions.

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20 (use [nvm](https://github.com/nvm-sh/nvm) or
  [fnm](https://github.com/Schniz/fnm) to manage versions)
- **npm** ≥ 10
- **Docker & Docker Compose** — for local infrastructure (Postgres, Redis,
  Kafka, Elasticsearch)

### Setup

```bash
# 1. Fork and clone the repository
git clone https://github.com/<your-username>/TradeForge-.git
cd TradeForge-

# 2. Install dependencies
npm install

# 3. Copy the environment file and fill in values
cp .env.example .env

# 4. Start infrastructure services
docker compose up -d

# 5. Run all services in watch mode
npm run dev
```

---

## Branch Naming Conventions

Branches must follow the pattern `<type>/<short-description>` where `<type>`
matches the conventional commit types listed below.

| Type       | When to use                                       | Example                           |
| ---------- | ------------------------------------------------- | --------------------------------- |
| `feat`     | New feature                                       | `feat/jwt-refresh-rotation`       |
| `fix`      | Bug fix                                           | `fix/order-status-race-condition` |
| `docs`     | Documentation only                                | `docs/api-auth-endpoints`         |
| `refactor` | Code restructure with no behaviour change         | `refactor/extract-event-bus`      |
| `test`     | Adding or updating tests                          | `test/identity-service-unit`      |
| `chore`    | Tooling, CI, dependency updates, repository tasks | `chore/bump-turbo-2`              |
| `hotfix`   | Urgent production fix branched from `main`        | `hotfix/cve-2024-xxxxx`           |

Branch names must be lowercase, use hyphens as separators, and be concise
(≤ 50 characters after the type prefix).

---

## Conventional Commits

All commit messages must follow the
[Conventional Commits 1.0.0](https://www.conventionalcommits.org/en/v1.0.0/)
specification. This enables automated changelog generation and semantic
versioning.

### Format

```
<type>(<optional scope>): <short description>

[optional body]

[optional footer(s)]
```

### Types

| Type       | Description                                                      |
| ---------- | ---------------------------------------------------------------- |
| `feat`     | A new feature (triggers a **MINOR** version bump)               |
| `fix`      | A bug fix (triggers a **PATCH** version bump)                    |
| `docs`     | Documentation changes only                                       |
| `refactor` | Code change that neither fixes a bug nor adds a feature          |
| `test`     | Adding missing tests or correcting existing tests                |
| `chore`    | Maintenance tasks — build process, dependencies, tooling         |
| `perf`     | A code change that improves performance                          |
| `ci`       | Changes to CI configuration files and scripts                    |
| `revert`   | Revert a previous commit                                         |

Append `!` after the type/scope to denote a **BREAKING CHANGE**
(triggers a **MAJOR** version bump):

```
feat(identity)!: replace cookie-based sessions with stateless JWTs
```

### Scopes

Use one of the workspace names as the scope: `common`, `database`, `events`,
`identity`, `company`, `trade-core`, `ci`, `docs`, `deps`.

### Examples

```
feat(identity): add TOTP-based multi-factor authentication
fix(trade-core): prevent duplicate order submission on retry
docs(contributing): add branch naming conventions section
refactor(database): extract connection factory into shared package
test(company): add unit tests for CompanyService.findByVatNumber
chore(deps): bump @nestjs/core from 10.3.0 to 10.3.2
```

---

## Pull Request Process

1. **Create a branch** from `main` following the naming convention above.
2. **Implement your changes** with commits following the Conventional Commits
   format.
3. **Ensure all checks pass locally** before opening a PR:
   ```bash
   npm run build && npm run lint && npm run test
   ```
4. **Open a Pull Request** against `main`. Fill in the PR template completely,
   including:
   - A clear description of *what* changed and *why*.
   - Links to related issues (`Closes #123`).
   - Screenshots / recordings for UI changes.
   - Checklist confirming tests, docs, and changelog are updated.
5. **Request review** from at least **one** code owner. PRs with breaking
   changes require two approvals.
6. **Address review feedback** by pushing additional commits or force-pushing
   to your branch (never merge main into the branch during review).
7. **Squash and merge** — the merge strategy is squash-merge to keep main's
   history linear. The PR title becomes the squash commit message and must
   follow the Conventional Commits format.

### PR Checklist

- [ ] My branch is up to date with `main` (rebased, not merged).
- [ ] `npm run build` succeeds with no errors.
- [ ] `npm run lint` passes with no warnings introduced.
- [ ] `npm run test` passes and coverage does not drop below 80 %.
- [ ] New public APIs have JSDoc comments.
- [ ] `.env.example` is updated if new environment variables were added.
- [ ] `CHANGELOG.md` has an entry under `[Unreleased]`.
- [ ] Database migrations are included and reversible.

---

## Code Style

Formatting and linting are enforced automatically — the pre-commit hook runs
`lint-staged` on every commit. The rules are:

- **TypeScript strict mode** — all `strict` flags enabled (see
  `tsconfig.base.json`).
- **No `any`** — use `unknown` and narrow the type explicitly.
- **Explicit return types** on all exported functions and class methods.
- **No non-null assertions (`!`)** — handle `null`/`undefined` explicitly.
- **Prettier** — code is auto-formatted; do not manually adjust whitespace.
- **Imports** — use `import type` for type-only imports; group imports:
  Node built-ins → third-party → internal packages → relative.

If the linter flags something you believe is a false positive, discuss it in
the PR rather than disabling the rule inline.

---

## Testing Requirements

| Layer          | Minimum coverage | Tool                             |
| -------------- | ---------------- | -------------------------------- |
| Unit tests     | 80 % (all metrics) | Jest + ts-jest                 |
| Integration    | Key happy paths  | Jest + Supertest                 |
| E2E            | Critical flows   | Jest + Supertest (staging env)   |

### Conventions

- Test files live next to the source file: `foo.service.ts` →
  `foo.service.spec.ts`.
- Integration tests live in a `test/` directory at the service root.
- Mocks are colocated in `__mocks__/` directories or inline with `jest.mock()`.
- Each `describe` block covers one class or module; each `it` block covers one
  behaviour.
- Avoid snapshot tests for business logic; prefer explicit assertions.
- Use `@faker-js/faker` for test data; never use real PII.

---

## Documentation

- Public packages (`packages/common`, `packages/events`) must export fully
  documented APIs with JSDoc.
- Service README files must document: purpose, environment variables, API
  endpoints (or gRPC methods), and event contracts.
- Architecture Decision Records (ADRs) live in `docs/adr/` and must be created
  for significant design decisions.
- Update `CHANGELOG.md` under `[Unreleased]` for every PR that changes
  behaviour.
