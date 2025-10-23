-- PlanMorph Missing Core Tables Migration
-- This migration adds all the critical tables missing from the initial schema

-- =====================================================
-- CORE AUTHENTICATION & USER MANAGEMENT TABLES
-- =====================================================

-- Users table - Core authentication system
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255), -- NULL for OAuth users
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) DEFAULT 'customer' CHECK (role IN ('customer', 'architect', 'admin')),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    avatar_url VARCHAR(500),
    oauth_provider VARCHAR(20) CHECK (oauth_provider IN ('google', 'apple')),
    oauth_provider_id VARCHAR(255),
    subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'pro')),
    last_login_at TIMESTAMP WITH TIME ZONE,
    email_verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(oauth_provider, oauth_provider_id) DEFERRABLE INITIALLY DEFERRED
);

-- Refresh tokens for JWT management
CREATE TABLE IF NOT EXISTS refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_revoked BOOLEAN DEFAULT false,
    device_info JSONB, -- Store device/browser info
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    revoked_at TIMESTAMP WITH TIME ZONE,
    last_used_at TIMESTAMP WITH TIME ZONE
);

-- Password reset tokens
CREATE TABLE IF NOT EXISTS password_resets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email verification tokens
CREATE TABLE IF NOT EXISTS email_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- ARCHITECT PROFILES & MANAGEMENT
-- =====================================================

-- Architects table - Extended profiles for architects
CREATE TABLE IF NOT EXISTS architects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL,
    company_name VARCHAR(200),
    license_number VARCHAR(100),
    bio TEXT,
    portfolio_url VARCHAR(500),
    website_url VARCHAR(500),
    specialties TEXT[], -- Array of specializations
    years_experience INTEGER,
    education TEXT,
    certifications TEXT[],
    is_verified BOOLEAN DEFAULT false,
    verification_documents JSONB, -- Store verification doc URLs
    plan_count INTEGER DEFAULT 0,
    total_sales INTEGER DEFAULT 0,
    average_rating DECIMAL(3,2) DEFAULT 0.0,
    rating_count INTEGER DEFAULT 0,
    featured_until TIMESTAMP WITH TIME ZONE,
    subscription_tier VARCHAR(20) DEFAULT 'basic' CHECK (subscription_tier IN ('basic', 'pro', 'enterprise')),
    commission_rate DECIMAL(5,2) DEFAULT 15.00, -- Percentage commission
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- REVIEW & RATING SYSTEM
-- =====================================================

-- Reviews table - User reviews for plans
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    is_verified_purchase BOOLEAN DEFAULT false,
    helpful_votes INTEGER DEFAULT 0,
    reported_count INTEGER DEFAULT 0,
    is_hidden BOOLEAN DEFAULT false,
    moderator_notes TEXT,
    images TEXT[], -- Array of review image URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(plan_id, user_id) -- Prevent duplicate reviews per user per plan
);

-- Review votes - Users can vote reviews as helpful
CREATE TABLE IF NOT EXISTS review_votes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('helpful', 'not_helpful')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(review_id, user_id)
);

-- =====================================================
-- SHOPPING CART SYSTEM
-- =====================================================

-- Cart items table - Shopping cart functionality
CREATE TABLE IF NOT EXISTS cart_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1 CHECK (quantity > 0),
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, plan_id) -- Prevent duplicate items per user
);

-- =====================================================
-- PURCHASE & PAYMENT SYSTEM
-- =====================================================

-- Purchases table - Purchase history and tracking
CREATE TABLE IF NOT EXISTS purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    architect_id UUID REFERENCES architects(id), -- For commission tracking
    price_paid DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2), -- Track discounts
    discount_amount DECIMAL(10,2) DEFAULT 0,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    commission_amount DECIMAL(10,2) DEFAULT 0,
    payment_method VARCHAR(50) NOT NULL,
    payment_processor VARCHAR(50) DEFAULT 'stripe',
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    paypal_payment_id VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'disputed')),
    failure_reason TEXT,
    notes TEXT,
    purchased_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    refunded_at TIMESTAMP WITH TIME ZONE,
    refund_amount DECIMAL(10,2),
    refund_reason TEXT
);

