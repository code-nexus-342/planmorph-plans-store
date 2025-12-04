#!/usr/bin/env ts-node
import { Pool } from 'pg';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';
import { getPoolConfig } from './index';

dotenv.config();

const pool = new Pool(getPoolConfig());

async function runMigration() {
  try {
    console.log('Starting update_media_type_enum migration...');
    
    const migrationPath = path.join(__dirname, 'migrations', '012_update_media_type_enum.sql');
    const migration = fs.readFileSync(migrationPath, 'utf-8');
    
    await pool.query(migration);
    
    console.log('✓ Update media_type enum migration executed successfully');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
