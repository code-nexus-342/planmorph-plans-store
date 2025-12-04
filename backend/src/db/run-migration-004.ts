import pool from './index';
import * as fs from 'fs';
import * as path from 'path';

async function runMigration() {
  try {
    console.log('Running migration 004_add_user_settings.sql...');
    
    const migrationPath = path.join(__dirname, 'migrations', '004_add_user_settings.sql');
    const sql = fs.readFileSync(migrationPath, 'utf-8');
    
    await pool.query(sql);
    
    console.log('✓ Migration applied successfully');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
