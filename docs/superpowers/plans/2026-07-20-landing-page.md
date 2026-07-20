# NIGHTSHIFT Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive public NIGHTSHIFT landing page with working placeholder routes for authentication and games.

**Architecture:** Use a Next.js App Router application with semantic, server-rendered page shells and small client components only for the mobile menu and orbit-scene motion. Central CSS custom properties define the near-black, crimson, and violet visual system; page sections remain independently reusable.

**Tech Stack:** Next.js App Router, React, TypeScript, CSS Modules, Vitest, React Testing Library, Playwright.

## Global Constraints

- Use virtual chips only; never imply payments, deposits, or real-money prizes.
- Meet WCAG 2.1 AA, including keyboard paths, visible focus, 44px touch targets, and reduced motion.
- Use near-black and graphite surfaces, crimson primary action, and limited electric-violet status energy.
- Use semantic CSS/SVG for the orbit scene; do not add generated-raster dependencies.
- Keep user-facing copy in English and route names exactly `/`, `/login`, `/signup`, `/slot`, and `/baccarat`.

---

## File Structure

- `app/layout.tsx`: shared metadata and global stylesheet import.
- `app/page.tsx`: landing-page composition.
- `app/(public)/[page]/page.tsx`: reusable placeholder-route shell instances.
- `components/navigation.tsx`: responsive navigation and accessible mobile disclosure.
- `components/orbit-console.tsx`: decorative, accessible SVG hero scene.
- `components/game-entry.tsx`: distinct Slot and Baccarat call-to-action panel.
- `components/placeholder-page.tsx`: consistent non-game placeholder route content.
- `styles/tokens.css` and `app/globals.css`: visual primitives, typography, responsive and reduced-motion rules.
- `tests/*.test.tsx` and `e2e/landing.spec.ts`: component and browser coverage.

### Task 1: Scaffold the Next.js foundation and test harness

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `vitest.config.ts`, `playwright.config.ts`
- Create: `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `styles/tokens.css`
- Create: `tests/setup.ts`

**Interfaces:**
- Produces: an `npm run dev`, `npm run test`, `npm run build`, and `npm run test:e2e` workflow.
- Produces: global token names consumed by all later components: `--color-bg`, `--color-surface`, `--color-ink`, `--color-muted`, `--color-primary`, `--color-violet`.

- [ ] **Step 1: Initialize the repository, application manifest, and test tools**

Run: `git init`

Run: `npm init -y`

Run: `npm install next react react-dom`

Run: `npm install -D typescript @types/node @types/react @types/react-dom eslint eslint-config-next vitest @vitejs/plugin-react jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event playwright`

Set the scripts in `package.json` to:

```json
{
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint .",
  "test": "vitest run",
  "test:e2e": "playwright test"
}
```

Expected: the project has a valid Git repository and `package.json` contains `dev`, `build`, `lint`, `test`, and `test:e2e` scripts.

- [ ] **Step 2: Add a failing layout-token test**

Create `tests/tokens.test.ts`:

```ts
import { readFileSync } from "node:fs";
import { expect, test } from "vitest";

test("defines the NIGHTSHIFT surface and signal tokens", () => {
  const css = readFileSync("styles/tokens.css", "utf8");
  expect(css).toContain("--color-primary");
  expect(css).toContain("--color-violet");
  expect(css).toContain("--color-bg");
});
```

- [ ] **Step 3: Run the test to verify it fails**

Run: `npm run test -- tests/tokens.test.ts`

Expected: FAIL because `styles/tokens.css` does not exist.

- [ ] **Step 4: Add global design primitives and layout shell**

Create `styles/tokens.css`:

```css
:root {
  --color-bg: oklch(0.08 0 0);
  --color-surface: oklch(0.14 0.01 280);
  --color-ink: oklch(0.96 0 0);
  --color-muted: oklch(0.72 0.01 280);
  --color-primary: oklch(0.61 0.22 25);
  --color-violet: oklch(0.67 0.21 300);
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
}
```

Import the token stylesheet from `app/globals.css`; set a dark document background, `font-kerning: normal`, and `color-scheme: dark`. In `app/layout.tsx`, set the title to `NIGHTSHIFT — Virtual Chips, Controlled Energy` and wrap children in `<body>`.

- [ ] **Step 5: Run the token test and production build**

Run: `npm run test -- tests/tokens.test.ts`

Expected: PASS.

Run: `npm run build`

Expected: exit code 0.

- [ ] **Step 6: Commit the foundation**

```bash
git add package.json package-lock.json tsconfig.json next.config.ts vitest.config.ts playwright.config.ts app styles tests
git commit -m "chore: scaffold NIGHTSHIFT landing page"
```

### Task 2: Build the navigation, orbit hero, and game-entry surface

**Files:**
- Create: `components/navigation.tsx`, `components/orbit-console.tsx`, `components/game-entry.tsx`
- Modify: `app/page.tsx`, `app/globals.css`
- Test: `tests/landing-page.test.tsx`

**Interfaces:**
- Consumes: global color and spacing tokens from Task 1.
- Produces: `<Navigation />`, `<OrbitConsole />`, and `<GameEntry title href description />` for public pages.

- [ ] **Step 1: Write failing landing-page tests**

Create `tests/landing-page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import Home from "@/app/page";
import { expect, test } from "vitest";

test("offers demo-account creation and game routes", () => {
  render(<Home />);
  expect(screen.getByRole("link", { name: /create demo account/i })).toHaveAttribute("href", "/signup");
  expect(screen.getByRole("link", { name: /play slot/i })).toHaveAttribute("href", "/slot");
  expect(screen.getByRole("link", { name: /play baccarat/i })).toHaveAttribute("href", "/baccarat");
});

