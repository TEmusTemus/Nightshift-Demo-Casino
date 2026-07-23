# NIGHTSHIFT Demo Casino

A virtual-chip-only Next.js casino demo with Slot, Baccarat, account balances, transaction history, and SQLite persistence for local development. It contains no real-money payments or prizes.

## Run locally

```powershell
bun install
bun run dev
```

Open `http://localhost:3000`, create a demo account, add virtual chips on the Account page, then play Slot or Baccarat.

## Verify

```powershell
bun run test
bun run build
```

## SQLite database

The application creates `db/casino.db` automatically with `users`, `transactions`, `slot_spins`, and `baccarat_rounds` tables. SQLite is for local development only; never deploy it on ephemeral/serverless storage.

## Deployment configuration

Set `SESSION_SECRET` to at least 32 random bytes and configure a durable PostgreSQL `DATABASE_URL` (see `.env.example`). Sessions are signed, HTTP-only, `SameSite=Lax` cookies and are marked `Secure` in production. Do not expose database credentials to the browser.

Provision the first administrator explicitly in the database, for example: `UPDATE users SET role = 'admin' WHERE username = 'your-admin';`. The admin API and page reject unsigned users and non-admin roles.

## Notes

- Passwords are hashed with bcrypt.
- API writes use conditional SQLite transactions for local game settlement, so a balance cannot be overspent by simultaneous requests.
- The browser does not persist account identity; every protected API derives the user from the signed session cookie.
- Keep visual changes aligned with `DESIGN.md` and run the test/build commands after edits.
