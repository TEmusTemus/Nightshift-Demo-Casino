# Slot spin and orbit motion design

## Goal

Make slot play read as a real machine sequence—full-speed spinning first, then one reel result at a time—while making the homepage orbit console a striking but controlled ambient visual.

## Slot sequence

- The API determines all three final symbols and payout before any landing state begins.
- Each reel has `spinning`, `landing`, and `settled` visual states.
- All reels first loop through a repeated symbol strip at high speed for a short lead-in.
- Reel one, two, and three then enter their landing state in order and decelerate onto their predetermined symbols at approximately 1.7s, 2.0s, and 2.3s.
- The Spin button and bet input remain disabled through the final landing; balance and payout text are withheld until reel three settles.
- The existing virtual-chip settlement, validation, and sound-hook boundaries remain unchanged.
- Reduced-motion users receive the known final state without the prolonged spin/landing timeline.

## Homepage orbit console

- Preserve the existing SVG console and dark, restrained visual system.
- Animate rings at distinct, counter-rotating speeds.
- Move nodes around their respective rings, pulse the core halo, and periodically sweep path highlights.
- Add low-density ambient particles and subtle pointer-reactive console tilt only where supported.
- Keep all visual layers `aria-hidden`, avoid layout animation, and provide a static reduced-motion alternative.

## Verification

- Add component tests for the slot’s full spin lead-in, sequential landing states, control lock, delayed payout, and reduced motion.
- Add a home-page structure test for the motion layers where practical.
- Run unit tests, lint, and production build; manually inspect the home and slot pages at desktop and mobile widths.
