# Manual Testing Guide - Task 7

## Quick Start

1. Start the dev server:
   ```bash
   cd /Users/jterleski/Documents/Claude/schulz
   npm run dev
   ```

2. Open browser to the URL shown (likely http://localhost:5173/ or http://localhost:5174/)

## Full Navigation Test Checklist

### 1. Initial Load Test
- [ ] Chapter 0 "Meet Good Ol' Sparky" loads
- [ ] Snoopy character image visible
- [ ] Speech bubble with text appears
- [ ] Yellow/orange gradient background visible
- [ ] ☰ (hamburger) menu button in top-right corner
- [ ] "Card 1 of 4" indicator at top
- [ ] Progress dots show 4 total cards

### 2. Card Navigation Test
- [ ] Click "Next" button
- [ ] Card 2 appears with Charlie Brown
- [ ] Speech bubble animates in
- [ ] Progress dots update (2nd dot highlighted)
- [ ] Click "Next" again → Card 3
- [ ] Click "Next" again → Card 4
- [ ] Click "Back" → returns to Card 3
- [ ] Click "Back" repeatedly → returns to Card 1

### 3. Chapter Navigation Test
- [ ] Navigate to last card of Chapter 0 (Card 4)
- [ ] Click "Next Chapter" button
- [ ] App transitions to Chapter 1 "Baby Sparky Gets His Name"
- [ ] Red chapter title bar at top shows new chapter name
- [ ] Sally character appears as guide
- [ ] Navigate through all cards in Chapter 1

### 4. Table of Contents Test
- [ ] Click ☰ menu button
- [ ] Side panel slides in from right
- [ ] All 8 chapters listed:
  - Chapter 0: Meet Good Ol' Sparky
  - Chapter 1: Baby Sparky Gets His Name
  - Chapter 2: Spike - The Amazing Dog!
  - Chapter 3: Never Give Up!
  - Chapter 4: Creating Peanuts
  - Chapter 5: The Real Peanuts Gang
  - Chapter 6: Sparky's Amazing Life
  - Chapter 7: You're Ready!
- [ ] Current chapter highlighted in orange
- [ ] Visited chapters show checkmark
- [ ] Character preview images visible
- [ ] Click Chapter 3 "Never Give Up!"
- [ ] TOC closes automatically
- [ ] App jumps to Chapter 3
- [ ] Charlie Brown appears as guide

### 5. State Persistence Test
- [ ] Navigate to Chapter 4
- [ ] Note current card position
- [ ] Refresh browser (F5 or Cmd+R)
- [ ] App returns to Chapter 4, same position
- [ ] Visited chapters still marked in TOC
- [ ] Open browser DevTools (F12)
- [ ] Go to Application → Local Storage
- [ ] Find "schulz-app-state" entry
- [ ] Verify currentChapter and visitedChapters saved

### 6. Final Chapter Test
- [ ] Jump to Chapter 7 "You're Ready!"
- [ ] Navigate through all cards
- [ ] On last card, click "Next Chapter"
- [ ] Confetti animation plays
- [ ] Celebration complete

### 7. Animation Test
- [ ] Observe character entrance animations:
  - bounce: Character bounces up and down
  - slide: Character slides in from left
  - wiggle: Character wiggles/rotates
  - sparkle: Character scales and rotates
- [ ] Speech bubbles pop in with spring animation
- [ ] Page transitions are smooth (no flickering)
- [ ] TOC panel slides in/out smoothly

## Mobile Viewport Testing

### Setup Mobile View
1. Open Chrome DevTools (F12)
2. Click Toggle Device Toolbar (Ctrl+Shift+M or Cmd+Shift+M)
3. Select device from dropdown

### Test on iPhone SE (375x667)
- [ ] All text readable
- [ ] Buttons large enough to tap
- [ ] Character images scale properly
- [ ] Speech bubbles don't overflow
- [ ] TOC fills full screen width
- [ ] Menu button accessible in corner

### Test on iPad (768x1024)
- [ ] Layout uses more horizontal space
- [ ] Text sizes appropriate
- [ ] TOC panel is narrower (not full screen)
- [ ] Images larger and clearer

### Test Portrait vs Landscape
- [ ] Rotate to landscape orientation
- [ ] Layout adjusts properly
- [ ] All content still accessible
- [ ] No horizontal scrolling required

## Content Verification

### Check Each Chapter Has:
- [ ] Chapter 0: 4 cards, Snoopy & Charlie Brown
- [ ] Chapter 1: 4 cards, Sally, child-schulz photo
- [ ] Chapter 2: 5 cards, Snoopy, young-schulz photo
- [ ] Chapter 3: 5 cards, Charlie Brown
- [ ] Chapter 4: 5 cards, Snoopy-Author, schulz-with-characters photo
- [ ] Chapter 5: 7 cards, multiple characters, Franklin appears
- [ ] Chapter 6: 6 cards, various Snoopy versions, old-schulz photo
- [ ] Chapter 7: 4 cards, peanuts-gang, confetti celebration

### Verify Content Quality:
- [ ] All text is age-appropriate (5-year-old level)
- [ ] No spelling or grammar errors
- [ ] Facts about Schulz are accurate
- [ ] Story flows naturally chapter to chapter
- [ ] Character dialogue feels authentic

## Performance Testing

### Initial Load
- [ ] App loads in < 3 seconds on first visit
- [ ] Fonts load properly (no FOUT/FOIT)
- [ ] Images load progressively

### Navigation Performance
- [ ] Card transitions < 500ms
- [ ] Chapter transitions smooth
- [ ] TOC opens/closes instantly
- [ ] No lag or stuttering

### Check Console
- [ ] Open DevTools Console (F12)
- [ ] Verify no error messages (red)
- [ ] Verify no warning messages (yellow)
- [ ] Look for React or Vite errors

## Accessibility Quick Check

### Keyboard Navigation
- [ ] Tab through all buttons
- [ ] Focus indicators visible
- [ ] Can activate buttons with Enter/Space
- [ ] Can close TOC with Escape key (if implemented)

### Screen Reader (Optional)
- [ ] Turn on screen reader (VoiceOver on Mac, NVDA on Windows)
- [ ] Verify alt text on images
- [ ] Verify button labels are announced
- [ ] Verify content is read in logical order

## Issues to Report

If you encounter any issues, note:
1. What you were doing
2. What you expected to happen
3. What actually happened
4. Which chapter/card you were on
5. Browser and device used
6. Any error messages in console

## Success Criteria

All tests should pass:
- ✓ Full navigation through all 8 chapters works
- ✓ TOC opens, closes, and chapter jumping works
- ✓ State persists across page refreshes
- ✓ Mobile viewport displays correctly
- ✓ Animations play smoothly
- ✓ No console errors
- ✓ All content is appropriate and accurate

## Next Steps After Testing

If all tests pass:
1. App is ready for use with your son
2. Consider deploying to Cloudflare Pages (Task 8)
3. Gather user feedback during first use
4. Make any refinements based on feedback

If tests fail:
1. Document specific failures
2. Check console for error messages
3. Report issues for debugging
4. Verify all components from Tasks 1-6 are complete