-- Purchase items - For future cart-based purchases
CREATE TABLE IF NOT EXISTS purchase_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    purchase_id UUID NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- FILE DOWNLOAD SYSTEM
-- =====================================================

-- Downloads table - Secure file download management
CREATE TABLE IF NOT EXISTS downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES plan_files(id) ON DELETE CASCADE,
    purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL,
    download_token VARCHAR(255) NOT NULL UNIQUE,
    downloaded_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    download_count INTEGER DEFAULT 0,
    max_downloads INTEGER DEFAULT 5,
    ip_address INET,
    user_agent TEXT,
    file_size_bytes BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SESSION & ANALYTICS TABLES
-- =====================================================

-- User sessions - Track user activity and analytics
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) NOT NULL UNIQUE,
    ip_address INET,
    user_agent TEXT,
    device_type VARCHAR(50), -- mobile, desktop, tablet
    browser VARCHAR(50),
    os VARCHAR(50),
    country VARCHAR(2), -- ISO country code
    city VARCHAR(100),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    page_views INTEGER DEFAULT 0,
    plans_viewed INTEGER DEFAULT 0
);

-- Plan analytics - Enhanced analytics beyond basic views
CREATE TABLE IF NOT EXISTS plan_analytics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    views INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0,
    purchases INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0,
    cart_additions INTEGER DEFAULT 0,
    favorites_added INTEGER DEFAULT 0,
    search_appearances INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(plan_id, date)
);

-- =====================================================
-- NOTIFICATIONS & MESSAGING
-- =====================================================

-- Notifications table - User notifications system
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL, -- 'purchase_complete', 'plan_approved', 'review_received', etc.
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional structured data
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP WITH TIME ZONE,
    action_url VARCHAR(500), -- URL for notification action
    expires_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- SUPPORT & COMMUNICATION
-- =====================================================

-- Support tickets - Customer support system
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    email VARCHAR(255) NOT NULL, -- For non-registered users
    subject VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'technical', 'billing', 'plans', 'account')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'waiting', 'resolved', 'closed')),
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    plan_id UUID REFERENCES house_plans(id) ON DELETE SET NULL, -- Related plan if applicable
    purchase_id UUID REFERENCES purchases(id) ON DELETE SET NULL, -- Related purchase if applicable
    last_response_at TIMESTAMP WITH TIME ZONE,
    resolved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support ticket messages - Conversation thread
CREATE TABLE IF NOT EXISTS support_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    is_staff BOOLEAN DEFAULT false,
    message TEXT NOT NULL,
    attachments TEXT[], -- Array of attachment URLs
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- WISHLISTS & COLLECTIONS
-- =====================================================

-- User collections - Organized plan collections
CREATE TABLE IF NOT EXISTS user_collections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    is_default BOOLEAN DEFAULT false, -- Default "Favorites" collection
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Collection items - Plans in collections
CREATE TABLE IF NOT EXISTS collection_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    collection_id UUID NOT NULL REFERENCES user_collections(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    notes TEXT, -- User notes about the plan
    added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(collection_id, plan_id)
);

-- =====================================================
-- PERFORMANCE INDEXES
-- =====================================================

