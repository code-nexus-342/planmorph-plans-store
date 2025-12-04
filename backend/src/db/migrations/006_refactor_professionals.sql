-- Create professional_roles table
CREATE TABLE professional_roles (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed initial roles
INSERT INTO professional_roles (name, description) VALUES
('Architect', 'Designs buildings and structures'),
('Structural Engineer', 'Analyzes and designs structural components'),
('Civil Engineer', 'Designs and oversees construction of infrastructure'),
('Surveyor', 'Measures and maps land'),
('Interior Designer', 'Designs interior spaces'),
('Landscape Architect', 'Designs outdoor spaces');

-- Create professionals table (extends users)
CREATE TABLE professionals (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    professional_role_id INTEGER REFERENCES professional_roles(id),
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    bio TEXT,
    experience_years INTEGER,
    portfolio_url VARCHAR(255),
    cv_url VARCHAR(255),
    id_document_url VARCHAR(255),
    status application_status DEFAULT 'approved',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create professional_applications table
CREATE TABLE professional_applications (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    professional_role_id INTEGER REFERENCES professional_roles(id), -- Can be null if it's a new custom role request, but for now let's enforce existing or create new on fly
    custom_role_name VARCHAR(255), -- If they entered a new role
    bio TEXT,
    experience_years INTEGER,
    portfolio_url VARCHAR(255),
    cv_url VARCHAR(255),
    id_document_url VARCHAR(255),
    status application_status DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Update users table role enum (Postgres doesn't support renaming enum values easily, so we add 'professional' and will migrate data)
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'professional';

-- Update designs table to reference professional_id (which is user_id) but semantically clearer
ALTER TABLE designs RENAME COLUMN architect_id TO professional_id;

-- Drop old architect tables if they exist (assuming we can drop them or migrate data first. For this refactor, we'll drop)
DROP TABLE IF EXISTS architect_profiles CASCADE;
DROP TABLE IF EXISTS architect_applications CASCADE;
