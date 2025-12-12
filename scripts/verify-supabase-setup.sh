#!/bin/bash

# Supabase Setup Verification Script
# This script helps verify your Supabase connection and setup

echo "🔍 Verifying Supabase Setup..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed"
    echo "   Install it with: npm install -g supabase"
    exit 1
else
    echo "✅ Supabase CLI is installed: $(supabase --version)"
fi

echo ""

# Check if logged in
if supabase projects list &> /dev/null; then
    echo "✅ Logged in to Supabase"
else
    echo "⚠️  Not logged in. Run: supabase login"
fi

echo ""

# Check if project is linked
if [ -f ".supabase/config.toml" ] || [ -f "supabase/.temp/project-ref" ]; then
    echo "✅ Project appears to be linked"
    if [ -f "supabase/.temp/project-ref" ]; then
        PROJECT_REF=$(cat supabase/.temp/project-ref)
        echo "   Project Reference: $PROJECT_REF"
    fi
else
    echo "⚠️  Project not linked"
    echo "   Link with: supabase link --project-ref <your-project-ref>"
    echo "   Get project ref from: https://app.supabase.com/project/_/settings/general"
fi

echo ""

# Check for .env file
if [ -f ".env" ]; then
    echo "✅ .env file exists"
    if grep -q "VITE_SUPABASE_URL" .env; then
        SUPABASE_URL=$(grep "VITE_SUPABASE_URL" .env | cut -d '=' -f2)
        echo "   Supabase URL: $SUPABASE_URL"
    else
        echo "   ⚠️  VITE_SUPABASE_URL not found in .env"
    fi
else
    echo "⚠️  .env file not found"
    echo "   Create it from .env.example and add your Supabase credentials"
fi

echo ""

# Check for migrations
if [ -d "supabase/migrations" ] && [ "$(ls -A supabase/migrations/*.sql 2>/dev/null)" ]; then
    MIGRATION_COUNT=$(ls -1 supabase/migrations/*.sql 2>/dev/null | wc -l)
    echo "✅ Found $MIGRATION_COUNT migration file(s)"
else
    echo "⚠️  No migration files found in supabase/migrations/"
fi

echo ""
echo "📋 Next Steps:"
echo "   1. Ensure you're logged in: supabase login"
echo "   2. Link your project: supabase link --project-ref <project-ref>"
echo "   3. Apply migrations: npm run db:migrate"
echo "   4. Verify tables exist in your Supabase dashboard"
echo ""

