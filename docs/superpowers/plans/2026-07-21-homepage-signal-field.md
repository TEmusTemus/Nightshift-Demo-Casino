# Homepage Signal Field Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Give the homepage a Hermes-inspired moving signal object and restrained animated casino objects with clear transitions.

**Architecture:** Add a presentational `SignalField` SVG behind homepage content and expand `OrbitConsole` into a client component only for fine-pointer parallax. CSS owns continuous motion, hover transitions, and reduced-motion behavior.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS keyframes, Vitest, Testing Library.

## Global Constraints

- Keep moving decoration behind content and controls.
- Use CSS, SVG, and React only; add no dependencies.
- Decorative SVGs are `aria-hidden`; all animations honor `prefers-reduced-motion: reduce`.
- Animate `transform` and `opacity`; interactive transitions stay at 250ms or less.

---

### Task 1: Add the ambient casino signal field

**Files:**
- Create: `components/signal-field.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/landing-page.test.tsx`

**Interfaces:**
- Produces: `SignalField(): JSX.Element`, a decorative SVG with `.signal-field`, `.signal-field__inner`, and six `.signal-field__object` elements.
- Consumes: `HomePage` renders `<SignalField />` as its first child inside `<main>`.

- [ ] **Step 1: Write the failing test**

```tsx
test("renders the ambient casino signal field", () => {
  render(<Home />);
  expect(document.querySelector(".signal-field")).toHaveAttribute("aria-hidden", "true");
  expect(document.querySelectorAll(".signal-field__object")).toHaveLength(6);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/landing-page.test.tsx`

Expected: FAIL because `.signal-field` is absent.

- [ ] **Step 3: Add the component and mount it**

```tsx
export function SignalField() {
  return <div className="signal-field" aria-hidden="true"><svg className="signal-field__inner" viewBox="0 0 1440 900" focusable="false"><g className="signal-field__object signal-field__object--chip"><circle cx="164" cy="176" r="34" /></g><g className="signal-field__object signal-field__object--card"><rect x="1120" y="90" width="62" height="92" /></g><g className="signal-field__object signal-field__object--suit"><path d="M206 710c-36-42 34-72 0-114-34 42 36 72 0 114Z" /></g><g className="signal-field__object signal-field__object--chip"><circle cx="1260" cy="700" r="24" /></g><g className="signal-field__object signal-field__object--card"><rect x="406" y="510" width="44" height="66" /></g><g className="signal-field__object signal-field__object--suit"><path d="M960 456c-30-36 28-62 0-98-28 36 30 62 0 98Z" /></g></svg></div>;
}
```

Add `import { SignalField } from "../components/signal-field";` and render `<SignalField />` immediately inside `<main>`. Add:

```css
.signal-field { position: fixed; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; }
main > :not(.signal-field) { position: relative; z-index: 1; }
.signal-field__inner { width: 100%; height: 100%; }
.signal-field__object { fill: none; stroke: oklch(0.72 0.15 320 / 0.18); stroke-width: 1.5; transform-box: view-box; transform-origin: center; animation: signal-drift 16s ease-in-out infinite alternate; }
.signal-field__object--card { animation-delay: -6s; }.signal-field__object--suit { fill: oklch(0.72 0.15 320 / 0.1); animation-delay: -11s; }
@keyframes signal-drift { to { transform: translate3d(2rem, -1.5rem, 0) rotate(10deg); opacity: 0.35; } }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/landing-page.test.tsx`

Expected: PASS with the new signal-field test included.

- [ ] **Step 5: Commit**

```powershell
git add components/signal-field.tsx app/page.tsx app/globals.css tests/landing-page.test.tsx
git commit -m "feat: add ambient homepage signal field"
```

### Task 2: Upgrade the hero object and page transitions

**Files:**
- Modify: `components/orbit-console.tsx`
- Modify: `app/globals.css`
- Modify: `tests/landing-page.test.tsx`

**Interfaces:**
- Consumes: `OrbitConsole` remains rendered by `app/page.tsx` without props.
- Produces: `.orbit-console__sweep`, three `.orbit-console__satellite` elements, and CSS variables `--orbit-x` / `--orbit-y` for fine-pointer parallax.

- [ ] **Step 1: Write the failing test**

```tsx
test("renders hero signal sweep and satellites", () => {
  render(<Home />);
  expect(document.querySelector(".orbit-console__sweep")).toBeInTheDocument();
  expect(document.querySelectorAll(".orbit-console__satellite")).toHaveLength(3);
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- tests/landing-page.test.tsx`

Expected: FAIL because the sweep and satellites are absent.

- [ ] **Step 3: Add the hero motion structure and transitions**

Convert `orbit-console.tsx` to a client component. Use `useState` for `{ x, y }`; on fine-pointer movement map the pointer's position from console center to a maximum ±10px. Pass `style={{ "--orbit-x": `${x}px`, "--orbit-y": `${y}px` } as CSSProperties}` to `.orbit-console`.

Render before `.orbit-core`:

```tsx
<g className="orbit-console__sweep"><path d="M240 240L240 52A188 188 0 0 1 398 138Z" /></g>
<g className="orbit-console__satellites"><circle className="orbit-console__satellite" cx="390" cy="176" r="5" /><circle className="orbit-console__satellite" cx="128" cy="338" r="4" /><circle className="orbit-console__satellite" cx="304" cy="402" r="4" /></g>
```

Add:

```css
.orbit-console { transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1); transform: translate3d(var(--orbit-x, 0), var(--orbit-y, 0), 0); }
.orbit-console__sweep { fill: oklch(0.72 0.15 320 / 0.12); transform-box: view-box; transform-origin: center; animation: orbit-clockwise 5s linear infinite; }
.orbit-console__satellite { fill: var(--color-primary); transform-box: view-box; transform-origin: center; animation: satellite-pulse 1.8s ease-in-out infinite alternate; }
.orbit-console__satellite:nth-child(2) { animation-delay: -0.6s; }.orbit-console__satellite:nth-child(3) { animation-delay: -1.2s; }
.game-entry { transition: transform 220ms cubic-bezier(0.16, 1, 0.3, 1), border-color 220ms ease-out, background-color 220ms ease-out; }.game-entry:hover { transform: translateY(-0.35rem); border-color: var(--color-violet); background: oklch(0.2 0.025 300); }
@keyframes satellite-pulse { to { opacity: 0.35; transform: scale(1.65); } }
```

Extend the reduced-motion media query:

```css
.signal-field, .orbit-console__network, .orbit-console__particle-field, .orbit-console__sweep, .orbit-console__satellite { animation: none !important; }
.orbit-console { transform: none; transition: none; }
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test -- tests/landing-page.test.tsx`

Expected: PASS with all hero motion assertions.

- [ ] **Step 5: Verify and commit**

Run: `npm test; npm run lint; npm run build`

Expected: all tests, ESLint, and the production build pass.

```powershell
git add components/orbit-console.tsx app/globals.css tests/landing-page.test.tsx
git commit -m "feat: animate homepage signal console"
```
