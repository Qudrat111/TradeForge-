# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Added

- Placeholder for upcoming features.

---

## [0.1.0] — 2024-01-01

### Added

- Root monorepo scaffolding with npm workspaces and Turborepo pipeline.
- Base TypeScript configuration (`tsconfig.base.json`) with strict mode,
  ES2022 target, and decorator support.
- ESLint configuration with `@typescript-eslint` strict rule set and Prettier
  integration.
- Prettier configuration enforcing single quotes, trailing commas, and a
  100-character print width.
- Root Jest configuration with per-project test discovery and 80 % global
  coverage thresholds.
- Workspace definitions for shared packages:
  - `packages/common` — shared types, utilities, and constants.
  - `packages/database` — TypeORM base entities, migrations, and connection
    factory.
  - `packages/events` — Kafka event contracts and producer/consumer helpers.
- Workspace definitions for micro-services:
  - `services/identity` — authentication, authorisation, and MFA (port 3001).
  - `services/company` — company profile and B2B relationship management (port
    3002).
  - `services/trade-core` — trade order lifecycle and fulfilment (port 3003).
- Turborepo pipeline with `build`, `test`, `lint`, `format`, `type-check`, and
  `dev` tasks; build output caching enabled.
- `lint-staged` + Husky pre-commit hook running ESLint and Prettier on staged
  files.
- `.env.example` documenting all required environment variables.
- Comprehensive `.gitignore` for a Node.js monorepo.
- MIT License.
- `SECURITY.md` with vulnerability reporting process and security best
  practices.
- `CONTRIBUTING.md` with conventional commits guide, branch naming conventions,
  and PR checklist.

[Unreleased]: https://github.com/TradeForge-/TradeForge-/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/TradeForge-/TradeForge-/releases/tag/v0.1.0
