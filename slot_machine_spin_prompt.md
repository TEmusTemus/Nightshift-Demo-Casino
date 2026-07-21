## Prompt: Add Spin Animation to Slot Machine

I have a slot machine web app (see attached screenshot/codebase) that currently 
updates the reel symbols instantly when the "Spin" button is clicked, with no 
animation. I want to add a realistic spinning animation.

### Requirements:

1. **Animation behavior**
   - When the user clicks "Spin", each of the 3 reels should visually scroll/spin 
     through multiple symbols vertically before landing on the final result.
   - Reels should stop one after another (staggered), not all at the exact same 
     time — e.g., reel 1 stops first, then reel 2, then reel 3, with a ~200-300ms 
     delay between each.
   - Use an ease-out easing curve so the spin looks fast at first and slows down 
     smoothly before stopping.
   - Total spin duration per reel: around 1.5–2.5 seconds.

2. **Visual implementation**
   - Use `overflow: hidden` on each reel container so only one symbol is visible 
     at a time.
   - Animate using CSS `transform: translateY()` (not `top`/`margin`) for best 
     performance.
   - Repeat the symbol list several times inside the strip so the scroll looks 
     continuous and doesn't "run out" of symbols before stopping.

3. **Logic / state handling**
   - The final result for each reel must be determined by the existing game 
     logic (server or client-side random function) BEFORE the animation starts, 
     so the animation always ends on the correct symbol.
   - Disable the "Spin" button and the bet amount input while spinning is in 
     progress, and re-enable them once all reels have stopped.
   - Show the payout text ("X · Y · Z — payout N chips") only after the last 
     reel has fully stopped.

4. **Tech stack**
   - [Specify your actual stack here, e.g.: React + Tailwind CSS / plain 
     HTML+CSS+JS / Vue / etc.]
   - Keep the existing dark theme (black background, red accent color, bold 
     white/red text) and current layout structure — only add the spin animation 
     logic, don't redesign the UI.

5. **Bonus (optional, implement if easy)**
   - Add a subtle "blur" effect on the reel while it's spinning fast, then 
     remove the blur as it slows down, to simulate motion blur.
   - Add a small sound effect trigger point (just call a placeholder function 
     `playSpinSound()` / `playStopSound()`, I'll add the audio files later).

Please generate the code with clear comments explaining each part of the 
animation logic, and make sure it integrates cleanly with my existing 
component/state structure without breaking current functionality (balance 
deduction, bet validation, payout calculation).
