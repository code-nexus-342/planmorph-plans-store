
-- Update user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'professional';

-- Create professional_roles table
CREATE TABLE IF NOT EXISTS professional_roles (
    id SERIAL PRIMARY KEY,
    role_type VARCHAR(50) UNIQUE NOT NULL,
    display_name VARCHAR(100) NOT NULL,
    icon_name VARCHAR(50) NOT NULL, -- Storing icon name as string (e.g., 'DollarSign')
    color VARCHAR(20) NOT NULL,
    base_path VARCHAR(100) NOT NULL,
    api_endpoint VARCHAR(100) NOT NULL,
    widgets JSONB NOT NULL DEFAULT '[]',
    nav_items JSONB NOT NULL DEFAULT '[]',
    capabilities TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create professional_profiles table
CREATE TABLE IF NOT EXISTS professional_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    role_id INTEGER REFERENCES professional_roles(id),
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    bio TEXT,
    status application_status DEFAULT 'approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
