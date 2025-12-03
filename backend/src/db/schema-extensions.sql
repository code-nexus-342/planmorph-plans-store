-- Schema Extensions for Enhanced Professional System
-- This file extends the existing schema with new tables for role management,
-- professional activities, and analytics

-- New ENUM types
CREATE TYPE professional_role AS ENUM ('finance_manager', 'hr_manager', 'civil_engineer', 'surveyor', 'architect');
CREATE TYPE job_status AS ENUM ('open', 'closed', 'draft');
CREATE TYPE activity_type AS ENUM ('login', 'upload', 'create', 'update', 'delete', 'approve', 'reject');

-- Job Roles Table
-- Stores company positions that can be applied for
CREATE TABLE job_roles (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    role_type professional_role NOT NULL,
    description TEXT,
    requirements TEXT[], -- Array of requirement strings
    responsibilities TEXT[], -- Array of responsibility strings
    qualifications TEXT[], -- Array of qualification strings
    department VARCHAR(100),
    status job_status DEFAULT 'draft',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

-- Role Applications Table
-- Stores applications for specific job roles
CREATE TABLE role_applications (
    id SERIAL PRIMARY KEY,
    role_id INTEGER REFERENCES job_roles(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    bio TEXT,
    experience_years INTEGER,
    portfolio_url VARCHAR(500),
    cv_url VARCHAR(500),
    certificates_urls TEXT[], -- Array of certificate URLs
    id_document_url VARCHAR(500),
    cover_letter TEXT,
    status application_status DEFAULT 'pending',
    reviewed_by INTEGER REFERENCES users(id),
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Professional Profiles Table
-- Extended profiles for all professional types
CREATE TABLE professional_profiles (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    role_type professional_role NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone_number VARCHAR(50),
    bio TEXT,
    experience_years INTEGER,
    portfolio_url VARCHAR(500),
    department VARCHAR(100),
    hire_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Professional Activities Table
-- Tracks all professional activities for analytics
CREATE TABLE professional_activities (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    activity_type activity_type NOT NULL,
    entity_type VARCHAR(50), -- e.g., 'design', 'employee', 'survey'
    entity_id INTEGER,
    description TEXT,
    metadata JSONB, -- Additional activity data
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Analytics Metrics Table
-- Stores aggregated metrics for admin dashboard
CREATE TABLE analytics_metrics (
    id SERIAL PRIMARY KEY,
    metric_type VARCHAR(100) NOT NULL, -- e.g., 'user_growth', 'revenue', 'applications'
    metric_value DECIMAL(15, 2),
    metric_data JSONB, -- Additional metric details
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Financial Records Table
-- For Finance Manager role
CREATE TABLE financial_records (
    id SERIAL PRIMARY KEY,
    created_by INTEGER REFERENCES users(id),
    record_type VARCHAR(50) NOT NULL, -- 'income', 'expense', 'budget'
    category VARCHAR(100),
    amount DECIMAL(15, 2) NOT NULL,
    description TEXT,
    transaction_date DATE NOT NULL,
    reference_number VARCHAR(100),
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- HR Records Table
-- For HR Manager role
CREATE TABLE hr_records (
    id SERIAL PRIMARY KEY,
    created_by INTEGER REFERENCES users(id),
    record_type VARCHAR(50) NOT NULL, -- 'employee', 'payment', 'leave'
    employee_id INTEGER REFERENCES users(id),
    employee_name VARCHAR(255),
    position VARCHAR(100),
    department VARCHAR(100),
    amount DECIMAL(15, 2), -- For payments
    payment_status VARCHAR(50), -- 'pending', 'released', 'cancelled'
    payment_date DATE,
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Survey Records Table
-- For Surveyor role
CREATE TABLE survey_records (
    id SERIAL PRIMARY KEY,
    surveyor_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    coordinates JSONB, -- {lat, lng}
    survey_type VARCHAR(100), -- 'land', 'topographic', 'boundary'
    status VARCHAR(50) DEFAULT 'in_progress', -- 'in_progress', 'completed', 'reviewed'
    survey_date DATE,
    completion_date DATE,
    report_url VARCHAR(500),
    findings TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Structural Drawings Table
-- For Civil Engineer role
CREATE TABLE structural_drawings (
    id SERIAL PRIMARY KEY,
    engineer_id INTEGER REFERENCES users(id),
    design_id INTEGER REFERENCES designs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    drawing_url VARCHAR(500) NOT NULL,
    drawing_type VARCHAR(100), -- 'foundation', 'framing', 'structural'
    version INTEGER DEFAULT 1,
    status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'review', 'approved'
    notes TEXT,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for Performance Optimization
CREATE INDEX idx_professional_activities_user_created ON professional_activities(user_id, created_at DESC);
CREATE INDEX idx_professional_activities_type ON professional_activities(activity_type);
CREATE INDEX idx_role_applications_status_role ON role_applications(status, role_id);
CREATE INDEX idx_role_applications_email ON role_applications(email);
CREATE INDEX idx_job_roles_status ON job_roles(status);
CREATE INDEX idx_analytics_metrics_type_date ON analytics_metrics(metric_type, date DESC);
CREATE INDEX idx_financial_records_date ON financial_records(transaction_date DESC);
CREATE INDEX idx_hr_records_type_status ON hr_records(record_type, payment_status);
CREATE INDEX idx_survey_records_surveyor_status ON survey_records(surveyor_id, status);
CREATE INDEX idx_structural_drawings_design ON structural_drawings(design_id);
CREATE INDEX idx_structural_drawings_engineer ON structural_drawings(engineer_id);
CREATE INDEX idx_professional_profiles_role ON professional_profiles(role_type);

-- Update existing users table to support new professional roles
-- First, add new values to the existing user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'finance_manager';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'hr_manager';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'civil_engineer';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'surveyor';

-- Migrate existing architect_profiles to new professional_profiles
INSERT INTO professional_profiles (user_id, role_type, full_name, phone_number, bio, experience_years, portfolio_url, created_at, updated_at)
SELECT 
    user_id, 
    'architect'::professional_role, 
    full_name, 
    phone_number, 
    bio, 
    experience_years, 
    portfolio_url,
    created_at,
    updated_at
FROM architect_profiles
ON CONFLICT (user_id) DO NOTHING;

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_job_roles_updated_at BEFORE UPDATE ON job_roles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_role_applications_updated_at BEFORE UPDATE ON role_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_professional_profiles_updated_at BEFORE UPDATE ON professional_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_financial_records_updated_at BEFORE UPDATE ON financial_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_hr_records_updated_at BEFORE UPDATE ON hr_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_survey_records_updated_at BEFORE UPDATE ON survey_records FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_structural_drawings_updated_at BEFORE UPDATE ON structural_drawings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
