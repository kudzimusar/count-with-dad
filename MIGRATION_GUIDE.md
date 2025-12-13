# Supabase Migration Guide

This guide explains how to use Supabase migrations for automated database changes.

## Prerequisites

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   # Or using Homebrew (macOS)
   brew install supabase/tap/supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link Your Project**
   ```bash
   npm run db:link
   # Or manually:
   supabase link --project-ref your-project-ref-id
   ```
   
   Get your project reference ID from: https://app.supabase.com/project/_/settings/general

## Creating Migrations

### 1. Create a New Migration

```bash
npm run db:migrate:new add_user_preferences
```

This creates a file: `supabase/migrations/YYYYMMDDHHMMSS_add_user_preferences.sql`

### 2. Write Your Migration SQL

Edit the migration file with your SQL changes:

```sql
-- Add user preferences table
create table if not exists public.user_preferences (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  theme text default 'light',
  sound_enabled boolean default true,
  created_at timestamptz default now()
);

-- Enable RLS
alter table public.user_preferences enable row level security;

-- Create RLS policies
create policy "Users can view own preferences"
  on public.user_preferences for select
  using (auth.uid() = user_id);

create policy "Users can update own preferences"
  on public.user_preferences for update
  using (auth.uid() = user_id);
```

### 3. Test Migration Locally (Optional)

If you have local Supabase running:
```bash
npm run db:reset  # Resets and applies all migrations
```

## Applying Migrations

### Apply to Production

```bash
npm run db:migrate
```

This pushes all pending migrations to your linked Supabase project.

### Check Migration Status

```bash
npm run db:status
```

Lists all migrations and their status.

## Migration Best Practices

### ✅ DO

- Use `IF NOT EXISTS` for tables/columns
- Use `DROP POLICY IF EXISTS` before creating policies
- Include comments explaining the migration
- Test migrations on a development branch first
- Keep migrations small and focused
- Use transactions for complex migrations

### ❌ DON'T

- Never modify existing migration files
- Don't delete migration files that have been applied
- Don't include data migrations in schema migrations (use separate files)
- Don't hardcode user IDs or other dynamic values
- Don't skip testing migrations

## Example Migration Workflow

### Adding a New Feature

1. **Create Migration**
   ```bash
   npm run db:migrate:new add_premium_features
   ```

2. **Write SQL**
   ```sql
   -- Add premium_features table
   create table if not exists public.premium_features (
     id uuid primary key default gen_random_uuid(),
     user_id uuid references auth.users(id) on delete cascade not null,
     feature_name text not null,
     enabled boolean default false,
     created_at timestamptz default now()
   );
   
   -- Enable RLS
   alter table public.premium_features enable row level security;
   
   -- RLS policies
   create policy "Users can view own features"
     on public.premium_features for select
     using (auth.uid() = user_id);
   ```

3. **Test Locally** (if applicable)
   ```bash
   npm run db:reset
   ```

4. **Commit Migration**
   ```bash
   git add supabase/migrations/
   git commit -m "migration: Add premium features table [PLAN.md: Database Schema]"
   ```

5. **Apply to Production**
   ```bash
   npm run db:migrate
   ```

## Troubleshooting

### Migration Fails

1. Check the error message in Supabase dashboard
2. Verify SQL syntax is correct
3. Check if objects already exist (use `IF NOT EXISTS`)
4. Review RLS policies

### Rollback

Supabase doesn't support automatic rollbacks. To rollback:

1. Create a new migration that reverses the changes
2. Or manually fix the database via SQL Editor
3. Document the rollback in PLAN.md

### Migration Already Applied

If you see "migration already applied" errors:
- Check migration status: `npm run db:status`
- Verify you're linked to the correct project
- Check Supabase dashboard for applied migrations

## Using MCP Supabase Tools

You can also use the MCP Supabase tools directly:

```typescript
// Apply migration via MCP
mcp_supabase_apply_migration({
  name: "add_user_preferences",
  query: "CREATE TABLE ..."
})
```

This is useful for:
- Quick schema changes during development
- Testing migrations before committing
- Applying migrations in CI/CD pipelines

## Integration with Deployment

### Automated Deployment Workflow

1. **Before Deployment**
   ```bash
   npm run db:migrate  # Apply database migrations
   ```

2. **Build Frontend**
   ```bash
   npm run build
   ```

3. **Deploy**
   - Push to GitHub
   - GitHub Pages auto-deploys

### CI/CD Integration

Add to your GitHub Actions workflow:

```yaml
- name: Run Database Migrations
  run: |
    npm install -g supabase
    supabase login --token ${{ secrets.SUPABASE_ACCESS_TOKEN }}
    supabase link --project-ref ${{ secrets.SUPABASE_PROJECT_REF }}
    npm run db:migrate
```

## Resources

- [Supabase Migrations Docs](https://supabase.com/docs/guides/cli/local-development#database-migrations)
- [Supabase CLI Reference](https://supabase.com/docs/reference/cli)
- [PostgreSQL Migration Best Practices](https://www.postgresql.org/docs/current/ddl-alter.html)

