# Count to 100 - Development Plan

**Last Updated**: 2024-12-12  
**Status**: Active Development

## Overview

This document serves as the single source of truth for all development decisions, architecture choices, and workflow processes for the Count to 100 kids learning app.

## Project Information

- **Project Name**: Count to 100 (Counting Fun!)
- **Type**: Progressive Web App (PWA)
- **Target Audience**: Children ages 3-8
- **Tech Stack**: React 18 + TypeScript + Vite + Supabase + Tailwind CSS

## Architecture Decisions

### Backend: Supabase
- **Decision**: Use Supabase for authentication, database, and analytics
- **Rationale**: 
  - Serverless backend reduces infrastructure management
  - Built-in authentication and RLS policies
  - Real-time capabilities for future features
  - Free tier suitable for MVP
- **Migration Strategy**: Automated via Supabase CLI

### Database Schema
- **Tables**: profiles, progress, session_history, feedback, analytics_events
- **Security**: Row Level Security (RLS) enabled on all tables
- **Migrations**: Version-controlled in `supabase/migrations/`

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **State Management**: TanStack Query (React Query) for server state
- **UI Components**: shadcn-ui (Radix UI primitives)
- **Styling**: Tailwind CSS with custom theme

## Development Workflow

### Phase-Based Development

1. **Planning Phase**
   - Update PLAN.md with feature requirements
   - Create migration files for schema changes
   - Document API contracts

2. **Development Phase**
   - Create feature branch: `git checkout -b feature/feature-name`
   - Implement changes following code standards
   - Write/update tests if applicable

3. **Migration Phase** (for database changes)
   - Create migration: `npm run db:migrate:new feature_name`
   - Test migration locally
   - Commit migration file

4. **Testing Phase**
   - Manual testing on target devices
   - Verify database migrations
   - Check RLS policies

5. **Deployment Phase**
   - Run migrations: `npm run db:migrate`
   - Build production: `npm run build`
   - Deploy to GitHub Pages
   - Verify production deployment

### Quality Gates

Before merging any PR:
- [ ] Code passes ESLint checks
- [ ] TypeScript compiles without errors
- [ ] Database migrations tested locally
- [ ] Manual testing completed
- [ ] PLAN.md updated if architecture changed

### Commit Standards

All commits must reference PLAN.md when applicable:

```
feat: Add progress tracking feature [PLAN.md: Database Schema]

- Add progress table migration
- Implement progress tracking hooks
- Update PLAN.md with new schema details
```

Format: `<type>: <subject> [PLAN.md: <section>]`

Types: `feat`, `fix`, `docs`, `refactor`, `test`, `chore`, `migration`

## Database Management

### Migration Workflow

1. **Create New Migration**
   ```bash
   npm run db:migrate:new descriptive_name
   ```

2. **Edit Migration File**
   - File created in `supabase/migrations/YYYYMMDDHHMMSS_descriptive_name.sql`
   - Write SQL for schema changes

3. **Test Migration Locally** (if using local Supabase)
   ```bash
   npm run db:reset  # Resets and applies all migrations
   ```

4. **Apply to Production**
   ```bash
   npm run db:migrate  # Pushes migrations to linked project
   ```

5. **Check Migration Status**
   ```bash
   npm run db:status  # Lists all migrations
   ```

### Migration Best Practices

- Always use `IF NOT EXISTS` for tables/columns
- Use `DROP POLICY IF EXISTS` before creating policies
- Test migrations on a copy of production data if possible
- Never modify existing migration files (create new ones)
- Include rollback considerations in migration comments

### Linking Supabase Project

1. Get project reference ID from Supabase dashboard
2. Link project:
   ```bash
   npm run db:link
   # Enter project reference when prompted
   ```
3. Or set in `supabase/config.toml`:
   ```toml
   [project]
   project_id = "your-project-ref"
   ```

## Deployment Process

### Automated Deployment

1. **Database Migrations**
   - Migrations are applied via Supabase CLI
   - Run before frontend deployment
   - Command: `npm run db:migrate`

2. **Frontend Build**
   - Build command: `npm run build`
   - Output: `dist/` directory
   - Deploy to GitHub Pages

3. **Environment Variables**
   - Production: Set in GitHub Pages environment
   - Required: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`

### Manual Deployment Checklist

- [ ] Run database migrations: `npm run db:migrate`
- [ ] Verify migrations applied successfully
- [ ] Update environment variables if needed
- [ ] Build frontend: `npm run build`
- [ ] Test production build locally: `npm run preview`
- [ ] Deploy to GitHub Pages
- [ ] Verify production site works
- [ ] Test authentication flow
- [ ] Verify database connectivity

## Feature Development Guidelines

### Adding New Features

1. **Database Changes**
   - Create migration file
   - Update PLAN.md schema section
   - Test RLS policies

2. **Frontend Changes**
   - Create feature branch
   - Follow component structure
   - Use TypeScript types
   - Update PLAN.md if architecture changes

3. **Testing**
   - Manual testing on target devices
   - Verify on multiple browsers
   - Test offline functionality (PWA)

## Current Features

### Implemented
- ✅ User authentication (Supabase Auth)
- ✅ Progress tracking
- ✅ Session history
- ✅ Feedback collection
- ✅ Analytics events
- ✅ Parent dashboard
- ✅ Counting activities (3 modes)
- ✅ Puzzle games
- ✅ Math challenges
- ✅ Star rewards system

### Planned
- [ ] Premium subscription features
- [ ] Cloud sync across devices
- [ ] Progress export (JSON)
- [ ] Enhanced analytics dashboard
- [ ] Multi-child support

## Security Considerations

- All tables have RLS enabled
- User data isolated by `auth.uid()`
- API keys stored in environment variables
- No sensitive data in client-side code
- COPPA compliance maintained

## Performance Targets

- Initial load: < 3 seconds
- Offline functionality: Full PWA support
- Database queries: Optimized with indexes
- Image loading: Lazy loading implemented

## Known Issues & Technical Debt

- [ ] Add automated tests
- [ ] Improve error handling
- [ ] Add loading states
- [ ] Optimize bundle size

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [React Query Documentation](https://tanstack.com/query)
- [shadcn-ui Components](https://ui.shadcn.com/)
- [Vite Documentation](https://vitejs.dev/)

---

**Note**: This PLAN.md should be updated whenever:
- New features are added
- Architecture decisions are made
- Database schema changes
- Deployment process changes
- New dependencies are added

