
# Fix: Addition Difficulty Progression and Auto-Level Advancement

## Problem 1: Too Many Zero-Addition Problems

The addition problem generator uses `randomInt(0, ...)` for both operands. This means operands frequently start at 0, producing questions like `0 + 1 = ?` across all levels, even up to Level 10.

**Root cause** in `src/utils/mathProblems.ts` line 151:
```
const num1 = randomInt(0, Math.floor(config.operandMax / 2));
const num2 = randomInt(0, Math.min(config.maxSum - num1, config.operandMax));
```

**Fix**: Change the minimum operand to 1 for all levels, ensuring every problem involves actual addition. For higher levels, increase the minimum further to ensure distinct difficulty:

- Levels 1-3: Both operands start at 1 (e.g., 1+1, 2+3)
- Levels 4-6: First operand starts at 2 (e.g., 2+4, 3+5)
- Levels 7-10: First operand starts at 3 (e.g., 3+6, 5+8)
- Levels 11+: First operand starts at 5 (e.g., 5+7, 8+12)

## Problem 2: Levels Feel the Same

The `getAdditionConfig` in `ageBasedDifficulty.ts` only defines 5 tiers per age. Levels 6-20 use a simple 15% multiplier on Level 5's config, but since the operand minimum is always 0, the range expansion is barely noticeable.

**Fix**: Ensure each level bracket produces noticeably different questions by using level-scaled minimums and introducing variety (doubles, near-doubles, making-10 strategies at higher levels).

## Problem 3: No Auto-Level Advancement

When a user passes a level and clicks "Next Level" in the `LevelCompleteModal`, the flow is:
1. `onNext` calls `handleComplete` in `MathGameContainer`
2. `handleComplete` calls `onComplete(result)` which goes to `MathScreen.handleGameComplete`
3. `handleGameComplete` records progress but does NOT update `currentLevel`
4. `MathGameContainer` closes the modal but stays on the same level

**Fix**: In `MathGameContainer`, when the user passes a level and clicks "Next Level", auto-advance `currentLevel` by 1 before calling `onComplete`. This triggers the `useEffect` that regenerates problems for the new level, and the UI header updates to show the new level number.

---

## Files to Modify

### 1. `src/utils/mathProblems.ts` (lines 146-204)

Update `generateAdditionBasicProblems` to:
- Set minimum operand based on level (never 0)
- Add problem variety at higher levels (doubles, near-doubles)
- Ensure visible difficulty progression between level ranges

```
Level 1-2:  1+1 to 2+3 range (sums up to 5)
Level 3-4:  2+2 to 3+4 range (sums up to 8)
Level 5-6:  2+3 to 5+7 range (sums up to 12)
Level 7-8:  3+4 to 7+8 range (sums up to 15)
Level 9-10: 4+5 to 8+10 range (sums up to 18)
Level 11+:  Missing addend problems introduced
```

### 2. `src/components/math/MathGameContainer.tsx` (handleComplete function)

Add auto-level advancement:
- When `passed` is true, increment `currentLevel` by 1 (capped at `maxLevel`)
- This triggers the existing `useEffect` to regenerate problems at the new level
- The level indicator in the header updates automatically

### 3. `src/utils/ageBasedDifficulty.ts` (getAdditionConfig, lines 78-147)

Expand the 5-tier config to 10 tiers per age so levels 1-10 each have distinct parameters. The current system only defines levels 1-5, making levels 6-10 feel interpolated and samey.

---

## Expected Outcome

- Level 1 starts with simple problems like 1+1, 1+2, 2+1
- Each level introduces noticeably harder numbers
- By Level 5, children see problems like 4+5, 3+6
- By Level 10, problems reach 8+9, 7+8 (for age 5)
- Zero is never an operand (no more "0 + 1 = ?")
- Completing a level automatically advances to the next level
- The level number updates on screen so the child sees their progress
