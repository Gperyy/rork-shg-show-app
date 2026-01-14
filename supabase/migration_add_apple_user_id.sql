-- Migration: Add apple_user_id column to users table
-- Date: 2026-01-14
-- Description: Adds support for Apple Sign In authentication

-- Add apple_user_id column to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS apple_user_id TEXT UNIQUE;

-- Create index on apple_user_id for faster lookups
CREATE INDEX IF NOT EXISTS users_apple_user_id_idx ON public.users(apple_user_id);

-- Comment explaining the column
COMMENT ON COLUMN public.users.apple_user_id IS 'Unique Apple user identifier from Sign in with Apple';
