

# Fix: Registration Modal Keeps Reappearing

## Root Cause

The registration modal reappears because of a logic conflict between the profile existence check and the onboarding completion flag. Specifically:

1. When a user signs in, state resets to defaults (`hasCompletedOnboarding: false`, `childName: ''`)
2. The Supabase `handle_new_user` trigger auto-creates a profile row with empty `child_name` on signup
3. The modal check at line 454 (`if (user && !state.childName)`) forces the modal open even when the user has already completed onboarding, because `childName` from the auto-created profile is empty
4. There is also a race condition: if the profile was saved with data but the cloud load returns the trigger-created empty row (or fails due to timing), the modal shows again

## Fix Strategy

### Fix 1: Update the registration modal display logic in `Index.tsx`

The current check at line 448 requires BOTH `childName` AND `hasCompletedOnboarding` to suppress the modal. This is too strict. The fix:

- **Primary gate**: Trust `hasCompletedOnboarding` as the sole flag for whether the modal should show
- **Secondary gate**: Only use `childName` as a fallback check for legacy users who may not have the flag set
- Add a check that verifies if the profile exists in Supabase (has a `child_name` value) before deciding to show the modal

**Before (broken):**
```
if (user && state.childName && state.hasCompletedOnboarding) {
  setRegistrationModalOpen(false);  // requires BOTH conditions
}
if (user && !state.childName) {
  setRegistrationModalOpen(true);  // overrides hasCompletedOnboarding!
}
```

**After (fixed):**
```
// If onboarding is complete, never show the modal
if (state.hasCompletedOnboarding) {
  setRegistrationModalOpen(false);
  return;
}
// For signed-in users without onboarding, check if profile exists in cloud
if (user && !state.hasCompletedOnboarding && !state.childName) {
  setRegistrationModalOpen(true);
  return;
}
```

### Fix 2: Persist `hasCompletedOnboarding` to Supabase (not just localStorage)

Currently, `hasCompletedOnboarding` lives only in localStorage. When localStorage is cleared on sign-out/sign-in, it is lost. The fix:

- When loading profile from Supabase, check if `child_name` is non-empty as a proxy for onboarding completion
- Set `hasCompletedOnboarding: true` whenever the loaded profile has a valid `child_name` (not just when `profileResult.data` exists)

**In the data loading effect (around line 286):**
```
if (profileResult.data) {
  const hasValidProfile = !!profileResult.data.child_name;
  setState(prev => ({
    ...prev,
    childName: profileResult.data.child_name || '',
    childAge: profileResult.data.child_age || prev.childAge,
    childAvatar: profileResult.data.child_avatar || prev.childAvatar,
    hasCompletedOnboarding: hasValidProfile,  // Only true if child_name exists
  }));
}
```

### Fix 3: Fix the guest-to-user merge path

In the merge logic (line 273), the current code:
```
hasCompletedOnboarding: guestState.hasCompletedOnboarding || !!profileResult.data
```

This sets `true` even if the profile was auto-created by the trigger with empty data. Fix:
```
hasCompletedOnboarding: guestState.hasCompletedOnboarding || !!profileResult.data?.child_name
```

## Files to Modify

1. **`src/pages/Index.tsx`** - Three targeted changes:
   - Registration modal display logic (lines 441-469)
   - Cloud data loading - profile check (lines 286-297)
   - Guest merge - onboarding flag (line 273)

## What This Fixes

- Users who have already registered will no longer see the registration modal on every login
- The `hasCompletedOnboarding` flag is correctly derived from actual profile data (non-empty `child_name`), not just the existence of a database row
- Guest-to-user migration correctly detects whether a real profile exists

## What Stays the Same

- All Supabase hooks, data fetching, and save logic remain unchanged
- The registration modal UI and flow remain unchanged
- The `handle_new_user` trigger continues to work as before