test("states that play uses virtual chips only", () => {
  render(<Home />);
  expect(screen.getByText(/virtual chips only/i)).toBeInTheDocument();
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/landing-page.test.tsx`

Expected: FAIL because the hero links and disclosure do not exist.

- [ ] **Step 3: Implement the semantic landing-page composition**

Implement `app/page.tsx` with these landmark-level elements:

```tsx
<main>
  <Navigation />
  <section aria-labelledby="hero-title">
    <p>VIRTUAL-CHIP CASINO</p>
    <h1 id="hero-title">Control the night. Play with virtual chips.</h1>
    <p>Precision-built Slot and Baccarat for focused demo play.</p>
    <a href="/signup">Create demo account</a>
    <a href="#games">Explore games</a>
    <OrbitConsole />
  </section>
  <section id="games" aria-labelledby="games-title">
    <h2 id="games-title">Choose your table.</h2>
    <GameEntry title="Slot" href="/slot" description="Three reels. Pure momentum." />
    <GameEntry title="Baccarat" href="/baccarat" description="Player, banker, and disciplined odds." />
  </section>
  <aside aria-label="Demo currency notice">NIGHTSHIFT uses virtual chips only. No real-money play or prizes.</aside>
</main>
```

`OrbitConsole` must use `aria-hidden="true"` SVG circles, paths, and nodes; it must contain no raster image or embedded text. `GameEntry` must return an `<article>` with a text heading and an accessible `Play ${title}` link.

- [ ] **Step 4: Apply responsive and interaction styles**

In `app/globals.css`, use `clamp()` only for the hero heading, keep body text at `1rem`, make all links and buttons at least `44px` high, and add `:focus-visible` outlines using `--color-violet`. Use a two-column game section above `48rem` and a one-column layout below it. Add this reduced-motion rule:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 5: Run component tests and build**

Run: `npm run test -- tests/landing-page.test.tsx`

Expected: PASS.

Run: `npm run build`

Expected: exit code 0.

- [ ] **Step 6: Commit the landing page**

```bash
git add app components tests/landing-page.test.tsx
git commit -m "feat: add NIGHTSHIFT landing page"
```

### Task 3: Add placeholder destination routes and end-to-end coverage

**Files:**
- Create: `components/placeholder-page.tsx`
- Create: `app/login/page.tsx`, `app/signup/page.tsx`, `app/slot/page.tsx`, `app/baccarat/page.tsx`
- Create: `e2e/landing.spec.ts`
- Test: `tests/placeholder-page.test.tsx`

**Interfaces:**
- Consumes: `PlaceholderPage({ title, description, returnHref })`.
- Produces: keyboard-reachable destinations that make navigation functional before authentication and games are implemented.

- [ ] **Step 1: Write failing placeholder-route tests**

Create `tests/placeholder-page.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react";
import Signup from "@/app/signup/page";
import { expect, test } from "vitest";

test("signup placeholder returns visitors to the landing page", () => {
  render(<Signup />);
  expect(screen.getByRole("heading", { name: /create your demo account/i })).toBeInTheDocument();
  expect(screen.getByRole("link", { name: /back to NIGHTSHIFT/i })).toHaveAttribute("href", "/");
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npm run test -- tests/placeholder-page.test.tsx`

Expected: FAIL because the signup route does not exist.

- [ ] **Step 3: Implement the route shell and route pages**

Implement the shared interface:

```tsx
type PlaceholderPageProps = {
  title: string;
  description: string;
};

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return <main><h1>{title}</h1><p>{description}</p><a href="/">Back to NIGHTSHIFT</a></main>;
}
```

Render it with these exact route messages:

```tsx
// /login: "Sign in" / "Demo sign-in arrives with the account phase."
// /signup: "Create your demo account" / "Demo registration arrives with the account phase."
// /slot: "Slot" / "The virtual-chip slot table is being prepared."
// /baccarat: "Baccarat" / "The virtual-chip baccarat table is being prepared."
```

- [ ] **Step 4: Add browser navigation coverage**

Create `e2e/landing.spec.ts`:

```ts
import { expect, test } from "@playwright/test";

test("landing page routes visitors to signup and Slot", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: /create demo account/i }).click();
  await expect(page).toHaveURL(/\/signup$/);
  await page.getByRole("link", { name: /back to NIGHTSHIFT/i }).click();
  await page.getByRole("link", { name: /play slot/i }).click();
  await expect(page).toHaveURL(/\/slot$/);
});
```

- [ ] **Step 5: Run route tests, E2E test, and build**

Run: `npm run test -- tests/placeholder-page.test.tsx`

Expected: PASS.

Run: `npm run test:e2e -- e2e/landing.spec.ts`

Expected: PASS with one test.

Run: `npm run build`

Expected: exit code 0.

- [ ] **Step 6: Perform visual QA and commit**

Run the dev server and inspect the landing page at desktop, tablet, and mobile widths. Verify keyboard focus, the collapsed mobile navigation, 200% zoom, and reduced motion. Then run `$impeccable audit app components` followed by `$impeccable polish app/page.tsx`.

```bash
git add app components e2e tests
git commit -m "feat: add public casino route shells"
```

## Self-Review

- Spec coverage: Tasks 1–3 cover the Next.js foundation, Orbit Console design, all required routes, responsive navigation, virtual-chip disclosure, keyboard behavior, reduced motion, and visual verification.
- Placeholder scan: no unfinished requirements or ambiguous route names remain.
- Type consistency: `GameEntry` uses `title`, `href`, and `description`; `PlaceholderPage` uses `title` and `description`; all route targets match the landing-page specification.
