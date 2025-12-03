-- Create Custom Design Requests Table
CREATE TABLE IF NOT EXISTS custom_design_requests (
    id SERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    project_type VARCHAR(100) NOT NULL,
    budget_range VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    plot_size VARCHAR(100),
    location VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending', -- pending, contacted, in_progress, completed, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Contact Messages Table
CREATE TABLE IF NOT EXISTS contact_messages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'unread', -- unread, read, replied, archived
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Drop Professional Tables (Cleanup)
DROP TABLE IF NOT EXISTS structural_drawings CASCADE;
DROP TABLE IF NOT EXISTS survey_records CASCADE;
DROP TABLE IF NOT EXISTS hr_records CASCADE;
DROP TABLE IF NOT EXISTS financial_records CASCADE;
DROP TABLE IF NOT EXISTS analytics_metrics CASCADE;
DROP TABLE IF NOT EXISTS professional_activities CASCADE;
DROP TABLE IF NOT EXISTS professional_profiles CASCADE;
DROP TABLE IF NOT EXISTS role_applications CASCADE;
DROP TABLE IF NOT EXISTS job_roles CASCADE;
DROP TABLE IF NOT EXISTS architect_profiles CASCADE;
DROP TABLE IF NOT EXISTS architect_applications CASCADE;

-- Drop unused types if possible (might fail if used by other things, so use CASCADE carefully or ignore)
-- We won't drop types to avoid complex dependency issues for now, but we could.
