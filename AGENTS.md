# Repository Guidelines

## Project Structure & Module Organization

This repository is currently an empty project scaffold. Keep application code in a dedicated top-level directory such as `src/`, tests in `tests/`, and static files in `assets/`. Group related functionality by feature rather than accumulating unrelated files at the root. Put project-wide configuration (for example, `.env.example`, formatter settings, and package manifests) at the root.

When adding a new language or framework, follow its conventional layout and update this guide with the authoritative paths. Avoid committing generated output such as dependency folders, coverage reports, or build artifacts unless the project explicitly requires them.

## Build, Test, and Development Commands

No build system, runtime, or test runner is configured yet. When one is introduced, record the exact commands here and make them reproducible from a clean checkout. A typical JavaScript setup would be:

```powershell
npm install       # Install declared dependencies
npm run dev       # Start the local development server
npm test          # Run the automated test suite
npm run lint      # Check formatting and code-quality rules
```

Prefer scripts defined in the project manifest over undocumented one-off commands.

## Coding Style & Naming Conventions

Use the formatter and linter selected by the project; do not hand-format around their output. Until tooling is added, use 2-space indentation for JSON, YAML, JavaScript, and TypeScript. Name source files by their purpose and use the language’s normal convention (for example, `payment-service.ts`, `PaymentService.ts`, or `payment_service.py`). Keep names explicit and avoid ambiguous abbreviations.

## Testing Guidelines

Add tests alongside each feature in `tests/` (or the framework’s standard test location). Name test files so the runner discovers them, such as `*.test.ts`, `*.spec.ts`, or `test_*.py`. Cover expected behavior, boundary cases, and regressions. Run the full test and lint commands before opening a pull request.

## Commit & Pull Request Guidelines

No Git history is available yet, so no repository-specific commit convention can be inferred. Use concise imperative commit subjects, optionally following Conventional Commits: `feat: add lobby screen` or `fix: validate wager amount`.

Pull requests should state what changed and why, link relevant issues, list verification performed, and include screenshots or recordings for user-interface changes. Keep each PR focused and update documentation when commands, configuration, or structure change.

## Security & Configuration

Never commit credentials or real `.env` files. Provide safe placeholders in `.env.example`, document required variables, and validate externally supplied input at application boundaries.
