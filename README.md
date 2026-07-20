# NIGHTSHIFT Demo Casino

A virtual-chip-only Next.js casino demo with Slot, Baccarat, account balances, transaction history, and SQLite persistence. It contains no real-money payments or prizes.

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

The application creates `db/casino.db` automatically with `users`, `transactions`, `slot_spins`, and `baccarat_rounds` tables. Open that file in DB Browser for SQLite (`H:\DB.Browser.for.SQLite-v3.13.1-win64`) to inspect demo data.

## Notes

- Passwords are hashed with bcrypt.
- API writes use SQLite transactions for game settlement.
- The current browser session stores only the demo user id/balance in local storage; this is intentionally a demo, not production authentication.
- Keep visual changes aligned with `DESIGN.md` and run the test/build commands after edits.
