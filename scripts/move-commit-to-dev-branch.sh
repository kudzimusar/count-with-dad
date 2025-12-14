#!/bin/bash

# Script: move-commit-to-dev-branch.sh
# Purpose: Safely move commits from main to v1.1-development branch
# Usage: ./scripts/move-commit-to-dev-branch.sh <commit-hash>
# Example: ./scripts/move-commit-to-dev-branch.sh cad6313

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if commit hash is provided
if [ -z "$1" ]; then
    echo -e "${RED}Error: Commit hash is required${NC}"
    echo "Usage: $0 <commit-hash>"
    echo "Example: $0 cad6313"
    exit 1
fi

COMMIT_HASH=$1
DEV_BRANCH="v1.1-development"
MAIN_BRANCH="main"

echo -e "${YELLOW}=== Moving commit $COMMIT_HASH to $DEV_BRANCH ===${NC}\n"

# Step 1: Fetch latest from remote
echo -e "${GREEN}[1/6] Fetching latest from remote...${NC}"
git fetch origin

# Step 2: Verify commit exists
echo -e "${GREEN}[2/6] Verifying commit exists...${NC}"
if ! git cat-file -e "$COMMIT_HASH" 2>/dev/null; then
    echo -e "${RED}Error: Commit $COMMIT_HASH not found${NC}"
    exit 1
fi

# Show commit details
echo -e "\n${YELLOW}Commit details:${NC}"
git show "$COMMIT_HASH" --stat --oneline | head -20
echo ""

# Step 3: Checkout or create dev branch
echo -e "${GREEN}[3/6] Checking out $DEV_BRANCH...${NC}"
if git show-ref --verify --quiet refs/heads/$DEV_BRANCH; then
    git checkout $DEV_BRANCH
    git pull origin $DEV_BRANCH 2>/dev/null || true
else
    if git show-ref --verify --quiet refs/remotes/origin/$DEV_BRANCH; then
        git checkout -b $DEV_BRANCH origin/$DEV_BRANCH
    else
        echo -e "${YELLOW}Creating new branch $DEV_BRANCH from main...${NC}"
        git checkout -b $DEV_BRANCH origin/main
    fi
fi

# Step 4: Cherry-pick the commit
echo -e "${GREEN}[4/6] Cherry-picking commit...${NC}"
if git cherry-pick "$COMMIT_HASH"; then
    echo -e "${GREEN}✓ Cherry-pick successful${NC}"
else
    echo -e "${RED}Error: Cherry-pick failed. Resolve conflicts and run:${NC}"
    echo "  git cherry-pick --continue"
    echo "  git push origin $DEV_BRANCH"
    exit 1
fi

# Step 5: Amend commit message to follow PLAN.md format (if needed)
echo -e "${GREEN}[5/6] Checking commit message format...${NC}"
CURRENT_MSG=$(git log -1 --pretty=%B)
if [[ ! "$CURRENT_MSG" =~ "\[PLAN.md:" ]]; then
    echo -e "${YELLOW}Commit message doesn't follow PLAN.md format.${NC}"
    echo -e "${YELLOW}Current message:${NC}"
    echo "$CURRENT_MSG"
    echo ""
    read -p "Amend commit message to follow PLAN.md format? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit type (feat/fix/docs/refactor): " COMMIT_TYPE
        read -p "Enter PLAN.md section: " PLAN_SECTION
        read -p "Enter commit subject: " COMMIT_SUBJECT
        
        NEW_MSG="$COMMIT_TYPE: $COMMIT_SUBJECT [PLAN.md: $PLAN_SECTION]"
        git commit --amend -m "$NEW_MSG"
        echo -e "${GREEN}✓ Commit message amended${NC}"
    fi
else
    echo -e "${GREEN}✓ Commit message already follows PLAN.md format${NC}"
fi

# Step 6: Push to remote
echo -e "${GREEN}[6/6] Pushing to origin/$DEV_BRANCH...${NC}"
read -p "Push to remote? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin $DEV_BRANCH
    echo -e "${GREEN}✓ Pushed to origin/$DEV_BRANCH${NC}"
else
    echo -e "${YELLOW}Skipped push. Run manually: git push origin $DEV_BRANCH${NC}"
fi

# Step 7: Reset main branch (optional)
echo ""
read -p "Reset main branch to match origin/main? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${GREEN}Resetting main branch...${NC}"
    git checkout $MAIN_BRANCH
    git reset --hard origin/$MAIN_BRANCH
    echo -e "${GREEN}✓ Main branch reset${NC}"
    echo -e "${YELLOW}Switched back to $DEV_BRANCH${NC}"
    git checkout $DEV_BRANCH
fi

# Final verification
echo ""
echo -e "${GREEN}=== Verification ===${NC}"
echo -e "${YELLOW}Current branch:${NC} $(git branch --show-current)"
echo -e "${YELLOW}Latest commit on $DEV_BRANCH:${NC}"
git log --oneline -1
echo ""
echo -e "${GREEN}✓ Process complete!${NC}"
echo -e "${YELLOW}Commit $COMMIT_HASH has been moved to $DEV_BRANCH${NC}"

