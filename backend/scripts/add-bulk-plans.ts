import { db } from '../src/services/database';
import { logger } from '../src/utils/logger';

interface BulkPlanData {
  title: string;
  description: string;
  category_name: string; // Will lookup category ID
  bedrooms: number;
  bathrooms: number;
  square_footage: number;
  stories?: number;
  garage_spaces?: number;
  base_price?: number;
  is_featured?: boolean;
  thumbnail_url?: string;
}

const samplePlans: BulkPlanData[] = [
  {
    title: 'Modern Farmhouse Haven',
    description: 'Charming 3-bedroom farmhouse with wrap-around porch and open concept living',
    category_name: 'Farmhouse',
    bedrooms: 3,
    bathrooms: 2,
    square_footage: 2100,
    stories: 2,
    garage_spaces: 2,
    base_price: 1199,
    is_featured: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9'
  },
  {
    title: 'Contemporary Urban Oasis',
    description: 'Sleek 2-bedroom contemporary design with floor-to-ceiling windows',
    category_name: 'Contemporary',
    bedrooms: 2,
    bathrooms: 2,
    square_footage: 1800,
    stories: 2,
    garage_spaces: 1,
    base_price: 1399,
    is_featured: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c'
  },
  {
    title: 'Classic Colonial Estate',
    description: 'Timeless 4-bedroom colonial with formal dining and traditional charm',
    category_name: 'Colonial',
    bedrooms: 4,
    bathrooms: 3,
    square_footage: 3200,
    stories: 2,
    garage_spaces: 2,
    base_price: 1599,
    is_featured: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c'
  },
  {
    title: 'Craftsman Bungalow Retreat',
    description: 'Cozy 3-bedroom craftsman featuring rich woodwork and covered front porch',
    category_name: 'Craftsman',
    bedrooms: 3,
    bathrooms: 2,
    square_footage: 1900,
    stories: 1,
    garage_spaces: 2,
    base_price: 1099,
    is_featured: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1600607687644-c7171b42498b'
  },
  {
    title: 'Mediterranean Villa Paradise',
    description: 'Luxurious 5-bedroom Mediterranean villa with courtyard and tile roof',
    category_name: 'Mediterranean',
    bedrooms: 5,
    bathrooms: 4,
    square_footage: 4200,
    stories: 2,
    garage_spaces: 3,
    base_price: 2199,
    is_featured: true,
    thumbnail_url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3'
  },
  {
    title: 'Ranch Style Comfort',
    description: 'Spacious 3-bedroom ranch with split bedroom layout and attached garage',
    category_name: 'Ranch',
    bedrooms: 3,
    bathrooms: 2,
    square_footage: 2000,
    stories: 1,
    garage_spaces: 2,
    base_price: 999,
    is_featured: false,
    thumbnail_url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d'
  }
];

async function addBulkPlans() {
  try {
    console.log('\n🚀 Starting bulk plan import...\n');

    // First, get all categories
    const categoriesResult = await db.query('SELECT id, name, slug FROM categories');
    const categories = categoriesResult.rows;

    if (categories.length === 0) {
      console.log('❌ No categories found. Please create categories first.');
      return;
    }

    console.log(`✅ Found ${categories.length} categories\n`);

    let successCount = 0;
    let failCount = 0;

    for (const planData of samplePlans) {
      try {
        // Find category ID by name
        const category = categories.find(c => 
          c.name.toLowerCase().includes(planData.category_name.toLowerCase())
        );

        if (!category) {
          console.log(`⚠️  Skipping "${planData.title}" - Category "${planData.category_name}" not found`);
          failCount++;
          continue;
        }

        // Generate SEO slug
        const seo_slug = planData.title.toLowerCase()
          .replace(/[^a-z0-9\s]/g, '')
          .replace(/\s+/g, '-');

        // Insert the plan
        const result = await db.query(
          `INSERT INTO house_plans (
            title, description, seo_slug, category_id, 
            bedrooms, bathrooms, square_footage, stories, garage_spaces,
            base_price, is_featured, thumbnail_url, main_image_url,
            meta_title, meta_description, is_available, price_tier
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, true, 'standard'
          ) RETURNING id, title`,
          [
            planData.title,
            planData.description,
            seo_slug,
            category.id,
            planData.bedrooms,
            planData.bathrooms,
            planData.square_footage,
            planData.stories || 1,
            planData.garage_spaces || 0,
            planData.base_price || 999,
            planData.is_featured || false,
            planData.thumbnail_url,
            planData.thumbnail_url, // Use same for main image
            planData.title,
            planData.description
          ]
        );

        const plan = result.rows[0];
        console.log(`✅ Created: ${plan.title} (ID: ${plan.id})`);
        successCount++;

      } catch (error: any) {
        console.log(`❌ Failed: ${planData.title} - ${error.message}`);
        failCount++;
      }
    }

    console.log('\n━'.repeat(80));
    console.log(`\n📊 Import Summary:`);
    console.log(`   ✅ Success: ${successCount} plans`);
    console.log(`   ❌ Failed: ${failCount} plans`);
    console.log(`   📦 Total: ${samplePlans.length} plans\n`);

  } catch (error) {
    logger.error('❌ Error in bulk import:', error);
    console.error('\n❌ Error in bulk import:', error);
  }
}

// Run the script
addBulkPlans();
