# Deployment-ready security design

## Scope

Harden the virtual-chip demo for a production deployment without adding real-money functionality. The change covers authenticated sessions, authorization, validation, atomic game settlement, database portability, client-state cleanup, and API integration tests.

## Authentication and authorization

The server issues a signed, HTTP-only, `Secure` (in production), `SameSite=Lax` session cookie after successful registration or login. The cookie contains an opaque signed user identifier and expiry. `SESSION_SECRET` is mandatory in production; local development creates a non-production fallback with a startup warning.

Each protected route resolves the current user from the cookie, never from a body or query `userId`. Slot, Baccarat, account history, and virtual top-up require an authenticated user. The admin page and user-list API additionally require `role = 'admin'`; unauthenticated requests receive 401 and non-admin requests receive 403.

`/api/auth/session` returns the current safe user record. Logout clears the session cookie. The browser no longer stores identity or balance in local storage.

## Request handling and settlement

All JSON bodies are parsed through a shared helper. Malformed JSON and invalid field shapes return a consistent 400 JSON error. Game and top-up amounts remain positive integers capped at 100,000.

Slot and Baccarat settlement occurs in one database transaction. The balance update is conditional on sufficient funds at execution time. If no row is updated, the transaction makes no round or ledger entry and the API returns an insufficient-balance error. The transaction ledger remains the source for history and statistics.

## Persistence and deployment

SQLite remains supported only for local development. Production requires a durable external database URL; startup rejects file-backed SQLite in production. Database access is isolated behind the existing database module so a hosted PostgreSQL adapter can replace SQLite without changing routes or components. Deployment documentation states required environment variables, durable database requirements, and the need to provision an admin role explicitly.

## Client application

Session-aware client helpers fetch the server session and use credentials-bearing requests. Game, account, and login components are split by responsibility. Internal navigation uses Next.js `Link`. Network and JSON failures surface an accessible status message. The admin empty state checks `users.length`.

## Tests

Tests use an isolated temporary SQLite database. Route integration coverage proves malformed requests are rejected, unauthenticated and unauthorized requests are blocked, session identity cannot be overridden by a supplied ID, admin access is role-gated, and simultaneous overspending cannot create a negative balance or extra ledger entries.
