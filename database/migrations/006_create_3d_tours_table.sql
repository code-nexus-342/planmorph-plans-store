-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create 3D Tours table
CREATE TABLE IF NOT EXISTS tours_3d (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  video_url VARCHAR(500),
  duration VARCHAR(50),
  views INTEGER DEFAULT 0,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES house_plans(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_tours_3d_category ON tours_3d(category_id);
CREATE INDEX IF NOT EXISTS idx_tours_3d_plan ON tours_3d(plan_id);
CREATE INDEX IF NOT EXISTS idx_tours_3d_created_at ON tours_3d(created_at);

-- Insert sample 3D tours data
INSERT INTO tours_3d (title, description, image_url, video_url, duration, views, category_id) 
SELECT 
  'Modern Farmhouse Virtual Tour',
  'Experience the spacious layout and rustic charm of this contemporary farmhouse design',
  'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800',
  'https://example.com/tours/farmhouse-1',
  '3:45',
  1250,
  c.id
FROM categories c WHERE c.slug = 'farmhouse' LIMIT 1;

INSERT INTO tours_3d (title, description, image_url, video_url, duration, views, category_id) 
SELECT 
  'Contemporary Glass House',
  'Walk through this stunning modern home featuring floor-to-ceiling windows',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
  'https://example.com/tours/contemporary-1',
  '4:20',
  2100,
  c.id
FROM categories c WHERE c.slug = 'contemporary' LIMIT 1;

INSERT INTO tours_3d (title, description, image_url, video_url, duration, views, category_id) 
SELECT 
  'Craftsman Bungalow Showcase',
  'Explore the detailed woodwork and cozy spaces of this classic craftsman design',
  'https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=800',
  'https://example.com/tours/craftsman-1',
  '3:15',
  890,
  c.id
FROM categories c WHERE c.slug = 'craftsman' LIMIT 1;

INSERT INTO tours_3d (title, description, image_url, video_url, duration, views, category_id) 
SELECT 
  'Luxury Mediterranean Villa',
  'Tour this elegant Mediterranean estate with courtyard and pool',
  'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
  'https://example.com/tours/mediterranean-1',
  '5:30',
  3500,
  c.id
FROM categories c WHERE c.slug = 'mediterranean' LIMIT 1;

INSERT INTO tours_3d (title, description, image_url, video_url, duration, views, category_id) 
SELECT 
  'Modern Minimalist Residence',
  'Discover the clean lines and open spaces of this minimalist masterpiece',
  'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
  'https://example.com/tours/modern-1',
  '4:00',
  1850,
  c.id
FROM categories c WHERE c.slug = 'modern' LIMIT 1;

INSERT INTO tours_3d (title, description, image_url, video_url, duration, views, category_id) 
SELECT 
  'Traditional Colonial Home',
  'Experience the timeless elegance of this classic colonial design',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
  'https://example.com/tours/traditional-1',
  '3:50',
  1420,
  c.id
FROM categories c WHERE c.slug = 'colonial' LIMIT 1;

INSERT INTO tours_3d (title, description, image_url, video_url, duration, views, category_id) 
SELECT 
  'Rustic Ranch Estate',
  'Explore this sprawling ranch-style home with mountain views',
  'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
  'https://example.com/tours/ranch-1',
  '4:45',
  1680,
  c.id
FROM categories c WHERE c.slug = 'ranch' LIMIT 1;

INSERT INTO tours_3d (title, description, image_url, video_url, duration, views, category_id) 
SELECT 
  'Victorian Dream Home',
  'Step into the ornate beauty of this restored Victorian treasure',
  'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
  'https://example.com/tours/victorian-1',
  '4:10',
  2300,
  c.id
FROM categories c WHERE c.slug = 'victorian' LIMIT 1;

INSERT INTO tours_3d (title, description, image_url, video_url, duration, views, category_id) 
SELECT 
  'Beach House Sanctuary',
  'Feel the ocean breeze in this stunning coastal retreat',
  'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
  'https://example.com/tours/beach-1',
  '3:30',
  2750,
  c.id
FROM categories c WHERE c.slug LIKE '%beach%' OR c.slug LIKE '%coastal%' LIMIT 1;

-- Update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_tours_3d_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_tours_3d_updated_at
    BEFORE UPDATE ON tours_3d
    FOR EACH ROW
    EXECUTE FUNCTION update_tours_3d_updated_at();
