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
    console.log('Starting add_cad_support migration...');
    
    const migrationPath = path.join(__dirname, 'migrations', '011_add_cad_support.sql');
    const migration = fs.readFileSync(migrationPath, 'utf-8');
    
    await pool.query(migration);
    
    console.log('✓ CAD support migration executed successfully');
    
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    await pool.end();
    process.exit(1);
  }
}

runMigration();
