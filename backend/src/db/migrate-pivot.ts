#!/usr/bin/env ts-node
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function runPivotMigration() {
  try {
    console.log('Starting client-only pivot migration...');
    
    const migrationPath = path.join(__dirname, 'migrations', '002_client_only_pivot.sql');
    const migrationSql = fs.readFileSync(migrationPath, 'utf-8');
    
    await pool.query(migrationSql);
    
    console.log('✓ Client-only pivot migration completed successfully');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

runPivotMigration();
