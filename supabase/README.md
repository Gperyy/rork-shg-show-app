# Supabase Setup Guide

This guide will help you set up Supabase for the SHG Show App.

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Fill in the project details:
   - **Name**: SHG Show App (or any name you prefer)
   - **Database Password**: Choose a strong password
   - **Region**: Choose the closest region to your users
5. Click "Create new project" (this may take a few minutes)

## Step 2: Create the Database Table

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the contents of `supabase/schema.sql` file
4. Click "Run" to execute the SQL

This will create:
- `users` table with columns: id, name, email, phone, created_at, updated_at
- Index on email for faster lookups
- Row Level Security (RLS) policies
- Automatic timestamp updates

## Step 3: Get Your API Keys

1. In your Supabase project dashboard, go to **Settings** > **API**
2. Find the following values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`

## Step 4: Configure Your App

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Open `.env` and update the Supabase values:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. **Important**: Never commit `.env` to git! It's already in `.gitignore`.

## Step 5: Test the Connection

1. Start your backend server:
   ```bash
   npm run backend
   ```

2. Start your app:
   ```bash
   npm start
   ```

3. Try registering a new user in the app

4. Check your Supabase dashboard:
   - Go to **Table Editor** > **users**
   - You should see the new user record

## Troubleshooting

### "Supabase is not configured" error
- Make sure you added the environment variables to `.env`
- Restart your backend server after adding the variables
- Check that the values are correct (no extra spaces)

### "Email already registered" error
- This is expected behavior if you try to register with the same email twice
- Either use a different email or delete the user from Supabase dashboard

### Database connection errors
- Verify your Project URL is correct
- Check that your anon key is correct and hasn't expired
- Make sure the users table was created successfully

## Security Notes

- The current RLS policy allows all operations. For production, you should restrict this.
- Never expose your `service_role` key in the app - only use the `anon` key.
- Consider adding authentication (Supabase Auth) for better security.

## Next Steps

- Add user authentication (login/logout)
- Implement proper RLS policies for production
- Add more user fields as needed
- Set up realtime subscriptions for live updates
