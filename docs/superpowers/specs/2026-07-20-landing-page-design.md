# Landing Page Design

## Goal

Create the public entry page for NIGHTSHIFT, a virtual-chip casino demo. It introduces the product, directs new players to registration, lets visitors preview Slot and Baccarat, and establishes the visual system for later account and game screens.

## Chosen Direction

Use the approved Orbit Console composition: a quiet midnight-control-room hero, a restrained orbital control sculpture, and a compact game-selection rail that leads into the first game entries. The interface is predominantly near-black and graphite, with crimson for primary action and a small electric-violet pulse for active or energetic moments.

## Routes and Navigation

- `/`: landing page.
- `/login` and `/signup`: working placeholder pages with clear return navigation.
- `/slot` and `/baccarat`: working placeholder game routes.
- Sticky navigation exposes Home, Games, Account, Sign in, and Create demo account.
- Create demo account links to `/signup`; Explore games scrolls to the game-entry area.

## Page Structure

1. Slim persistent navigation.
2. Hero: concise virtual-chip proposition, primary and secondary actions, and an abstract orbital signal rendered with semantic CSS/SVG.
3. Game selector rail for Slot and Baccarat.
4. Two distinct game-entry panels with an action per route; they must not become a generic identical-card grid.
5. Plain-language virtual-chip disclosure: no payments, no real-money prizes.

## Interaction and States

Buttons and links expose hover, focus-visible, active, disabled, and loading-ready styles. The mobile navigation collapses to an accessible menu. The Orbit Console responds only to meaningful interaction and respects `prefers-reduced-motion`. Placeholder pages communicate their status and give a clear route back home.

## Visual and Accessibility Rules

Use a technical sans for interface language and tabular monospace numerals only for balances and values. Maintain WCAG 2.1 AA contrast, semantic landmarks, keyboard navigation, 44px minimum touch targets, and non-color status cues. Do not use glassmorphism, gradient text, gold, indiscriminate neon, or real-money symbolism.

## Implementation Shape

Use Next.js as the foundation. Keep page sections and reusable primitives independently scoped: navigation, hero/orbit scene, game selector, game entry panel, disclosure, and placeholder route shell. The visual scene remains CSS/SVG so it scales sharply and does not depend on generated image assets.

## Verification

Check desktop, tablet, and mobile layouts; keyboard traversal; reduced motion; each route; and viewport zoom to 200%. Run the application build and an Impeccable audit/polish pass once code exists.
