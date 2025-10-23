-- Add email verification OTP fields to users table
-- Migration: 003_add_email_verification_otp.sql

-- Add columns only if they don't exist
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verification_token') THEN
        ALTER TABLE users ADD COLUMN email_verification_token VARCHAR(10);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'email_verification_expires') THEN
        ALTER TABLE users ADD COLUMN email_verification_expires TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Add index for faster lookup
CREATE INDEX IF NOT EXISTS idx_users_email_verification_token ON users(email_verification_token) WHERE email_verification_token IS NOT NULL;
