import { db } from '../src/services/database';
import { logger } from '../src/utils/logger';

async function listCategories() {
  try {
    console.log('\n📋 Fetching all categories...\n');
    
    const result = await db.query(
      'SELECT id, name, slug, description FROM categories ORDER BY name ASC'
    );

    if (result.rows.length === 0) {
      console.log('❌ No categories found in the database.');
      console.log('💡 You may need to run database migrations first.\n');
      return;
    }

    console.log(`✅ Found ${result.rows.length} categories:\n`);
    console.log('━'.repeat(80));
    
    result.rows.forEach((category, index) => {
      console.log(`${index + 1}. ${category.name}`);
      console.log(`   ID: ${category.id}`);
      console.log(`   Slug: ${category.slug}`);
      if (category.description) {
        console.log(`   Description: ${category.description}`);
      }
      console.log('━'.repeat(80));
    });

    console.log('\n💡 Copy the ID value to use in your plan creation script.\n');
    
  } catch (error) {
    logger.error('❌ Error fetching categories:', error);
    console.error('\n❌ Error fetching categories:', error);
  }
}

listCategories();
