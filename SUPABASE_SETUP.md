# Supabase Setup Instructions

Follow these steps to connect your own Supabase account to this app:

## Step 1: Create a Supabase Account

1. Go to [supabase.com](https://supabase.com)
2. Click "Start your project"
3. Sign up with GitHub, Google, or email

## Step 2: Create a New Project

1. Click "New Project"
2. Choose an organization (or create one)
3. Enter project details:
   - **Name**: Choose any name (e.g., "kids-learning-app")
   - **Database Password**: Choose a strong password (save it somewhere safe)
   - **Region**: Choose closest to your users
   - **Pricing Plan**: Select "Free" tier
4. Click "Create new project"
5. Wait 2-3 minutes for project setup

## Step 3: Get Your API Credentials

1. In your Supabase dashboard, click on your project
2. Go to **Settings** (gear icon) → **API**
3. Copy the following values:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

## Step 4: Add Credentials to Count to 100 App

1. Create a file named `.env` in your project root
2. Add these lines (replace with your actual values):

```env
VITE_SUPABASE_URL=https://supabase.com/dashboard/project/xtaeinfspztjzhplzcsw
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0YWVpbmZzcHp0anpocGx6Y3N3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0Nzc0ODYsImV4cCI6MjA3NzA1MzQ4Nn0.SF30wRrZDjhDchANzUz5-Ar92fpOouAbTOiedZUb5iI
```

3. Save the file

## Step 5: Run Database Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy the entire contents of `supabase/migrations/20240101000000_initial_schema.sql`
4. Paste it into the SQL editor
5. Click "Run" to execute the migration
6. You should see "Success. No rows returned"

## Step 6: Configure Authentication

1. Go to **Authentication** → **Providers** in your Supabase dashboard
2. Enable **Email** provider (it's usually enabled by default)
3. Go to **Authentication** → **URL Configuration**
4. Add your app URL to **Redirect URLs**:
   - Development: `http://localhost:5173/*`
   - Production: Add your deployed URL when ready

## Step 7: Verify Setup

1. Restart your local development server
2. The app should now connect to your Supabase database
3. Try creating an account to test the connection

## Troubleshooting

### "Missing Supabase environment variables" error
- Make sure your `.env` file is in the project root
- Verify the variable names start with `VITE_`
- Restart the development server

### Can't create account
- Check that the SQL migration ran successfully
- Verify RLS policies are enabled in **Authentication** → **Policies**

### Data not saving
- Check **Database** → **Tables** to see if tables were created
- Review RLS policies in the SQL editor

## What's Next?

Your app now has:
- ✅ User authentication (sign up/login)
- ✅ Cloud database for storing profiles and progress
- ✅ Analytics tracking
- ✅ Feedback collection
- ✅ Session history
- ✅ Automatic data backup

All data is stored in YOUR Supabase account, which you fully control!

## Useful Links

- [Supabase Dashboard](https://app.supabase.com)
- [Supabase Documentation](https://supabase.com/docs)
- [SQL Editor](https://app.supabase.com/project/_/sql)
- [Table Editor](https://app.supabase.com/project/_/editor)
- [Authentication Settings](https://app.supabase.com/project/_/auth/users)
