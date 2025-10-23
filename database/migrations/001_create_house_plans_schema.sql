-- House Plans Database Schema
-- Optimized for performance with proper indexing and relationships

-- Categories table for plan organization
CREATE TABLE categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon_url VARCHAR(500),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subcategories for more granular classification
CREATE TABLE subcategories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(category_id, slug)
);

-- Main house plans table (metadata only, no file storage)
CREATE TABLE house_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic information
    title VARCHAR(200) NOT NULL,
    description TEXT,
    seo_slug VARCHAR(200) NOT NULL UNIQUE,
    
    -- Classification
    category_id UUID NOT NULL REFERENCES categories(id),
    subcategory_id UUID REFERENCES subcategories(id),
    
    -- Specifications
    bedrooms INTEGER NOT NULL CHECK (bedrooms >= 0),
    bathrooms DECIMAL(3,1) NOT NULL CHECK (bathrooms >= 0),
    square_footage INTEGER NOT NULL CHECK (square_footage > 0),
    stories INTEGER NOT NULL DEFAULT 1 CHECK (stories >= 1),
    garage_spaces INTEGER DEFAULT 0 CHECK (garage_spaces >= 0),
    
    -- Dimensions
    lot_width DECIMAL(8,2),
    lot_depth DECIMAL(8,2),
    house_width DECIMAL(8,2),
    house_depth DECIMAL(8,2),
    
    -- Pricing and availability
    price_tier VARCHAR(20) DEFAULT 'standard' CHECK (price_tier IN ('free', 'standard', 'premium', 'exclusive')),
    base_price DECIMAL(10,2) DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    is_available BOOLEAN DEFAULT true,
    
    -- File references (URLs to cloud storage)
    thumbnail_url VARCHAR(500),
    main_image_url VARCHAR(500),
    
    -- Performance optimization fields
    view_count INTEGER DEFAULT 0,
    download_count INTEGER DEFAULT 0,
    favorite_count INTEGER DEFAULT 0,
    popularity_score DECIMAL(5,2) DEFAULT 0,
    
    -- SEO and search optimization
    meta_title VARCHAR(200),
    meta_description TEXT,
    search_keywords TEXT[], -- PostgreSQL array for flexible keyword storage
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    published_at TIMESTAMP WITH TIME ZONE
);

-- Plan images table for multiple images per plan
CREATE TABLE plan_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    image_type VARCHAR(50) NOT NULL CHECK (image_type IN ('exterior', 'interior', 'floor_plan', 'elevation', '3d_render')),
    title VARCHAR(200),
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plan files table for downloadable files
CREATE TABLE plan_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50) NOT NULL CHECK (file_type IN ('blueprint_pdf', 'specification_pdf', 'cad_dwg', 'revit_rvt', '3d_model')),
    file_name VARCHAR(200) NOT NULL,
    file_size BIGINT, -- in bytes
    description TEXT,
    is_premium BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plan features for flexible feature management
