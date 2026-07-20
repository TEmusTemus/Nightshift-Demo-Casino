# Prompt: Build a Mock Casino Web App (Slot Machine + Baccarat)

## Project Context
- **Design reference:** Match the visual style, layout structure, typography rhythm, and dark/minimal aesthetic of https://hermes-agent.nousresearch.com/ (hero section, feature cards grid, subtle gradients, monospace accents, generous whitespace).
- **Design tool:** Use the **Impeccable** skill (already installed locally) to scan design tokens, generate `DESIGN.md`, and enforce consistent typography/color/spacing across all pages. Run Impeccable commands such as `/audit`, `/polish`, `/typeset` at the end of each phase.
- **Database:** Use **SQLite** as the storage engine. Assume DB Browser for SQLite is available locally at `H:\DB.Browser.for.SQLite-v3.13.1-win64` for manual inspection during development. The app itself should connect via a lightweight SQLite driver (e.g., better-sqlite3 / sqlite3 depending on stack).
- **Scope:** This is a *mock/demo* casino — no real money, no payment gateway. Use virtual chips/credits only.

---

## Phase 0 — Planning & Setup
1. Initialize the project repository and folder structure (`/frontend`, `/backend` or `/src`, `/db`).
2. Define the tech stack (framework of choice, e.g., Next.js/React or plain Node + Express + static frontend).
3. Create the SQLite database file (`casino.db`) with the following initial schema:
   - `users` (id, username, password_hash, balance, created_at)
   - `transactions` (id, user_id, game_type, bet_amount, result, payout, created_at)
   - `slot_spins` (id, user_id, symbols, win_amount, created_at)
   - `baccarat_rounds` (id, user_id, player_cards, banker_cards, bet_type, bet_amount, outcome, payout, created_at)
4. Verify the schema by opening `casino.db` in DB Browser for SQLite to confirm tables/columns are correct.
5. Run Impeccable's initial scan (`/scan` or equivalent) to generate baseline `DESIGN.md` from any existing design tokens or reference screenshots of hermes-agent.nousresearch.com.

**Deliverable:** Working repo skeleton + empty but schema-correct SQLite DB + Impeccable baseline report.

---

## Phase 1 — Landing Page / Home
1. Build a landing page inspired by hermes-agent.nousresearch.com's hero section:
   - Bold hero headline (e.g., "The Casino That Never Sleeps") with a short subtext.
   - Two feature cards side-by-side: **Slot Machine** and **Baccarat**, each with an icon, short description, and a "Play Now" button.
   - Sticky top navbar with logo, nav links (Home, Slot, Baccarat, Account), and a balance display (virtual chips).
   - Dark theme, subtle gradient background, monospace font for numbers/balance, generous padding like the reference site.
2. Implement a simple login/register flow (username + password) that creates rows in the `users` table, with a starting balance (e.g., 1000 chips).
3. Display live balance in navbar, pulled from SQLite via API endpoint (`GET /api/user/balance`).
4. Apply Impeccable `/polish` on this page for spacing, color contrast, and font hierarchy consistency with the reference design.

**Deliverable:** Responsive landing page + working auth + live balance display.

---

## Phase 2 — Slot Machine Game
1. Design a 3-reel (or 5-reel) slot machine UI:
   - Reel container with spinning animation (CSS/JS transition).
   - Bet amount selector (chips input, min/max limits).
   - "Spin" button with disabled state during spin animation.
   - Payout table modal/tooltip showing symbol combinations and multipliers.
2. Backend logic:
   - `POST /api/slot/spin` — accepts user_id + bet_amount, generates random symbols (weighted RNG), calculates win/loss, updates `users.balance`, inserts into `slot_spins` and `transactions`.
   - Ensure atomic transaction (deduct bet, then credit payout) to avoid balance corruption.
3. Show real-time result: winning symbols highlighted, payout amount animated into balance.
4. Add spin history panel (last 10 spins pulled from `slot_spins` table for that user).
5. Run Impeccable `/audit` to check accessibility (contrast, focus states) and `/typeset` for consistent number formatting (chip amounts, payout multipliers).

**Deliverable:** Fully playable slot machine with persistent history and balance sync.

---

## Phase 3 — Baccarat Game
1. Design a baccarat table UI:
   - Player and Banker card zones with card-flip animation.
   - Bet type selector: Player / Banker / Tie, with chip stacking visual for bet amount.
   - "Deal" button to start a round; disable betting controls once round starts.
   - Score display showing point totals per Baccarat rules (face cards = 0, Ace = 1, 10s digit dropped).
2. Backend logic:
   - `POST /api/baccarat/deal` — accepts user_id, bet_type, bet_amount.
   - Implement Baccarat drawing rules (third-card rule for both Player and Banker) server-side to prevent client manipulation.
   - Calculate outcome (Player win / Banker win / Tie), apply correct payout ratios (e.g., 1:1 Player, 0.95:1 Banker with 5% commission, 8:1 Tie).
   - Insert round data into `baccarat_rounds`, update `users.balance`, log to `transactions`.
3. Show round history and running win/loss stats for the session.
4. Run Impeccable `/polish` and `/audit` to ensure card animations, table layout, and color coding (green/red for win/loss) match the site's design language.

**Deliverable:** Fully playable Baccarat game following official drawing rules, synced with SQLite backend.

---

## Phase 4 — Account & History Dashboard
1. Build a user dashboard page:
   - Current balance (large, prominent, monospace numeral style like the reference site's stat callouts).
   - Combined transaction history table (filterable by game type: Slot / Baccarat).
   - Simple stats: total wagered, total won, net profit/loss, win rate — computed via SQL aggregate queries on `transactions`.
2. Add a "Reset Demo Balance" button (dev/testing convenience — resets balance to 1000 and clears history for that user).
3. Query optimization: add indexes on `transactions.user_id` and `created_at` for fast history retrieval.
4. Verify all tables/data integrity by inspecting `casino.db` in DB Browser for SQLite.

**Deliverable:** Complete account dashboard with accurate historical stats.

---

## Phase 5 — Final Polish & QA
1. Run full Impeccable audit across all pages (`/audit --full` or equivalent) to catch inconsistent spacing, colors, typography, and responsive breakage.
2. Cross-check dark mode consistency, button states (hover/active/disabled), and animation smoothness on both game pages.
3. Test edge cases: insufficient balance bets, concurrent spins/deals, DB write failures (should roll back transaction, not corrupt balance).
4. Write a short `README.md` covering setup steps, how to open `casino.db` in DB Browser for SQLite for manual inspection, and how Impeccable's `DESIGN.md` should be referenced for future design changes.
5. Final review comparing side-by-side screenshots against hermes-agent.nousresearch.com for style fidelity.

**Deliverable:** Production-ready demo casino app — polished UI, two fully functional games, persistent SQLite-backed state, and Impeccable-verified design consistency.

---

## Notes for the Agent
- Reuse Impeccable's generated design tokens (colors, spacing scale, font stack) across all phases instead of hardcoding new values each time.
- Keep all monetary values as virtual "chips" — clearly label as demo/mock currency, no real payment integration.
- Prefer parameterized SQL queries (no string concatenation) to avoid injection even in this demo context.
- Each phase should end with a working, testable build before moving to the next phase.
