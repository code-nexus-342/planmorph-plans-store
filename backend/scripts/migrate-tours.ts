import { db } from '../src/services/database';
import { logger } from '../src/utils/logger';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
  try {
    console.log('\n🚀 Running 3D Tours migration...\n');

    const migrationPath = path.join(__dirname, '../../database/migrations/006_create_3d_tours_table.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    await db.executeSqlFile(sql);

    console.log('✅ Migration completed successfully!\n');
    console.log('📊 Created:');
    console.log('   - tours_3d table');
    console.log('   - Sample 3D tour data');
    console.log('   - Indexes for performance\n');

    // Verify the data
    const result = await db.query('SELECT COUNT(*) as count FROM tours_3d');
    console.log(`✅ Inserted ${result.rows[0].count} 3D tours\n`);

    await db.close();
    process.exit(0);
  } catch (error) {
    logger.error('❌ Migration failed:', error);
    console.error('❌ Migration failed:', error);
    await db.close();
    process.exit(1);
  }
}

runMigration();
