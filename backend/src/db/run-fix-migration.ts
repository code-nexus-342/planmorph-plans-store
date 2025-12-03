import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { getPoolConfig } from './index';

dotenv.config();

const pool = new Pool(getPoolConfig());

async function runMigration() {
  try {
    console.log('Running migration 003_add_contact_and_custom_requests.sql...');
    
    const migrationPath = path.join(__dirname, 'migrations', '003_add_contact_and_custom_requests.sql');
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
