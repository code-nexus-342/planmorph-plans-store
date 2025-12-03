import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runMigration() {
  try {
    console.log('Running migration 001_add_professional_roles.sql...');
    
    const migrationPath = path.join(__dirname, 'migrations', '001_add_professional_roles.sql');
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