CREATE TABLE plan_features (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(100),
    category VARCHAR(50), -- 'architectural', 'energy', 'lifestyle', etc.
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Many-to-many relationship between plans and features
CREATE TABLE plan_feature_assignments (
    plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    feature_id UUID NOT NULL REFERENCES plan_features(id) ON DELETE CASCADE,
    PRIMARY KEY (plan_id, feature_id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User favorites for personalization
CREATE TABLE user_favorites (
    user_id UUID NOT NULL, -- References users table from auth system
    plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    PRIMARY KEY (user_id, plan_id)
);

-- Plan views for analytics
CREATE TABLE plan_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    user_id UUID, -- Optional, can be null for anonymous views
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Plan downloads tracking
CREATE TABLE plan_downloads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    plan_id UUID NOT NULL REFERENCES house_plans(id) ON DELETE CASCADE,
    file_id UUID NOT NULL REFERENCES plan_files(id) ON DELETE CASCADE,
    user_id UUID NOT NULL, -- Must be authenticated to download
    downloaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Performance Indexes
-- Primary search and filtering indexes
CREATE INDEX idx_house_plans_category ON house_plans(category_id);
CREATE INDEX idx_house_plans_subcategory ON house_plans(subcategory_id);
CREATE INDEX idx_house_plans_bedrooms ON house_plans(bedrooms);
CREATE INDEX idx_house_plans_bathrooms ON house_plans(bathrooms);
CREATE INDEX idx_house_plans_square_footage ON house_plans(square_footage);
CREATE INDEX idx_house_plans_price_tier ON house_plans(price_tier);
CREATE INDEX idx_house_plans_is_available ON house_plans(is_available);

-- Performance and popularity indexes
CREATE INDEX idx_house_plans_popularity ON house_plans(popularity_score DESC);
CREATE INDEX idx_house_plans_featured ON house_plans(is_featured, popularity_score DESC);
CREATE INDEX idx_house_plans_published ON house_plans(published_at DESC) WHERE published_at IS NOT NULL;

-- Search optimization indexes
CREATE INDEX idx_house_plans_search_keywords ON house_plans USING GIN(search_keywords);
CREATE INDEX idx_house_plans_title_search ON house_plans USING GIN(to_tsvector('english', title));
CREATE INDEX idx_house_plans_description_search ON house_plans USING GIN(to_tsvector('english', description));

-- Composite indexes for common query patterns
CREATE INDEX idx_house_plans_category_popularity ON house_plans(category_id, popularity_score DESC);
CREATE INDEX idx_house_plans_specs_search ON house_plans(bedrooms, bathrooms, square_footage);
CREATE INDEX idx_house_plans_available_featured ON house_plans(is_available, is_featured, popularity_score DESC);

-- Foreign key indexes for better join performance
CREATE INDEX idx_plan_images_plan_id ON plan_images(plan_id);
CREATE INDEX idx_plan_files_plan_id ON plan_files(plan_id);
CREATE INDEX idx_plan_views_plan_id ON plan_views(plan_id);
CREATE INDEX idx_plan_downloads_plan_id ON plan_downloads(plan_id);
CREATE INDEX idx_plan_downloads_user_id ON plan_downloads(user_id);

-- Partial indexes for active records
CREATE INDEX idx_categories_active ON categories(name) WHERE is_active = true;
CREATE INDEX idx_subcategories_active ON subcategories(category_id, name) WHERE is_active = true;

-- Update timestamp trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subcategories_updated_at BEFORE UPDATE ON subcategories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_house_plans_updated_at BEFORE UPDATE ON house_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for common queries
-- Popular plans view
CREATE VIEW popular_plans AS
SELECT 
    hp.*,
    c.name as category_name,
    sc.name as subcategory_name,
    COUNT(DISTINCT uv.id) as recent_views,
    COUNT(DISTINCT uf.user_id) as total_favorites
FROM house_plans hp
LEFT JOIN categories c ON hp.category_id = c.id
LEFT JOIN subcategories sc ON hp.subcategory_id = sc.id
LEFT JOIN plan_views uv ON hp.id = uv.plan_id AND uv.viewed_at > NOW() - INTERVAL '30 days'
LEFT JOIN user_favorites uf ON hp.id = uf.plan_id
WHERE hp.is_available = true AND hp.published_at IS NOT NULL
GROUP BY hp.id, c.name, sc.name
ORDER BY hp.popularity_score DESC, recent_views DESC;

-- Featured plans view
CREATE VIEW featured_plans AS
SELECT 
    hp.*,
    c.name as category_name,
    sc.name as subcategory_name
FROM house_plans hp
LEFT JOIN categories c ON hp.category_id = c.id
LEFT JOIN subcategories sc ON hp.subcategory_id = sc.id
WHERE hp.is_featured = true AND hp.is_available = true AND hp.published_at IS NOT NULL
ORDER BY hp.popularity_score DESC;

COMMENT ON TABLE house_plans IS 'Main table for house plan metadata. Files are stored in cloud storage with URLs referenced here.';
COMMENT ON COLUMN house_plans.popularity_score IS 'Calculated score based on views, downloads, and favorites for sorting';
COMMENT ON COLUMN house_plans.search_keywords IS 'Array of keywords for full-text search optimization';
COMMENT ON TABLE plan_views IS 'Analytics table for tracking plan views. Consider partitioning by date for large datasets';
COMMENT ON TABLE plan_downloads IS 'Tracks downloads for analytics and user access control';
