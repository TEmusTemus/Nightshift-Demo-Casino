# Slot spin transition design

## Goal

Replace the slot machine's looping reel animation with a deterministic, staggered transition that visibly lands on the server-selected result.

## Behavior

- A spin requests and receives the final three symbols before reel motion starts.
- Each reel renders a vertically repeated strip of symbols whose final visible row is that reel's result.
- All reels begin together and move via `transform: translateY()` inside an overflow-hidden viewport.
- Reels stop at 1.7 seconds, 2.0 seconds, and 2.3 seconds using a fast-start, ease-out curve.
- A brief blur is applied while each reel moves and removed when it settles.
- The bet input and Spin button are disabled while the spin is active.
- Balance and payout status update only after the third reel has settled.
- A signed-out visitor still sees the existing spin preview before the sign-in message; no account mutation occurs.
- `playSpinSound()` and `playStopSound()` are no-op placeholders called at spin start and individual reel stops.
- Under reduced motion, reels resolve directly to the predetermined result without the prolonged animated transition.

## Implementation boundaries

- Update the existing `GameClient` slot state and markup only; baccarat behavior remains unchanged.
- Replace the infinite `reel-cycle` keyframe with transition-oriented CSS for a strip and a spinning/settled reel state.
- Preserve the existing dark theme and layout.
- Retain current server-side balance deduction, validation, and payout calculation without changes.

## Verification

- Add a component test proving all three reels enter the spinning state, bet input is disabled, and the controls stay locked until the final stop.
- Add a component test proving the payout status is withheld during the spin and rendered once all reels finish.
- Run the full unit suite, lint, and a production build.
