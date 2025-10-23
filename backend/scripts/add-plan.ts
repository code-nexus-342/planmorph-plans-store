import { db } from '../src/services/database';
import { logger } from '../src/utils/logger';

interface PlanData {
  title: string;
  description: string;
  category_id: string;
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  stories?: number;
  garage_spaces?: number;
  lot_width?: number;
  lot_depth?: number;
  house_width?: number;
  house_depth?: number;
  price_tier?: 'free' | 'standard' | 'premium' | 'exclusive';
  base_price?: number;
  is_featured?: boolean;
  is_popular?: boolean;
  thumbnail_url?: string;
  main_image_url?: string;
  meta_title?: string;
  meta_description?: string;
  search_keywords?: string[];
}

async function addPlan(planData: PlanData) {
  try {
    // Generate SEO slug from title
    const seo_slug = planData.title.toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-');

    // Insert the plan
    const result = await db.query(
      `INSERT INTO house_plans (
        title, description, seo_slug, category_id, 
        bedrooms, bathrooms, square_footage, stories, garage_spaces,
        lot_width, lot_depth, house_width, house_depth, price_tier,
        base_price, is_featured, is_popular, thumbnail_url, main_image_url,
        meta_title, meta_description, search_keywords, is_available
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20, $21, $22, true
      ) RETURNING *`,
      [
        planData.title,
        planData.description,
        seo_slug,
        planData.category_id,
        planData.bedrooms,
        planData.bathrooms,
        planData.square_footage,
        planData.stories || 1,
        planData.garage_spaces || 0,
        planData.lot_width,
        planData.lot_depth,
        planData.house_width,
        planData.house_depth,
        planData.price_tier || 'standard',
        planData.base_price || 999,
        planData.is_featured || false,
        planData.is_popular || false,
        planData.thumbnail_url,
        planData.main_image_url,
        planData.meta_title || planData.title,
        planData.meta_description || planData.description,
        planData.search_keywords || []
      ]
    );

    const plan = result.rows[0];
    logger.info(`✅ Plan created successfully: ${plan.title} (ID: ${plan.id})`);
    console.log('\n✅ Plan created successfully!');
    console.log('Plan ID:', plan.id);
    console.log('Title:', plan.title);
    console.log('Slug:', plan.seo_slug);
    
    return plan;
  } catch (error) {
    logger.error('❌ Error creating plan:', error);
    console.error('\n❌ Error creating plan:', error);
    throw error;
  }
}

// Example usage - modify these values
const examplePlan: PlanData = {
  title: 'Modern Farmhouse with Open Layout',
  description: 'Beautiful 3-bedroom farmhouse featuring contemporary design elements, open floor plan, and spacious living areas. Perfect for modern families seeking classic charm with updated amenities.',
  category_id: 'YOUR_CATEGORY_UUID_HERE', // Replace with actual category ID
  bedrooms: 3,
  bathrooms: 2.5,
  square_footage: 2400,
  stories: 2,
  garage_spaces: 2,
  lot_width: 60,
  lot_depth: 120,
  house_width: 55,
  house_depth: 45,
  price_tier: 'standard',
  base_price: 1299,
  is_featured: true,
  is_popular: false,
  thumbnail_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  main_image_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9',
  meta_title: 'Modern Farmhouse Plan - 3 Bed, 2.5 Bath, 2400 sq ft',
  meta_description: 'Explore this stunning modern farmhouse design featuring 3 bedrooms, 2.5 bathrooms, and 2400 square feet of thoughtfully designed living space.',
  search_keywords: ['farmhouse', 'modern', '3 bedroom', 'open layout', 'two story']
};

// Run the script
addPlan(examplePlan);
