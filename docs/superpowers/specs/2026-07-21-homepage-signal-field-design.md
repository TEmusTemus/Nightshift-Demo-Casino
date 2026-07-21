# Homepage Signal Field Design

## Goal

Make the homepage feel active and technical through a sparse field of moving casino objects, taking motion cues from Hermes Agent's prominent kinetic hero object while retaining the casino's dark, controlled-neon visual system.

## Experience

- The hero orbit console becomes the focal moving object: asymmetric satellite paths, orbiting nodes, a measured radar sweep, and subtle pointer parallax on fine-pointer devices.
- Decorative chips, card silhouettes, and suit marks move slowly in three independent ambient layers behind the hero and game-list content. They remain low-contrast, non-interactive, and never cover readable content or controls.
- Existing game-entry cards gain short transform-and-glow hover transitions. Buttons retain their existing quick lift behavior.
- The design uses a small fixed set of CSS/SVG elements and compositor-friendly `transform` and `opacity` animations; no external animation package is introduced.

## Accessibility and Performance

- All decorative objects are `aria-hidden`.
- `prefers-reduced-motion: reduce` disables the moving layers and pointer response while leaving every page and control fully usable.
- Motion does not block navigation, game selection, or input. The longest decorative loop is slow and continuous; interactive transitions remain under 250ms.

## Verification

- Component tests assert the signal-field layers and hero motion hooks render.
- Browser verification confirms the orbiting hero object changes position across frames.
- Run the full test suite, lint, and production build.
