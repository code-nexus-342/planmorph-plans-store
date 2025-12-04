-- Create categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    icon_key VARCHAR(50), -- To map to frontend icons (e.g., 'Home', 'Building2')
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add category_id to designs table
ALTER TABLE designs ADD COLUMN category_id INTEGER REFERENCES categories(id);

-- Seed initial categories
INSERT INTO categories (name, slug, icon_key, description) VALUES
('Villas', 'villas', 'Home', 'Luxurious standalone houses'),
('Bungalows', 'bungalows', 'Home', 'Single-story houses'),
('Maisonettes', 'maisonettes', 'Layers', 'Multi-story houses'),
('Apartments', 'apartments', 'Building2', 'Multi-unit residential buildings'),
('Extensions', 'extensions', 'Grid', 'Additions to existing structures'),
('Commercial', 'commercial', 'Briefcase', 'Office and retail spaces');
