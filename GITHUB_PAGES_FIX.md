# GitHub Pages Deployment Fix

## Issue
The `v1.1-development` branch is blocked from deploying to `github-pages` environment due to protection rules.

## Solution Options

### Option 1: Update GitHub Environment Settings (Recommended)

1. Go to your repository: `https://github.com/kudzimusar/count-with-dad`
2. Click **Settings** → **Environments**
3. Click on **github-pages** environment
4. Under **Deployment branches**, add `v1.1-development`:
   - Click "Add branch"
   - Enter: `v1.1-development`
   - Save

**OR** if you want to allow all branches:
- Change "Deployment branches" to "All branches"

### Option 2: Use Separate Preview Environment

I've created a new workflow `deploy-preview.yml` that uses a different environment name (`github-pages-preview`). This will:
- Deploy v1.1-development changes to a preview environment
- Not conflict with main branch deployments
- Allow you to test changes before merging to main

**To use this:**
1. The workflow file is already created: `.github/workflows/deploy-preview.yml`
2. Commit and push it
3. It will create a separate deployment environment

### Option 3: Deploy Only from Main (Current Behavior)

Keep the current setup where only `main` branch deploys to production GitHub Pages. This is the safest approach for production.

## Recommended Action

**For immediate fix:**
1. Go to: `https://github.com/kudzimusar/count-with-dad/settings/environments`
2. Click **github-pages**
3. Under **Deployment branches**, add `v1.1-development`
4. Save changes
5. Re-run the workflow or push a new commit

**For long-term:**
- Use Option 2 (preview environment) for development branches
- Keep main branch for production deployments
- This gives you a preview URL for v1.1-development changes

## Quick Fix Steps

1. **Open GitHub Settings:**
   ```
   https://github.com/kudzimusar/count-with-dad/settings/environments
   ```

2. **Edit github-pages environment:**
   - Click on "github-pages"
   - Scroll to "Deployment branches"
   - Click "Add branch"
   - Type: `v1.1-development`
   - Click "Save protection rules"

3. **Re-run the workflow:**
   - Go to Actions tab
   - Find the failed workflow
   - Click "Re-run all jobs"

## Alternative: Manual Deployment

If you want to see the changes immediately without changing settings:

1. Merge v1.1-development to main (when ready)
2. Or manually trigger deployment from main branch
3. Or use the preview workflow I created

---

**Status**: Waiting for environment settings update