-- Users table indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_oauth ON users(oauth_provider, oauth_provider_id) WHERE oauth_provider IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON users(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Authentication indexes
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_user_id ON refresh_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_refresh_tokens_expires ON refresh_tokens(expires_at) WHERE is_revoked = false;
CREATE INDEX IF NOT EXISTS idx_password_resets_user_id ON password_resets(user_id);
CREATE INDEX IF NOT EXISTS idx_password_resets_expires ON password_resets(expires_at) WHERE used_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_email_verifications_user_id ON email_verifications(user_id);

-- Architects indexes
CREATE INDEX IF NOT EXISTS idx_architects_user_id ON architects(user_id);
CREATE INDEX IF NOT EXISTS idx_architects_verified ON architects(is_verified) WHERE is_verified = true;
CREATE INDEX IF NOT EXISTS idx_architects_rating ON architects(average_rating DESC);
CREATE INDEX IF NOT EXISTS idx_architects_specialties ON architects USING GIN(specialties);

-- Reviews indexes
CREATE INDEX IF NOT EXISTS idx_reviews_plan_id ON reviews(plan_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_verified_purchase ON reviews(is_verified_purchase) WHERE is_verified_purchase = true;
CREATE INDEX IF NOT EXISTS idx_review_votes_review_id ON review_votes(review_id);

-- Cart indexes
CREATE INDEX IF NOT EXISTS idx_cart_items_user_id ON cart_items(user_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_plan_id ON cart_items(plan_id);
CREATE INDEX IF NOT EXISTS idx_cart_items_added_at ON cart_items(added_at DESC);

-- Purchase indexes
CREATE INDEX IF NOT EXISTS idx_purchases_user_id ON purchases(user_id);
CREATE INDEX IF NOT EXISTS idx_purchases_plan_id ON purchases(plan_id);
CREATE INDEX IF NOT EXISTS idx_purchases_architect_id ON purchases(architect_id);
CREATE INDEX IF NOT EXISTS idx_purchases_status ON purchases(status);
CREATE INDEX IF NOT EXISTS idx_purchases_purchased_at ON purchases(purchased_at DESC);
CREATE INDEX IF NOT EXISTS idx_purchases_stripe_payment_intent ON purchases(stripe_payment_intent_id) WHERE stripe_payment_intent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_purchase_items_purchase_id ON purchase_items(purchase_id);

-- Download indexes
CREATE INDEX IF NOT EXISTS idx_downloads_user_id ON downloads(user_id);
CREATE INDEX IF NOT EXISTS idx_downloads_plan_id ON downloads(plan_id);
CREATE INDEX IF NOT EXISTS idx_downloads_token ON downloads(download_token);
CREATE INDEX IF NOT EXISTS idx_downloads_expires ON downloads(expires_at) WHERE downloaded_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_downloads_purchase_id ON downloads(purchase_id);

-- Session indexes
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_started_at ON user_sessions(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_plan_analytics_plan_date ON plan_analytics(plan_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_plan_analytics_date ON plan_analytics(date DESC);

-- Notification indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, is_read, created_at DESC) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Support indexes
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id, created_at);

-- Collection indexes
CREATE INDEX IF NOT EXISTS idx_user_collections_user_id ON user_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_collection_id ON collection_items(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_items_plan_id ON collection_items(plan_id);

-- =====================================================
-- UPDATE EXISTING TABLES
-- =====================================================

-- Add architect_id to house_plans table if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'house_plans' AND column_name = 'architect_id') THEN
        ALTER TABLE house_plans ADD COLUMN architect_id UUID REFERENCES architects(id);
        CREATE INDEX IF NOT EXISTS idx_house_plans_architect_id ON house_plans(architect_id);
    END IF;
END $$;

-- Add review aggregation columns to house_plans if not exists
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'house_plans' AND column_name = 'review_count') THEN
        ALTER TABLE house_plans ADD COLUMN review_count INTEGER DEFAULT 0;
        ALTER TABLE house_plans ADD COLUMN average_rating DECIMAL(3,2) DEFAULT 0.0;
        CREATE INDEX IF NOT EXISTS idx_house_plans_rating ON house_plans(average_rating DESC);
    END IF;
END $$;

-- =====================================================
-- TRIGGERS & FUNCTIONS
-- =====================================================

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers to new tables
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_architects_updated_at ON architects;
CREATE TRIGGER update_architects_updated_at BEFORE UPDATE ON architects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_reviews_updated_at ON reviews;
CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_cart_items_updated_at ON cart_items;
CREATE TRIGGER update_cart_items_updated_at BEFORE UPDATE ON cart_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_user_collections_updated_at ON user_collections;
CREATE TRIGGER update_user_collections_updated_at BEFORE UPDATE ON user_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_support_tickets_updated_at ON support_tickets;
CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update review aggregations
CREATE OR REPLACE FUNCTION update_plan_review_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update plan review statistics
    UPDATE house_plans SET
        review_count = (
            SELECT COUNT(*) FROM reviews 
            WHERE plan_id = COALESCE(NEW.plan_id, OLD.plan_id) 
            AND is_hidden = false
        ),
        average_rating = (
            SELECT COALESCE(AVG(rating), 0) FROM reviews 
            WHERE plan_id = COALESCE(NEW.plan_id, OLD.plan_id) 
            AND is_hidden = false
        )
    WHERE id = COALESCE(NEW.plan_id, OLD.plan_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Triggers for review aggregation
DROP TRIGGER IF EXISTS update_plan_review_stats_insert ON reviews;
CREATE TRIGGER update_plan_review_stats_insert 
    AFTER INSERT ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_plan_review_stats();

DROP TRIGGER IF EXISTS update_plan_review_stats_update ON reviews;
CREATE TRIGGER update_plan_review_stats_update 
    AFTER UPDATE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_plan_review_stats();

DROP TRIGGER IF EXISTS update_plan_review_stats_delete ON reviews;
CREATE TRIGGER update_plan_review_stats_delete 
    AFTER DELETE ON reviews 
    FOR EACH ROW EXECUTE FUNCTION update_plan_review_stats();

-- Function to update architect statistics
CREATE OR REPLACE FUNCTION update_architect_stats()
RETURNS TRIGGER AS $$
BEGIN
    -- Update architect plan count and rating
    UPDATE architects SET
        plan_count = (
            SELECT COUNT(*) FROM house_plans 
            WHERE architect_id = COALESCE(NEW.architect_id, OLD.architect_id)
            AND is_available = true
        ),
        average_rating = (
            SELECT COALESCE(AVG(hp.average_rating), 0) 
            FROM house_plans hp 
            WHERE hp.architect_id = COALESCE(NEW.architect_id, OLD.architect_id)
            AND hp.is_available = true
            AND hp.review_count > 0
        ),
        rating_count = (
            SELECT COALESCE(SUM(hp.review_count), 0) 
            FROM house_plans hp 
            WHERE hp.architect_id = COALESCE(NEW.architect_id, OLD.architect_id)
            AND hp.is_available = true
        )
    WHERE id = COALESCE(NEW.architect_id, OLD.architect_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ language 'plpgsql';

-- Function to create default favorites collection for new users
CREATE OR REPLACE FUNCTION create_default_collection()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO user_collections (user_id, name, description, is_default, is_public)
    VALUES (NEW.id, 'Favorites', 'My favorite house plans', true, false);
    
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create default collection for new users
DROP TRIGGER IF EXISTS create_user_default_collection ON users;
CREATE TRIGGER create_user_default_collection 
    AFTER INSERT ON users 
    FOR EACH ROW EXECUTE FUNCTION create_default_collection();

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for user profiles with extended information
CREATE VIEW user_profiles AS
SELECT 
    u.id,
    u.email,
    u.first_name,
    u.last_name,
    u.phone,
    u.role,
    u.is_active,
    u.is_verified,
    u.avatar_url,
    u.subscription_tier,
    u.created_at,
    u.updated_at,
    a.id as architect_id,
    a.company_name,
    a.bio as architect_bio,
    a.is_verified as architect_verified,
    a.plan_count,
    a.average_rating as architect_rating
FROM users u
LEFT JOIN architects a ON u.id = a.user_id;

-- View for plan details with aggregated data
CREATE VIEW plan_details AS
SELECT 
    hp.*,
    c.name as category_name,
    c.slug as category_slug,
    sc.name as subcategory_name,
    a.first_name as architect_first_name,
    a.last_name as architect_last_name,
    a.company_name as architect_company,
    a.is_verified as architect_verified,
    COUNT(DISTINCT pi.id) as image_count,
    COUNT(DISTINCT pf.id) as file_count,
    COUNT(DISTINCT uv.id) as total_views,
    COUNT(DISTINCT pd.id) as total_downloads
FROM house_plans hp
LEFT JOIN categories c ON hp.category_id = c.id
LEFT JOIN subcategories sc ON hp.subcategory_id = sc.id
LEFT JOIN architects a ON hp.architect_id = a.id
LEFT JOIN plan_images pi ON hp.id = pi.plan_id
LEFT JOIN plan_files pf ON hp.id = pf.plan_id
LEFT JOIN plan_views uv ON hp.id = uv.plan_id
LEFT JOIN plan_downloads pd ON hp.id = pd.plan_id
GROUP BY hp.id, c.id, sc.id, a.id;

-- =====================================================
-- INITIAL DATA SEEDING
-- =====================================================

-- Insert default categories if they don't exist
INSERT INTO categories (name, slug, description, sort_order) VALUES
    ('Modern', 'modern', 'Contemporary and modern home designs', 1),
    ('Traditional', 'traditional', 'Classic and timeless home styles', 2),
    ('Farmhouse', 'farmhouse', 'Rural and country-style homes', 3),
    ('Craftsman', 'craftsman', 'Arts and crafts movement inspired homes', 4),
    ('Colonial', 'colonial', 'American colonial style homes', 5),
    ('Mediterranean', 'mediterranean', 'Mediterranean and Spanish style homes', 6),
    ('Ranch', 'ranch', 'Single-story ranch style homes', 7),
    ('Victorian', 'victorian', 'Ornate Victorian era homes', 8),
    ('Contemporary', 'contemporary', 'Current architectural trends', 9),
    ('Tiny House', 'tiny-house', 'Small and efficient home designs', 10)
ON CONFLICT (slug) DO NOTHING;

-- Insert default plan features
INSERT INTO plan_features (name, description, category, icon) VALUES
    ('Open Floor Plan', 'Spacious open concept living areas', 'architectural', 'layout'),
    ('Master Suite', 'Large master bedroom with ensuite bathroom', 'architectural', 'bed'),
    ('Walk-in Closet', 'Spacious walk-in closet in master bedroom', 'architectural', 'closet'),
    ('Two-Car Garage', 'Attached garage for two vehicles', 'architectural', 'garage'),
    ('Three-Car Garage', 'Attached garage for three vehicles', 'architectural', 'garage'),
    ('Covered Porch', 'Covered front or back porch', 'architectural', 'porch'),
    ('Fireplace', 'Indoor fireplace in living area', 'lifestyle', 'fireplace'),
    ('Island Kitchen', 'Kitchen with center island', 'architectural', 'kitchen'),
    ('Pantry', 'Walk-in or butler pantry', 'architectural', 'pantry'),
    ('Home Office', 'Dedicated office or study space', 'lifestyle', 'office'),
    ('Mudroom', 'Entry mudroom with storage', 'architectural', 'storage'),
    ('Laundry Room', 'Dedicated laundry room', 'architectural', 'laundry'),
    ('Basement', 'Full or partial basement', 'architectural', 'basement'),
    ('Bonus Room', 'Flexible bonus space above garage', 'architectural', 'bonus'),
    ('Energy Efficient', 'Designed for energy efficiency', 'energy', 'energy'),
    ('Solar Ready', 'Pre-wired for solar panel installation', 'energy', 'solar'),
    ('Smart Home Ready', 'Pre-wired for smart home technology', 'technology', 'smart'),
    ('Universal Design', 'Accessible design features', 'accessibility', 'accessible'),
    ('Pool House', 'Separate pool house or cabana', 'lifestyle', 'pool'),
    ('Guest Suite', 'Private guest bedroom and bathroom', 'lifestyle', 'guest')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- CLEANUP & OPTIMIZATION
-- =====================================================

-- Update statistics for query planner
ANALYZE users;
ANALYZE architects;
ANALYZE reviews;
ANALYZE cart_items;
ANALYZE purchases;
ANALYZE downloads;
ANALYZE user_sessions;
ANALYZE notifications;
ANALYZE support_tickets;
ANALYZE user_collections;

-- Add comments for documentation
COMMENT ON TABLE users IS 'Core user authentication and profile information';
COMMENT ON TABLE architects IS 'Extended profiles for architect users with business information';
COMMENT ON TABLE reviews IS 'User reviews and ratings for house plans';
COMMENT ON TABLE cart_items IS 'Shopping cart items for pending purchases';
COMMENT ON TABLE purchases IS 'Completed purchase transactions with payment details';
COMMENT ON TABLE downloads IS 'Secure file download tracking with token-based access';
COMMENT ON TABLE user_sessions IS 'User session tracking for analytics and security';
COMMENT ON TABLE notifications IS 'In-app notification system for user communication';
COMMENT ON TABLE support_tickets IS 'Customer support ticket system';
COMMENT ON TABLE user_collections IS 'User-created collections of favorite plans';

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'PlanMorph core tables migration completed successfully!';
    RAISE NOTICE 'Created tables: users, architects, reviews, cart_items, purchases, downloads, and more';
    RAISE NOTICE 'Added performance indexes and triggers';
    RAISE NOTICE 'Seeded initial categories and features';
END $$;

