# Slot Spin Transition Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make every slot reel visibly decelerate onto its server-selected symbol, then reveal the settled payout.

**Architecture:** `GameClient` holds a pending outcome and reel-by-reel spin state. CSS clips a repeated vertical symbol strip and transitions its transform to the known final row; React controls the three stop times and settlement UI.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Vitest, Testing Library.

## Global Constraints

- Preserve the existing dark UI and server-side settlement logic.
- Use `overflow: hidden` and `transform: translateY()` only for reel movement.
- Stop the three reels after 1.7s, 2.0s, and 2.3s using `cubic-bezier(0.16, 1, 0.3, 1)`.
- Keep bet input and Spin disabled; publish balance and payout only after reel three settles.
- Include no-op `playSpinSound()` and `playStopSound()` hooks; honor reduced motion.

---

### Task 1: Establish the slot spin lifecycle

**Files:**
- Modify: `tests/game-motion.test.tsx`
- Modify: `components/demo-client.tsx`

**Interfaces:**
- Consumes: `GameClient({ game: "slot" })`.
- Produces: `slotOutcome: string[]`, `spinningReels: boolean[]`, and a slot lifecycle that delays result publishing to 2300ms.

- [ ] **Step 1: Write the failing test**

```tsx
test("slot locks its bet controls and withholds status until all reels settle", async () => {
  vi.useFakeTimers();
  vi.spyOn(global, "fetch").mockResolvedValue(new Response(JSON.stringify({ symbols: ["7", "BAR", "✦"], payout: 50, user: { id: 1, username: "player", balance: 1025 } }), { status: 200 }));
  localStorage.setItem("nightshift-user", JSON.stringify({ id: 1, username: "player", balance: 1000 }));
  render(<GameClient game="slot" />);
  fireEvent.click(screen.getByRole("button", { name: "Spin" }));
  await vi.runAllTicks();
  expect(screen.getByLabelText("Bet amount")).toBeDisabled();
  expect(document.querySelectorAll(".slot-reel--spinning")).toHaveLength(3);
  expect(screen.getByRole("status")).toHaveTextContent("");
  await vi.advanceTimersByTimeAsync(2300);
  expect(screen.getByRole("status")).toHaveTextContent("7 · BAR · ✦ — payout 50 chips");
  expect(screen.getByLabelText("Bet amount")).not.toBeDisabled();
  vi.useRealTimers();
});
```

- [ ] **Step 2: Run it and confirm RED**

Run: `npm test -- tests/game-motion.test.tsx`

Expected: FAIL because the existing status is published after 1600ms and the bet input remains enabled.

- [ ] **Step 3: Implement the minimal lifecycle**

```tsx
const SLOT_STOP_MS = [1700, 2000, 2300] as const;
const playSpinSound = () => undefined;
const playStopSound = () => undefined;
// After a successful API response: set slotOutcome; set all spinningReels true;
// schedule one stop callback per duration; await the final duration; then save
// body.user, set the final symbols/result, and setPlaying(false).
```

- [ ] **Step 4: Run it and confirm GREEN**

Run: `npm test -- tests/game-motion.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

Run: `git add components/demo-client.tsx tests/game-motion.test.tsx; git commit -m "feat: coordinate slot spin lifecycle"`

### Task 2: Transition repeated strips to their predetermined ending rows

**Files:**
- Modify: `components/demo-client.tsx`
- Modify: `app/globals.css`
- Modify: `tests/game-motion.test.tsx`

**Interfaces:**
- Consumes: `slotOutcome` and `spinningReels` from Task 1.
- Produces: a strip with at least 11 rows ending with `slotOutcome[index]`, plus a `slot-reel--spinning` class while a reel is moving.

- [ ] **Step 1: Write the failing test**

```tsx
test("slot strips repeat symbols before their final outcome", () => {
  render(<GameClient game="slot" />);
  document.querySelectorAll(".slot-reel__strip").forEach((strip) => {
    const rows = strip.querySelectorAll(".slot-reel__symbol");
    expect(rows.length).toBeGreaterThanOrEqual(11);
  });
});
```

- [ ] **Step 2: Run it and confirm RED**

Run: `npm test -- tests/game-motion.test.tsx`

Expected: FAIL because the current strip has seven rows.

- [ ] **Step 3: Implement the strip and CSS**

```tsx
const REEL_SYMBOLS = ["✦", "7", "BAR", "♦", "$"];
const reelSymbols = (result: string) => [...REEL_SYMBOLS, ...REEL_SYMBOLS, result];
// Apply slot-reel--spinning per reel and CSS custom properties for distance and duration.
```

```css
.slot-reel__strip { transform: translateY(0); transition: transform var(--reel-duration) cubic-bezier(0.16, 1, 0.3, 1), filter 180ms ease-out; will-change: transform, filter; }
.slot-reel--spinning .slot-reel__strip { transform: translateY(var(--reel-distance)); filter: blur(1.5px); }
@media (prefers-reduced-motion: reduce) { .slot-reel__strip { transition-duration: 0.01ms; filter: none; } }
```

- [ ] **Step 4: Run it and confirm GREEN**

Run: `npm test -- tests/game-motion.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

Run: `git add components/demo-client.tsx app/globals.css tests/game-motion.test.tsx; git commit -m "feat: animate slot reels to server outcome"`

### Task 3: Verify the integrated experience

**Files:**
- Verify: `components/demo-client.tsx`
- Verify: `app/globals.css`
- Verify: `tests/game-motion.test.tsx`

**Interfaces:**
- Consumes: completed Tasks 1 and 2.
- Produces: verified slot behavior with no game regressions.

- [ ] **Step 1: Run focused behavior tests**

Run: `npm test -- tests/game-motion.test.tsx`

Expected: PASS.

- [ ] **Step 2: Run full verification**

Run: `npm test; npm run lint; npm run build`

Expected: all commands exit 0.

- [ ] **Step 3: Confirm commit scope**

Run: `git status --short; git log --oneline -2`

Expected: only the two slot commits are new; pre-existing database, generated, and user prompt files remain unstaged.
