-- Add User Settings and Payment Methods Tables
-- This migration adds user settings management and payment methods

-- =====================================================
-- USER SETTINGS SYSTEM
-- =====================================================

-- User settings table for preferences
CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    
    -- Notification Settings
    email_notifications BOOLEAN DEFAULT true,
    marketing_emails BOOLEAN DEFAULT false, 
    push_notifications BOOLEAN DEFAULT true,
    
    -- Privacy Settings
    profile_visibility VARCHAR(20) DEFAULT 'public' CHECK (profile_visibility IN ('public', 'private', 'friends')),
    show_activity BOOLEAN DEFAULT true,
    show_purchases BOOLEAN DEFAULT false,
    
    -- Display Settings
    theme VARCHAR(10) DEFAULT 'light' CHECK (theme IN ('light', 'dark', 'auto')),
    language VARCHAR(5) DEFAULT 'en',
    timezone VARCHAR(50) DEFAULT 'UTC',
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Download Settings
    auto_download BOOLEAN DEFAULT false,
    download_quality VARCHAR(10) DEFAULT 'standard' CHECK (download_quality IN ('standard', 'high', 'premium')),
    download_format VARCHAR(10) DEFAULT 'pdf' CHECK (download_format IN ('pdf', 'dwg', 'both')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- PAYMENT METHODS SYSTEM
-- =====================================================

-- User payment methods for billing
CREATE TABLE IF NOT EXISTS payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Payment method details
    type VARCHAR(20) NOT NULL CHECK (type IN ('credit_card', 'debit_card', 'paypal', 'bank_account')),
    provider VARCHAR(20) NOT NULL DEFAULT 'stripe' CHECK (provider IN ('stripe', 'paypal')),
    
    -- Card/Account info (encrypted/tokenized)
    last_four_digits VARCHAR(4),
    brand VARCHAR(20), -- visa, mastercard, etc.
    exp_month INTEGER CHECK (exp_month >= 1 AND exp_month <= 12),
    exp_year INTEGER,
    cardholder_name VARCHAR(255),
    
    -- Provider-specific IDs
    stripe_payment_method_id VARCHAR(255),
    paypal_payer_id VARCHAR(255),
    
    -- Status and preferences
    is_default BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    
    -- Billing address
    billing_address JSONB, -- Store billing address as JSON
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- BILLING ADDRESSES SYSTEM
-- =====================================================

-- Billing addresses for users
CREATE TABLE IF NOT EXISTS billing_addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Address details
    street_address_1 VARCHAR(255) NOT NULL,
    street_address_2 VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(2) NOT NULL, -- ISO country code
    
    -- Contact info
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    company VARCHAR(255),
    phone VARCHAR(20),
    
    -- Status
    is_default BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- INDEXES AND CONSTRAINTS
-- =====================================================

-- User settings indexes
CREATE INDEX IF NOT EXISTS idx_user_settings_user_id ON user_settings(user_id);

-- Payment methods indexes
CREATE INDEX IF NOT EXISTS idx_payment_methods_user_id ON payment_methods(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_methods_default ON payment_methods(user_id, is_default) WHERE is_default = true;
CREATE INDEX IF NOT EXISTS idx_payment_methods_stripe ON payment_methods(stripe_payment_method_id) WHERE stripe_payment_method_id IS NOT NULL;

-- Billing addresses indexes
CREATE INDEX IF NOT EXISTS idx_billing_addresses_user_id ON billing_addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_addresses_default ON billing_addresses(user_id, is_default) WHERE is_default = true;

-- =====================================================
-- TRIGGERS FOR UPDATED_AT
-- =====================================================

-- Update timestamp triggers
DROP TRIGGER IF EXISTS update_user_settings_updated_at ON user_settings;
CREATE TRIGGER update_user_settings_updated_at 
    BEFORE UPDATE ON user_settings 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payment_methods_updated_at ON payment_methods;
CREATE TRIGGER update_payment_methods_updated_at 
    BEFORE UPDATE ON payment_methods 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_billing_addresses_updated_at ON billing_addresses;
CREATE TRIGGER update_billing_addresses_updated_at 
    BEFORE UPDATE ON billing_addresses 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- CONSTRAINTS FOR UNIQUE DEFAULTS
-- =====================================================

-- Ensure only one default payment method per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_payment_methods_user_default 
    ON payment_methods(user_id) 
    WHERE is_default = true;

-- Ensure only one default billing address per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_billing_addresses_user_default 
    ON billing_addresses(user_id) 
    WHERE is_default = true;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON TABLE user_settings IS 'User preference settings for notifications, privacy, display, and downloads';
COMMENT ON TABLE payment_methods IS 'User payment methods for billing and purchases';
COMMENT ON TABLE billing_addresses IS 'User billing addresses for payment processing';

-- =====================================================
-- DEFAULT SETTINGS FOR EXISTING USERS
-- =====================================================

-- Create default settings for existing users
INSERT INTO user_settings (user_id)
SELECT id FROM users
WHERE id NOT IN (SELECT user_id FROM user_settings);

