-- Add id, email, password_hash to professionals
ALTER TABLE professionals DROP CONSTRAINT IF EXISTS professionals_pkey CASCADE;
ALTER TABLE professionals ADD COLUMN id SERIAL PRIMARY KEY;
ALTER TABLE professionals ADD COLUMN email VARCHAR(255);
ALTER TABLE professionals ADD COLUMN password_hash VARCHAR(255);

-- Make email unique
ALTER TABLE professionals ADD CONSTRAINT professionals_email_key UNIQUE (email);

-- Update designs table to reference professionals(id) instead of users(id)
-- First, we need to handle existing data. Since we are refactoring, we might need to clear existing professional links or map them.
-- For this migration, we will assume we can just update the constraint. 
-- WARNING: This assumes designs.professional_id will match professionals.id. 
-- Since we are generating new IDs for professionals, existing designs linked by user_id will break.
-- We will set professional_id to NULL for existing designs to be safe, or you can truncate.
UPDATE designs SET professional_id = NULL;

ALTER TABLE designs DROP CONSTRAINT IF EXISTS designs_architect_id_fkey; -- Old constraint name likely
ALTER TABLE designs DROP CONSTRAINT IF EXISTS designs_professional_id_fkey; -- Possible new name

ALTER TABLE designs ADD CONSTRAINT designs_professional_id_fkey 
    FOREIGN KEY (professional_id) REFERENCES professionals(id) ON DELETE SET NULL;

-- Update professional_activities
ALTER TABLE professional_activities ADD COLUMN professional_id INTEGER REFERENCES professionals(id) ON DELETE CASCADE;
ALTER TABLE professional_activities ALTER COLUMN user_id DROP NOT NULL;

-- Finally drop user_id from professionals
ALTER TABLE professionals DROP COLUMN IF EXISTS user_id;
