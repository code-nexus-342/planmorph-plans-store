import { Pool } from 'pg';
import dotenv from 'dotenv';
import { getPoolConfig } from './index';

dotenv.config();

const pool = new Pool(getPoolConfig());

async function inspectCustomRequests() {
  try {
    const cols = await pool.query(`
        SELECT column_name, data_type 
        FROM information_schema.columns 
        WHERE table_name = 'custom_design_requests'
    `);
    console.log('custom_design_requests columns:', cols.rows);

    await pool.end();
  } catch (error) {
    console.error('Error:', error);
    await pool.end();
  }
}

inspectCustomRequests();
