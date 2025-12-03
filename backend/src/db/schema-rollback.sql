-- Rollback Script for Schema Extensions
-- Run this to revert the schema-extensions.sql changes

-- Drop triggers
DROP TRIGGER IF EXISTS update_structural_drawings_updated_at ON structural_drawings;
DROP TRIGGER IF EXISTS update_survey_records_updated_at ON survey_records;
DROP TRIGGER IF EXISTS update_hr_records_updated_at ON hr_records;
DROP TRIGGER IF EXISTS update_financial_records_updated_at ON financial_records;
DROP TRIGGER IF EXISTS update_professional_profiles_updated_at ON professional_profiles;
DROP TRIGGER IF EXISTS update_role_applications_updated_at ON role_applications;
DROP TRIGGER IF EXISTS update_job_roles_updated_at ON job_roles;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables (in reverse order of dependencies)
DROP TABLE IF EXISTS structural_drawings;
DROP TABLE IF EXISTS survey_records;
DROP TABLE IF EXISTS hr_records;
DROP TABLE IF EXISTS financial_records;
DROP TABLE IF EXISTS analytics_metrics;
DROP TABLE IF EXISTS professional_activities;
DROP TABLE IF EXISTS professional_profiles;
DROP TABLE IF EXISTS role_applications;
DROP TABLE IF EXISTS job_roles;

-- Drop new ENUM types
DROP TYPE IF EXISTS activity_type;
DROP TYPE IF EXISTS job_status;
DROP TYPE IF EXISTS professional_role;

-- Restore original users role constraint
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
    CHECK (role IN ('client', 'architect', 'admin'));

-- Note: This rollback does not restore data that was migrated
-- Always backup your database before running migrations
