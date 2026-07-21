# NIGHTSHIFT Demo Casino

A virtual-chip-only Next.js casino demo with Slot, Baccarat, account balances, transaction history, and SQLite persistence. It contains no real-money payments or prizes.

<img width="1126" height="554" alt="image" src="https://github.com/user-attachments/assets/2aba442f-788c-4413-9ddc-f517fe02bdf3" />

<img width="923" height="563" alt="image" src="https://github.com/user-attachments/assets/a79053e3-c37b-4481-a444-379ca67a62d8" />

<img width="748" height="537" alt="image" src="https://github.com/user-attachments/assets/894c5307-96b1-4df7-abe0-f8605d9a7bea" />




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
