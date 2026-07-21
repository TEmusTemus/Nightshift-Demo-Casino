# Slot Spin and Orbit Motion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a convincing two-phase slot sequence and a dramatic, accessible animated orbit console on the home page.

**Architecture:** The slot client will hold a per-reel visual phase (`spinning`, `landing`, `settled`) separate from its known server outcome. CSS supplies an infinite spin loop and a one-time landing transform. The existing SVG orbit console gains presentational layer elements and CSS-only animation, with a small client wrapper only if pointer tilt needs browser events.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Vitest, Testing Library.

## Global Constraints

- Preserve server-side virtual-chip validation, settlement, payout, and the existing dark visual system.
- Resolve API symbols before entering a reel landing state; use transform-based, overflow-clipped strips.
- Show a full-speed shared spin before sequential 1.7s, 2.0s, and 2.3s stops; publish payout only after reel three settles.
- Keep controls locked through settlement and reduce the timeline to immediate state for `prefers-reduced-motion`.
- Keep all home visual layers decorative (`aria-hidden`) and avoid layout-property animations.

---

### Task 1: Make the slot spin before sequentially landing

**Files:**
- Modify: `components/demo-client.tsx`
- Modify: `app/globals.css`
- Modify: `tests/game-motion.test.tsx`

**Interfaces:**
- Consumes: the slot API body `{ symbols: string[]; payout: number; user: User }`.
- Produces: `reelPhases: Array<"spinning" | "landing" | "settled">` and strips whose final rows are the known API symbols.

- [ ] **Step 1: Write the failing lifecycle test**

```tsx
test("slot spins all reels before landing them one by one", async () => {
  vi.useFakeTimers();
  // Set an authenticated user and mock a successful slot response.
  render(<GameClient game="slot" />);
  fireEvent.click(screen.getByRole("button", { name: "Spin" }));
  await vi.advanceTimersByTimeAsync(0);
  expect(document.querySelectorAll(".slot-reel--spinning")).toHaveLength(3);
  await vi.advanceTimersByTimeAsync(1700);
  expect(document.querySelectorAll(".slot-reel--landing")).toHaveLength(2);
  expect(document.querySelectorAll(".slot-reel--settled")).toHaveLength(1);
  vi.useRealTimers();
});
```

- [ ] **Step 2: Confirm RED**

Run: `npm test -- tests/game-motion.test.tsx`

Expected: FAIL because current reels begin their single landing transition immediately and do not expose per-reel phases.

- [ ] **Step 3: Implement explicit reel phases**

```tsx
type ReelPhase = "spinning" | "landing" | "settled";
const [reelPhases, setReelPhases] = useState<ReelPhase[]>(["settled", "settled", "settled"]);
// Begin with all phases "spinning". For each stop time, set one reel to
// "landing", then set it to "settled" only after its landing transition ends.
// Keep the final API symbols in slotOutcome until the last phase settles.
```

```css
.slot-reel--spinning .slot-reel__strip { animation: reel-spin 180ms linear infinite; filter: blur(1.5px); }
.slot-reel--landing .slot-reel__strip { animation: none; transform: translateY(var(--reel-distance)); transition: transform 420ms cubic-bezier(0.16, 1, 0.3, 1), filter 180ms ease-out; }
.slot-reel--settled .slot-reel__strip { transform: translateY(0); filter: none; }
@keyframes reel-spin { to { transform: translateY(-45rem); } }
```

- [ ] **Step 4: Confirm GREEN**

Run: `npm test -- tests/game-motion.test.tsx`

Expected: PASS with the sequential-phase regression and existing payout/control tests.

- [ ] **Step 5: Commit**

Run: `git add components/demo-client.tsx app/globals.css tests/game-motion.test.tsx; git commit -m "feat: sequence slot reel spin and landing"`

### Task 2: Add layered orbit-console motion

**Files:**
- Modify: `components/orbit-console.tsx`
- Modify: `app/globals.css`
- Modify: `tests/landing-page.test.tsx`

**Interfaces:**
- Consumes: the existing decorative `OrbitConsole` SVG.
- Produces: orbit-ring, node, sweep, core-halo, and particle layers marked `aria-hidden`.

- [ ] **Step 1: Write the failing structure test**

```tsx
test("home renders decorative orbit motion layers", () => {
  render(<Home />);
  expect(document.querySelector(".orbit-console__halo")).toBeInTheDocument();
  expect(document.querySelectorAll(".orbit-console__particle").length).toBeGreaterThanOrEqual(8);
  expect(document.querySelector(".orbit-console")).toHaveAttribute("aria-hidden", "true");
});
```

- [ ] **Step 2: Confirm RED**

Run: `npm test -- tests/landing-page.test.tsx`

Expected: FAIL because the current SVG has no halo or particle layers.

- [ ] **Step 3: Implement decorative layers and motion**

```tsx
const particles = [[74, 188], [130, 372], [196, 86], [308, 118], [394, 286], [344, 404], [168, 420], [88, 292]];
<circle className="orbit-console__halo" cx="240" cy="240" r="42" />
<g className="orbit-console__particles">{particles.map(([cx, cy], index) => <circle className="orbit-console__particle" cx={cx} cy={cy} r="2" key={index} />)}</g>
```

```css
.orbit-ring--outer { transform-origin: 50% 50%; animation: orbit-clockwise 20s linear infinite; }
.orbit-ring--middle { transform-origin: 50% 50%; animation: orbit-counter 14s linear infinite; }
.orbit-console__halo { animation: orbit-pulse 2.4s ease-in-out infinite; }
.orbit-console__particle { animation: orbit-drift 4s ease-in-out infinite alternate; }
@media (prefers-reduced-motion: reduce) { .orbit-console * { animation: none !important; } }
```

- [ ] **Step 4: Confirm GREEN**

Run: `npm test -- tests/landing-page.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

Run: `git add components/orbit-console.tsx app/globals.css tests/landing-page.test.tsx; git commit -m "feat: animate homepage orbit console"`

### Task 3: Verify responsive, accessible motion

**Files:**
- Verify: `components/demo-client.tsx`
- Verify: `components/orbit-console.tsx`
- Verify: `app/globals.css`
- Verify: `tests/game-motion.test.tsx`
- Verify: `tests/landing-page.test.tsx`

**Interfaces:**
- Consumes: Tasks 1 and 2.
- Produces: verified desktop/mobile and reduced-motion behavior.

- [ ] **Step 1: Run unit tests and lint**

Run: `npm test; npm run lint`

Expected: all tests pass and ESLint exits 0.

- [ ] **Step 2: Build production output**

Run: `npm run build`

Expected: exit 0.

- [ ] **Step 3: Inspect the pages manually**

Run: `npm run dev`

Expected: `/slot` shows a shared spin followed by three landing events; `/` shows active orbit layers without obstructing content.

- [ ] **Step 4: Confirm commit scope**

Run: `git status --short; git log --oneline -2`

Expected: only Task 1 and Task 2 source/test commits are new; existing database and prompt files remain uncommitted.
