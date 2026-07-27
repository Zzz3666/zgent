# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased]

### Planned

- **Multi-provider support**: Abstract a unified registration layer for Alibaba Bailian, Zhipu, Moonshot, etc.
- **Pricing auto-sync**: Pull latest pricing from official catalog to reduce manual `cost` field drift.
- **Model metadata completion**: Add vendor, release date, function-call / JSON-mode / streaming support flags.
- **Result caching**: Short-term (e.g. 5 min) cache for identical Query + filter combos.
- **Result deduplication & clustering**: Normalize URLs, cluster cross-site reposts.
- **Custom rendering**: TUI card-style display for search results.
- **Multi-turn search**: Follow-up queries based on prior results (Perplexity-like).
- **Quota monitoring**: Parse response quota fields and warn near limits.
- **Unit tests**: Automated tests for `web_search.ts` response parsing, error handling, request building.

---

## [0.1.0] - 2026-07-27

### Added

- **Semantic versioning**: Project now follows SemVer (`MAJOR.MINOR.PATCH`).
- **CHANGELOG.md**: This file, tracking all notable changes per the Keep a Changelog standard.
- **Version badge**: README now displays the current version badge.

### Changed

- **package.json**: `version` bumped from `0.0.1` to `0.1.0` — first tracked release.
- **README.md**: Marked "版本与变更日志" task as completed.

---

## [0.0.1] - 2026-07-21

### Added

- **Volcengine Agent Plan provider** (`provider/volcengine-agent-plan.ts`):
  - 13 models: doubao-seed-2.0-mini, doubao-seed-2.0-lite, deepseek-v4-flash, doubao-seed-2.1-turbo, doubao-seed-evolving, minimax-m2.7, minimax-m3, glm-5.2, kimi-k2.6, kimi-k2.7-code, deepseek-v4-pro, kimi-k3.
  - Model metadata: context window, max output tokens, input modalities, reasoning support, pricing (¥/M tokens).
  - `openai-responses` / `openai-completions` API support.
- **Web Search tool** (`tool/web_search.ts`):
  - Full parameter schema matching Feedcoop API spec.
  - Parameters: Query, SearchType, Count, Filter (NeedContent, NeedUrl, Sites, BlockHosts, AuthInfoLevel), TimeRange, QueryControl, ContentFormats, Industry.
  - Error code reference (10400, 10401, 10403, 10406, 700429).
  - Cancellation support via `AbortSignal`.
  - Auto-cleanup of empty objects / undefined fields in request body.
  - Result formatting with source citation guidance for LLM.
- **Extension entry point** (`zgent/index.ts`):
  - Registers `volcengine-agent-plan` provider and `web_search` tool.
  - Injects real current date (UTC) into system prompt for time-aware queries.
- **Project scaffolding**: TypeScript config, `.gitignore`, `.gitattributes` (LF line endings), `package.json` with pi extension config.
- **CI pipeline** (`.github/workflows/ci.yml`): Runs `npm run check` on PRs to `main`.
- **Documentation**: Chinese README with installation, environment variables, model list, search tool reference, project structure, development guide, and roadmap.

### Changed

- **Refactored**: Monolithic provider config extracted to `provider/volcengine-agent-plan.ts`.
- **Updated**: All models set `supportsDeveloperRole: true`.
- **Dependencies**: Upgraded to `@earendil-works/pi-ai` and `@earendil-works/pi-coding-agent` >= 0.80.10.

### Removed

- **doubao-seed-2.0-code** and **doubao-seed-2.0-pro**: Marked for deprecation by Volcengine, removed from model list.

---

## Versioning Convention

This project follows [Semantic Versioning 2.0.0](https://semver.org/spec/v2.0.0.html):

| Category | Version bump | Examples |
|---|---|---|
| **Breaking change** in provider config, tool schema, or extension API | MAJOR (x.0.0) | Removing a model, changing required parameters, renaming exported symbols |
| **New feature** (non-breaking) | MINOR (0.x.0) | Adding a new model, new tool parameter, new environment variable |
| **Bug fix** / documentation / internal refactoring | PATCH (0.0.x) | Fixing API parsing, updating model pricing, improving docs |

### Breaking change triggers

A change is considered **breaking** (MAJOR) if it requires users to modify their configuration or code:

- **Provider**: Removing a model ID, changing `baseUrl`, changing `api` type, removing a required field from model metadata.
- **Tool**: Renaming/deleting a parameter, changing parameter type, changing tool name, altering the return content schema that the LLM depends on.
- **Extension entry**: Changing exported function signature, modifying `pi.registerProvider` / `pi.registerTool` calls that affect extension loading.

[Unreleased]: https://github.com/earendil-works/zgent/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/earendil-works/zgent/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/earendil-works/zgent/releases/tag/v0.0.1
